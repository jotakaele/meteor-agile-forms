//Definimos valores por defecto en tableToold
var tableToolsDefaults = {
        sSwfPath: "/datatables/tabletools/swf/copy_csv_xls_pdf.swf",
        aButtons: [{
            sExtends: "copy",
            sButtonText: "<i class='fa fa-copy'></i>"
        }, {
            sExtends: "pdf",
            sButtonText: "<i class='fa fa-file-pdf-o'></i>"
        }, {
            sExtends: "xls",
            sButtonText: "<i class='fa fa-file-excel-o'></i>"
        }, {
            sExtends: "print",
            sButtonText: "<i class='fa fa-print'></i>"
        }]
    }
    /**
     * Ceea el objeto dataTables y lo mantiene reactivo
     * @param {object} options Lista de opciones cargadas desde la configuración del listado en YAML
     */
ReactiveDatatable = function(options) {
    dbg("options", o2S(options))
    var tableID = "datatable";
    var self = this;
    //Opciones por defecto de dataTables
    this.options = _.defaults(options, {
        // Any of these can be overriden by passing an options 
        // object into your ReactiveDatatable template (see readme)
        stateSave: true,
        stateDuration: -1, // Store data for session only
        paging: false,
        dom: "fiTt",
        columnDefs: [{ // Global default blank value to avoid popup on missing data
            targets: "_all",
            defaultContent: "–––"
        }],
        stateLoadParams: function(settings, data) {
            // Make it easy to change to the stored page on .update()
            self.page = data.start / data.length;
        }
    });
    this.options.language = _.defaults(options.language || {}, datatablesTr[s('lang')]) //note @datatablesTr[s('lang')] está definido en el módulo translations
    this.options.tableTools = _.defaults(options.tableTools || {}, tableToolsDefaults)
        // Help Blaze cleanly remove entire datatable when changing template / route by
        // wrapping table in existing element (#datatable_wrap) defined in the template.
    var table = document.createElement('table');
    table.id = tableID;
    table.className = "table dataTable";
    // Render the table element and turn it into a DataTable
    $("#" + options.divName).append(table);
    this.dataTable = $(table).DataTable(this.options);
};
/**
 * Actualiza las filas de la tabla cada vez que la fuente reactiva con que ha sido llamada ReactiveDatatables
 * @param  {array} data El array de objetos (los datos)
 */
ReactiveDatatable.prototype.update = function(data) {
    if (!data.length) return;
    var self = this;
    self.dataTable.clear().rows.add(data).draw(false).page(self.page || 0) // XXX: Can we avoid drawing twice?
        .draw(false); // I couldn't get the page drawing to work otherwise
};
Template.list.rendered = function() {
    cargaList({
        name: this.data.name
    })
};
/**
 * Extrae los datos a apartir de la confuiguración del listado y llama a ReactiveDatatables
 * @param  {object} theOptions Datos para lanzar la consulta, se espera como mínimo name o src y div
 * @return {[type]}            [description]
 */
cargaList = function(theOptions) {
        opt = theOptions
            //dbg("theOptions", o2S(theOptions))
            //Definimos erro por si pasamos algo diferente a un objeto
        if (typeof theOptions != 'object') {
            console.error("Se requiere un objeto con la propiedad src o name y div");
            return null
        }
        //Si esta definido src...
        if (theOptions.src) {
            var idTmpList = makeId(4)
            Session.set(idTmpList, JSON.parse(substSnippets(JSON.stringify(sanitizeObjectNameKeys(theOptions.src)))))
            var src = Session.get(idTmpList)
        }
        //Si no esta definio src y esta definio name, leeemos la configuración de origen list para obtener src
        else if (theOptions.name) {
            //Definimos nombre para usar
            var listName = theOptions.name
                //Si no existe el origen el la sesion, lo creamos
            if (!Session.get('lists_' + listName)) {
                Session.set('lists_' + listName, JSON.parse(substSnippets(JSON.stringify(sanitizeObjectNameKeys(masterConnection.list.findOne({
                    name: listName
                }).content)))))
            }
            /// y lo extraemos
            var src = parseEvalObjects(Session.get('lists_' + listName))
        }
        //note La configuración del listado (src) la cargamos desde una variable de session, para que sea en efecto una fuente reactiva.
        //Extraemos las opciones especificas para datatables de src
        options = src.list.datatables || {}
        var columns = []

        //Creamos options.columns automáticamente, a apartir de los nombres de campos definidos
        var iIndex
        _.each(_.keys(src.list.sources.main.options.fields).concat(_.without(_.keys(src.list.sources), 'main')), function(key, index) {
                var o = {}

                o.title = _.humanize(key)
                o.data = key
                o.className = 'cell-' + key
                columns.push(o)
                    //Tratamiento especial para la columnas index (si existe)
                if (key == 'index') {
                    iIndex = index
                    delete o.data
                    delete o.title
                    o.searchable = false
                    o.orderable = false

                }
            })
            //onl default options
        var newOptions = {
                columns: columns,
            }
            //Si hemos pasado un div especifico lo tenemos en cuenta

        newOptions.divName = theOptions.div || "datatable_wrapper"

        //Cargamos el css especifico, si existe
        if (src.list.css) {
            processListCssKey(newOptions.divName, src.list.css).prependTo($('#' + newOptions.divName))
        }
        //Cargamos el html before 
        if (src.list.html) {
            if (src.list.html.before) {
                $(substSnippets(src.list.html.before)).prependTo($('#' + newOptions.divName))
            }
        }
        //Extendemos las opciones con newOptions
        _.extend(options, newOptions)
            //CReamos datatables
        rTable = new ReactiveDatatable(options)
            //Activamos eventos para la columna index (si existe)
        dbg("iIndex", iIndex)
        if (iIndex >= 0) {
            var t = rTable.dataTable

            t.on('order.dt search.dt', function() {
                t.column(iIndex, {
                    search: 'applied',
                    order: 'applied'
                }).nodes().each(function(cell, i) {
                    cell.innerHTML = i + 1;
                });
            }).draw();
        }
        //new $.fn.dataTable.Responsive(datatable);
        //Reactivamente ....
        Tracker.autorun(function(a) {
            //Preguntamos por los los dats a partir de config
            if (idTmpList) {
                var dataSrc = Session.get(idTmpList)
            } else {
                var dataSrc = Session.get('lists_' + listName)
            }
            data = autol({
                    src: dataSrc
                })
                //Se actualiza la tabla con los datos
            rTable.update(data)
        })
        if (src.list.html) {
            if (src.list.html.after) {
                $(substSnippets(src.list.html.after)).appendTo($('#' + newOptions.divName))
            }
        }
    }
    //done Anadir after, before y css eal nuevo modelo de tablas
    //todo Dar formato al nuevo tipo de objetos en datatables
    //todo indicar el tipo en cada celda renderizada (plugin?)
    //done Habilitar plugins, minimo tabletools
