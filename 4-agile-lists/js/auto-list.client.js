// ...
autol = function autol(options) {
    //console.clear()
    this.div = options.div || 'listdest';
    //recuperamos los datos de las colecciones indicadas en la configuración
    this.list = options.src.list
    this.html = options.src.html || {}
    this.css = options.src.css || {}
    data = {}

    function getCollectionData() {
        var parent = this;
        _.each(this.list.sources, function (value, key) {
            if (value.relation) {
                var relationSource = value.relation.source.split('@')[0]
                var relationKey = value.relation.source.split('@')[1]
                    //Extraemos los ids (o el campo indicado , no tiene necesariamente que ser _id)
                var ids = data[relationSource].map(function (val) {
                        return val[relationKey]
                    })
                    //Construimos el objeto selector, para extender el ya existente
                var objIn = JSON.parse('{"' + value.relation.self + '":""}')
                objIn[value.relation.self] = {
                    $in: ids
                }
                value.selector = value.selector || {}
                _.extend(value.selector, objIn)
            }
            value.options.fields["_id"] = 1 //Agregamos el campo id aunque no se haya uindicado, puesto que siempre lo necesitamos
            if (value.relation) { //Si hay value relation indicamos en fields el campo que vamos a usar para la relacion
                value.options.fields[value.relation.self] = 1
            }
            data[key] = doQuery('find', value.collection, value.selector, value.options)
        })
        return data
    }

    function mergeToMain() {
        var parent = this
        _.each(this.list.sources, function (value, key) {
            if (key != 'main') {
                var sJoin = value.relation // La clave de la relacion
                var relationSource = sJoin.source.split('@')[0] // la coleccion de la relacion
                var relationKey = sJoin.source.split('@')[1] //el campo de la relacion
                var tmpData = {} //objeto vacio
                _.each(data[key], function (record) { //recorremps cada registro del recordset secundario
                    if (!tmpData[record[sJoin.self]]) {
                        tmpData[record[sJoin.self]] = {}
                    }
                    tmpData[record[sJoin.self]][record['_id']] = _.omit(record, sJoin.self, '_id')
                })
                data[relationSource].map(function (mainRecord) {
                    mainRecord[key] = tmpData[mainRecord[relationKey]] || {}
                })
                delete data[key]
            }
        })
    }
    var parent = this
    getCollectionData()
    mergeToMain()
    return data.main
}
renderList = function (options) {
        options.src.html = options.src.html || {}
            // options = JSON.parse(substSnippets(JSON.stringify(options)))
            // res = res + options.src.html.before ? options.src.html.before : false
        var idElement = makeId(4)
        var $tableContent = json2TableList(autol(options), options.div, options.src.list.options)
        var res = ''
        if (options.src.css) {
            res += '<style id=' + idElement + '>' + processListCssKey(idElement, options.src.css).text() + '</style>'
        }
        if (options.src.html.before) {
            res += options.src.html.before
        }
        res += '<table class="autol" id=' + idElement + '>'
        res += $tableContent.html()
        res += '</table>'
        if (options.src.html.after) {
            res += options.src.html.after
        }
        res += '<script type="text/javascript">  activateFormLinks();  </script>'
        return res
            // res = res + options.src.html.after ? options.src.html.after : false
    }
    //Creamos un clave en listado para incluir css en la página. Importante, las claves dentro de css: deben estar rodeadas de comillas dobles, y los valores que lo requieran, ( por incluir espacios o caracteres especiales, deben ir entre comillas simples)
processListCssKey = function processListCssKey(idElement, listCss) {
        var newCss = {}
        _(listCss).each(function (value, key) {
            newCss['#' + idElement + ' ' + key] = value
        })
        newCss = JSON.stringify(newCss, 0).replace(/"/g, '').replace(/:{/g, '{').replace(/,/g, '').replace(/{/, '').replace(/}$/, '')
        var $style = $('<style>', {
            class: 'def-list'
        }).text(newCss)
        return $style
    }
    ////

