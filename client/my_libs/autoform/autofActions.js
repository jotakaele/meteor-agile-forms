/*
Convierte en Array los datos de un fromulario
*/
formToJson = function formToJson(objForm) {
        //  console.clear()
        var fields = $('[name][id]:not(.subObject)', objForm)
        var numberTypes = ['number', 'currency', 'range']
        var dateTypes = ['date', 'datetime', 'time']
        var f = objForm
        var res = {}
        fields.each(function(index, value) {
            dbg('value', value)
            if (_.indexOf(numberTypes, $('#' + this.name, f).attr('type')) >= 0) {
                this.save_as = $('#' + this.name, f).attr('save_as') || 'number'
            } else if (_.indexOf(dateTypes, $('#' + this.name, f).attr('type')) >= 0) {
                this.save_as = 'date'
            } else {
                this.save_as = $('#' + this.name, f).attr('save_as') || 'string'
            }
            var theValue = fieldValue($(this))
            if (this.save_as == 'number') {
                if (_.isArray(theValue)) {
                    theValue.forEach(function(elem, key) {
                        theValue[key] = elem * 1
                    })
                } else {
                    theValue = theValue * 1
                }
            }
            //TODO Refactorizar hay que extraer siempre los valores de los campos con fieldValue @urgente
            //procesemos los date
            //Los campos date los procesamos como date
            if (this.save_as == 'date') {
                if ($(value).attr("type") == 'date' || $(value).attr("type") == 'datetime') {
                    theValue = toDate(theValue)
                } else if ($(value).attr("type") == 'time') {
                    theValue = toDate('00-00-0000' + ' ' + theValue)
                }
            } else if (this.save_as == 'boolean') {
                theValue = eval(theValue)
            }
            //Precesamos los campos typo tags, para convertirlos en un array
            //dbg('this', $(this).attr('type'))
            if ($(this).attr('type') == 'tags') {
                theValue = fieldValue($(this)).split(',')
            }
            res[this.name] = theValue
        })
        $('div.block[limit]', objForm).each(function() {
            _.extend(res, getBlocValues($(this)))
        })
        return res
    }
    /*
    Procesa los valores de un bloque de varios campos convirtiendolo en un array
    */
getBlocValues = function getBlocValues($object, intLimit) {
        //todo Procesar la salida de getBlockValues, para que si limit=1, solo devuelva un objeto y no un array
        dbg('object', $object)
        var theBlock = $object
        var index = 0
        var theBlockName = theBlock.attr('id')
        var resBV = {}
        var arrRow = []
        var curIndex = '0'
        var nObj = {}
        $('.subObject[name]', theBlock).each(function() {
                var theControl = $(this)
                var theControlName = theControl.attr('name')
                var vName = _.strLeftBack(theControlName, '-')
                var vIndex = _.strRightBack(theControlName, '-')
                var vValue = fieldValue(theControl)
                if ($object.attr('limit') == 1) {
                    nObj[vName] = vValue
                } else {
                    nObj[vIndex] = nObj[vIndex] || {}
                    nObj[vIndex][vName] = vValue
                }
            })
            //Si limit=1 solo devolvemos un objeto
        if ($object.attr('limit') == 1) {
            dbg('nObj', nObj)
            resBV[theBlockName] = nObj
        } else {
            _.each(nObj, function(val) {
                arrRow.push(val)
            })
            resBV[theBlockName] = arrRow
        }
        return resBV
    }
    //TODO esta operacion hay que hacerla desde un metodo de meteor, añadiendo autofecha, usuario, etc.....
sendFormToMongo = function sendFormToMongo($form) {
        var dest = $form.attr('collection')
        var insertObj = formToJson($form)
        var insert = cCols[dest].insert(insertObj)
            // if (Session.get('debug') == true) {
        dbg(insert, o2S(insertObj))
            // }
        return insert
    }
    // //Devuelve un array de objetos con las claves value y label, listo para ser usado en un campo tipo enum de formulario.
    // //Como parametro requiere un objeto con las siguientes claves:
    // //query.collection: la coleccion a utilizar 
    // //query.filter: un selector al estilo mongo 
    // //query.format: Modificadores de salida de campos al stilo meteor mongo, incluyendo campos que se muestran, orden, limit. Ejemplo: 
    // //query.value: String. Lo que se guardara como valu en el <select>. Los nombres de campo a utilizar se encierran entre corchetes. Despues se quitan los corchetes  y se  le pasa la funcion eval
    // //query.label: String. Lo que se mostrara como label en el <select>. Los nombres de campo a utilizar se encierran entre corchetes. Despues se quitan los corchetes  y se  le pasa la funcion eval
    // Ejemplo de configuracion:
    // var query = {}
    // query.filter = {
    //     primer_apellido: {
    //         $exists: true
    //     }
    // }
    // query.format = {
    //     fields: {
    //         _id: 0,
    //         nombre: 1,
    //         primer_apellido: 1,
    //         sexo: 1
    //     },
    //     sort: {
    //         primer_apellido: 1
    //     },
    //     limit: 10
    // }
    // query.value = '[primer_apellido]'
    // query.label = '[nombre] + \' \' + [primer_apellido]'
queryToEnum = function queryToEnum(query) {
    //sustituimos lo encerrado entre corchetes con el contenido del campo de su nombre
    var expresion = /\[[a-zA-Z0-9._-]+\]/g
        //Importante manetener query.value en la primera posicion, porque la vamos a usar despues por posicion
    var t = _.unique(((query.value || '') + (query.label || '') + (query.optgroup || '')).match(expresion) || [])
    var subst = []
    t.forEach(function(k) {
            subst.push(k.replace(/\[|\]/g, ''))
        })
        //vamos a definir fields, para que no haya que expresarlo innecesariamente
    dbg("subst", subst)
    var obJFields = {}
    query.filter = query.filter || {}
    subst.forEach(function(nItem) {
            obJFields[nItem.split('.')[0]] = 1
                //TAmbien vamos a poner un filtro $exists: true a todos los campos que usamos para que solo nos devuelva filas con valores y evitar errores
            query.filter[nItem] = query.filter[nItem] || {}
            query.filter[nItem]["$exists"] = true
        })
        //_.extend(query.filter, autoFilter)
    query.format = query.format || {}
    query.format.fields = obJFields
        // dbg("obJFields", o2S(obJFields))
        //     // dbg("query", o2S(query))
    dbg("filter", o2S(query.filter))
    dbg("format", o2S(query.format))
    if (!query.format.sort) {
        query.format.sort = {}
        query.format.sort[subst[0]] = 1
    }
    var qRes = cCols[query.collection].find(query.filter || {}, query.format || {}).fetch()
        //dbg('qRes', o2S(qRes))
    var arrRes = []
    var arrCompare = []
    qRes.forEach(function(theRowKey) {
            //dbg("theRowKey", theRowKey)
            var itemArrCompare = ''
            var nObj = {}
            var strLabel = query.label || query.value
            var strValue = query.value
            var strOptgroup = query.optgroup || null
            subst.forEach(function(v) {
                    var depthValue = eval('theRowKey.' + v)
                    itemArrCompare = itemArrCompare + depthValue
                    strLabel = strLabel.replace('[' + v + ']', '\'' + depthValue + '\'').replace(/\['/g, '').replace(/'\]/g, '')
                    strValue = strValue.replace('[' + v + ']', '\'' + depthValue + '\'').replace(/\['/g, '').replace(/'\]/g, '')
                    if (strOptgroup) {
                        strOptgroup = strOptgroup.replace('[' + v + ']', '\'' + (depthValue || '') + '\'').replace(/\['/g, '').replace(/'\]/g, '')
                    }
                })
                // dbg("arrCompare", arrCompare)
                // dbg("itemArrCompare", arrCompare.indexOf(itemArrCompare) + ' >>> ' + itemArrCompare)
            if (arrCompare.indexOf(itemArrCompare) == -1) {
                arrCompare.push(itemArrCompare)
                nObj.label = eval(strLabel)
                nObj.value = eval(strValue)
                strOptgroup ? nObj.optgroup = eval(strOptgroup) : null
                arrRes.push(nObj)
            }
        })
        // dbg("arrRes", o2S(arrRes))
    return _.unique(arrRes)
}
