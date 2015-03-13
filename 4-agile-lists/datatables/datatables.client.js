/*dataTableData = function () {
    return masterConnection.recetas.find().fetch()
};*/
/*var optionsObject = {
    columns: [{
        title: 'Autor',
        data: 'autor', // note: access nested data like this
        className: 'nameColumn'
    }],
    // ... see jquery.dataTables docs for more
}
Template.containsTheDataTable.helpers({
    reactiveDataFunction: function () {
        var name = this.name
        dataTableData = function () {
            dbg('name', name)
            a = {
                src: sanitizeObjectNameKeys(masterConnection.list.findOne({
                    name: name
                }).content)
            }
            var data = autol(a)
            dbg('data', data)
            return data
                //      return masterConnection.recetas.find().fetch()
        };
        return dataTableData;
    },
    optionsObject: function () {
        var a = sanitizeObjectNameKeys(masterConnection.list.findOne({
            name: this.name
        }).content.list.options)
        dbg("a", a)
        return a
    }
});*/
ReactiveDatatable = function (options) {
    if (!options.divName) {
        options.divName = "datatable_wrapper"
    }
    var tableID = "datatable";
    var self = this;
    this.options = options = _.defaults(options, {
        // Any of these can be overriden by passing an options 
        // object into your ReactiveDatatable template (see readme)
        stateSave: true,
        stateDuration: -1, // Store data for session only
        pageLength: 5,
        lengthMenu: [3, 5, 10, 50, 100],
        columnDefs: [{ // Global default blank value to avoid popup on missing data
            targets: "_all",
            defaultContent: "–––"
        }],
        stateLoadParams: function (settings, data) {
            // Make it easy to change to the stored page on .update()
            self.page = data.start / data.length;
        }
    });
    // Help Blaze cleanly remove entire datatable when changing template / route by
    // wrapping table in existing element (#datatable_wrap) defined in the template.
    var table = document.createElement('table');
    table.id = tableID;
    table.className = "table dataTable";
    // Render the table element and turn it into a DataTable
    $("#" + options.divName).append(table);
    this.datatable = $(table).DataTable(options);
};
ReactiveDatatable.prototype.update = function (data) {
    if (!data.length) return;
    var self = this;
    self.datatable.clear().rows.add(data).draw(false).page(self.page || 0) // XXX: Can we avoid drawing twice?
        .draw(false); // I couldn't get the page drawing to work otherwise
};
Template.listdt.rendered = function () {
    cargaListdt({
        name: this.data.name
    })
};
cargaListdt = function (theOptions) {
    //Definimos erro por si pasamos algo diferente a un objeto
    if (typeof theOptions != 'object') {
        console.error("Se requiere un objeto con la propiedad src o name y div");
        return null
    }
    if (theOptions.src) {
        var idTmpList = makeId(4)
        Session.set(idTmpList, JSON.parse(substSnippets(JSON.stringify(sanitizeObjectNameKeys(theOptions.src)))))
        var src = Session.get(idTmpList)
    } else if (theOptions.name) {
        //Definimos nombre para usar
        var listName = theOptions.name
            //Si no existe el origen el la sesion, lo creamos
        if (!Session.get('lists_' + listName)) {
            Session.set('lists_' + listName, JSON.parse(substSnippets(JSON.stringify(sanitizeObjectNameKeys(masterConnection.list.findOne({
                name: listName
            }).content)))))
        }
        /// y lo extraemos
        var src = Session.get('lists_' + listName)
    }
    //Extraemos las opciones del origen    
    options = src.list.options || {}
    dbg('src', src)
    var columns = []
        //Creamos options.columns automáticamente, a apartir de los nombres de campos definidos
    _.each(_.keys(src.list.sources.main.options.fields).concat(_.without(_.keys(src.list.sources), 'main')), function (key) {
            var o = {}
            o.title = _.humanize(key)
            o.data = key
            o.className = 'cell-' + key
            columns.push(o)
        })
        //onl default options
    var newOptions = {
            columns: columns,
        }
        //Si hemos pasado un div especifico lo tenemos en cuenta
    if (theOptions.div) {
        newOptions.divName = theOptions.div
    }
    //Extendemos las opciones con newOptions
    _.extend(options, newOptions)
        //CReamos datatables
    var dataTable = new ReactiveDatatable(options)
        //new $.fn.dataTable.Responsive(datatable);
        //Reactivamente ....
    Tracker.autorun(function (a) {
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
        dataTable.update(data)
    })
}

