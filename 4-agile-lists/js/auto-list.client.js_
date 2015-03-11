autol = function autol(options) {
    //console.clear()
    this.div = options.div || 'listdest';
    //recuperamos los datos de las colecciones indicadas en la configuración
    this.list = options.src.list
    this.html = options.src.html || {}
    this.css = options.src.css || {}
    this.getCollectionData = function () {
        var parent = this;
        _.each(this.list.sources, function (value, key) {
            if (value.relation) {
                var relationSource = value.relation.source.split('@')[0]
                var relationKey = value.relation.source.split('@')[1]
                    //Extraemos los ids (o el campo indicado , no tiene necesariamente que ser _id)
                var ids = parent.list.sources[relationSource].data.map(function (val) {
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
            value.data = doQuery('find', value.collection, value.selector, value.options)
        })
    }
    this.mergeToMain = function () {
            var parent = this
            _.each(this.list.sources, function (value, key) {
                if (key != 'main') {
                    var sJoin = value.relation
                    var relationSource = sJoin.source.split('@')[0]
                    var relationKey = sJoin.source.split('@')[1]
                    var data = value.data
                    var tmpData = {}
                    _.each(data, function (record) {
                        if (!tmpData[record[sJoin.self]]) {
                            tmpData[record[sJoin.self]] = {}
                        }
                        //tmpData[record[sJoin.self]][record['_id']] = _.omit(record, sJoin.self, '_id')
                        tmpData[record[sJoin.self]][record['_id']] = _.omit(record, sJoin.self, '_id')
                    })
                    var mainData = parent.list.sources[relationSource].data
                    mainData.map(function (mainRecord) {
                        mainRecord[key] = tmpData[mainRecord[relationKey]] || {}
                    })
                    parent.list.sources[relationSource].data = mainData
                }
            })
        }
        //Creamos un clave en listado para incluir css en la página. Importante, las claves dentro de css: deben estar rodeadas de comillas dobles, y los valores que lo requieran, ( por incluir espacios o caracteres especiales, deben ir entre comillas simples)
    this.processListCssKey = function processListCssKey($element, listCss) {
            var newCss = {}
            _(listCss).each(function (value, key) {
                newCss['#' + $element.attr('id') + ' ' + key] = value
            })
            newCss = JSON.stringify(newCss, 0).replace(/"/g, '').replace(/:{/g, '{').replace(/,/g, '').replace(/{/, '').replace(/}$/, '')
            var $style = $('<style>', {
                class: 'def-list'
            }).text(newCss).prependTo($element)
        }
        ////
    var parent = this
    $.when(parent.getCollectionData())
        //
        .then(function () {
            parent.mergeToMain()
        })
        //
        .then(function () {
            json2TableList(parent.list.sources.main.data, parent.div, parent.list.options)
        })
        //Activamos los links a formularios
        .done(function () {
            $autol = $('#' + parent.div + ' .autol')
            if (parent.html.before) {
                $("<div>").html(parent.html.before).insertBefore($autol)
            }
            if (parent.html.after) {
                $('<div>').html(parent.html.after).insertAfter($autol)
            }
            parent.processListCssKey($('#' + parent.div), parent.css)
            activateFormLinks()
        })
}

