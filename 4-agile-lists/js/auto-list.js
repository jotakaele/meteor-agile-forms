autol = function autol(options) {
    this.div = options.div || 'listdest';
    this.list = options.src.list || null
        //recuperamos los datos de las colecciones indicadas en la configuración
    this.getCollectionData = function () {
        var parent = this;
        dbg('this', this)
        _.each(this.list.sources, function (value, key) {
            dbg('key', value)
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
            /*     
              Transformamos la clave fields para generar una clave transform, segun espera mongo y cambiamos la clave fields, para que devuelva la lista de campos a traer de la base de datos.
             
							 TRANSFORMAMOS:
							 fields:
							  {
							    NOMBRE: '@nombre.toUpperCase()',
							    Nombre_Completo: '@nombre + \' \' + @apellidos'
							  }

							EN el formato que espera mongo

							  fields:
							  {
							    nombre: 1,
							    apellidos: 1
							  },
							  transform: function (doc) {
							    .....transformaciones
							    return doc;
							  }
*/
            var tmpObj = {
                fields: {}
            }
            var bodyF = '' //El cuerpo de la funcion a crear al vuelo
            var originalFields = value.options.fields
            _.each(originalFields, function (trValue, trKey) {
                    // dbg(trKey, trValue)
                    bodyF += 'doc.' + trKey + '=' + trValue.replace(/@/g, 'doc.') + ';\n'
                    tmpObj.transform = new Function('doc', bodyF + 'return doc;')
                    trValue.match(/@[A-Z0-9]*/gi).map(function (item) {
                        tmpObj.fields[item.replace(/@/, '')] = 1
                    })
                })
                // dbg("tmpObj", o2S(tmpObj))
            _.extend(value.options, tmpObj);
            // dbg("value.options", value.options)
            ///
            ///
            ///
            ///
            //Ejecutamos la query y la anexamos a value.data
            value.data = masterConnection[value.collection].find(value.selector || {}, value.options || {}).fetch()
                //dbg('originalFields', originalFields)
            value.filteredData = value.data.map(function (record) {
                    return _.pick(record, _.keys(originalFields))
                })
                //Eliminamos los campos que no se han pedido en la query
                /*value.data.map(function (key) {
                    value.data[key] = _.pick(value.data[key], _.keys(originalFields))
                })*/
        })
    }
}

