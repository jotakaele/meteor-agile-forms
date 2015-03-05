autol = function autol(options) {
    //console.clear()
    this.div = options.div || 'listdest';
    //recuperamos los datos de las colecciones indicadas en la configuración
    this.list = options.src.list
    this.getCollectionData = function () {
        var parent = this;
        //dbg('this', this)
        _.each(this.list.sources, function (value, key) {
            //    dbg('key', value)
            if (value.relation) {
                var relationSource = value.relation.source.split('@')[0]
                var relationKey = value.relation.source.split('@')[1]
                    //Extraemos los ids (o el campo indicado , no tiene necesariamente que ser _id)
                var ids = parent.list.sources[relationSource].data.map(function (val) {
                        return val[relationKey]
                    })
                    //  dbg("ids", ids)
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
                    //dbg("tmpData", tmpData)
                parent.list.sources[relationSource].data = mainData
            }
        })
    }
    var parent = this
    $.when(Tracker.autorun(function () {
            parent.getCollectionData()
        }))
        //
        .then(function () {
            parent.mergeToMain()
        })
        //
        .then(function () {
            //dbg("parent.list.sources.main.data", parent.list.sources.main.data)
            json2TableList(parent.list.sources.main.data, parent.div, parent.list.options)
        })
        //Activamos los links a formularios
        .done(function () {
            activateFormLinks()
        })
}

