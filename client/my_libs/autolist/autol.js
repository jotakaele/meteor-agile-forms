AUTOL = function(element, options) {
        this.options = options || {}
        this.element = document.getElementById(element)
        this.options = options
        this.list = this.options.def.list
        list = this.list
        _.keys(list.sources).forEach(function(iSource) {
            if (iSource != 'main') {
                list.sources.main.columns[iSource] = '' //Hacemos que esten disponibles las columnas de los joins directamente, sin tener que ponerlas expresamente
            }
        })
        arr_Ids = [] //Los ids primarios para usarlos con los joins, si existen
        dSources = {} //el objeto donde vamos a meter emn primera instancia el resultado de los joins
        function loadSource(sourceObject, keyName) {
                //Meteor.subscribe(sourceObject.collection)
                //   dbg('sourceObject', sourceObject)
                if (!sourceObject.collection) {
                    sourceObject.collection = keyName
                    var nFilter = {}
                    nFilter = sourceObject.filter || {}
                    delete sourceObject.filter
                    sourceObject.filter = {}
                        //Nos aseguramos de que lo que se ha escrito en la clave filter de los joins, se mete dentro de $and, para asegurar que funciona siempre el filtro de cada fila
                    sourceObject.filter.$and = [nFilter]
                        //Forzamos el filtro relativo a los elementos que se muestran en main
                    var a = {}
                    a[sourceObject.main_id || list.sources.main.collection + '_id'] = {
                        "$in": arr_Ids
                    }
                    sourceObject.filter.$and.push(a)
                }
                var arrCollection = []
                    //Devuelve un array con la lista decampos mencionados o listados en list.columns (o en el join) , son los que se utilizarán para extraer de la base de datos
                var arrFieldsToRetrieve = []
                $.each(sourceObject.columns, function(key, value) {
                    var cad = value || key
                    cad == key ? arrFieldsToRetrieve.push(key) : false
                    var expresion = /\[[a-zA-Z0-9_-]+\]/g
                    var t = cad.match(expresion) || []
                    t.forEach(function(v) {
                        arrFieldsToRetrieve.push(v.replace(/\[/g, '').replace(/\]/g, ''))
                    })
                })
                keyName != 'main' ? arrFieldsToRetrieve.push(sourceObject.main_id) : false
                arrFieldsToRetrieve = _.uniq(arrFieldsToRetrieve)
                records = {}
                if (!cCols[sourceObject.collection]) {
                    console.error('Se ha intentado utilizar la colección [' + sourceObject.collection + '], pero no está registrada!. Al añadirse una nueva colección, por el momento hay que reiniciar Meteor')
                }
                //ordenamos si se ha establecido el orden
                var objSort = {}
                if (sourceObject.sort) {
                    var b = sourceObject.sort.split(',')
                    b.forEach(function(value) {
                        var x = value.split(' ')
                        if (x[1]) {
                            var direction = x[1].trim() == 'desc' ? -1 : 1
                        }
                        objSort[value.split(' ')[0].trim()] = direction || 1
                    })
                }
                var objIncluded = {}
                arrFieldsToRetrieve.forEach(function(value) {
                    objIncluded[value.trim()] = 1
                })
                var objFilter = sourceObject.filter || {}
                findOptions = {
                    sort: objSort,
                    fields: objIncluded
                }
                var objCollection = cCols[sourceObject.collection].find(objFilter, findOptions).fetch()
                    //dbg("objCollection", objCollection)
                arrCollection = []
                $.each(objCollection, function(el) {
                        arrCollection.push(objCollection[el])
                            //Creamos una array (solo en main) con los _id's de main para usarlos luego en los joins
                        if (keyName == 'main') {
                            arr_Ids.push(objCollection[el]._id)
                        }
                    })
                    //EvaluateMYFIELDS////////////////////////////////////////////////////////////////////////////////////////////
                    //Procesa los campos que se van a enviar a json2tableList. Procesa mediante "eval" la expresion coontenida. Pueden usarse los nombres de campos disponibles, encerrados entre corchetes. Si se encierran entre [corchetes], el resultado es encerrado entre comillas, si se encierran entre [[corchetes dobles]] el resultado se devuelve sin comillas
                var subst = []
                $.each(sourceObject.columns, function(key, value) {
                        var cad = value || key
                            //sustituimos lo encerrado entre corchetes con el contenido del campo de su nombre
                        var expresion = /\[[a-zA-Z0-9_-]+\]/g
                        var t = cad.match(expresion) || []
                        t.forEach(function(k) {
                            subst.push(k.replace(/\[|\]/g, ''))
                        })
                        arrCollection.forEach(function(theRowKey) {
                            if (value) {
                                var strVal = value
                                subst.forEach(function(v) {
                                    strVal = strVal.replace("[" + v + "]", "'" + theRowKey[v] + "'").replace(/\['/g, '').replace(/'\]/g, '')
                                })
                                theRowKey[key] = eval(strVal)
                            }
                        })
                    })
                    //EvaluateMYFIELDS END ///////////////////////////////////////////////////////////////////////////////////////
                    //Calculamos las columnas que no se necesitan
                function unusedColumns() {
                        var a = arrFieldsToRetrieve
                        var b = _.keys(sourceObject.columns)
                        var c = []
                        a.forEach(function(k) {
                            if (k != sourceObject.main_id) {
                                b.indexOf(k) === -1 ? c.push(k) : false
                            }
                        })
                        return c
                    }
                    //Borramos las columnas que hemos usado para construir dSource, pero que no ya no necesitamos
                function removeUnusedColumns() {
                    var arrToDel = unusedColumns()
                    arrCollection.forEach(function(eachRow) {
                        arrToDel.forEach(function(eachCol) {
                            delete eachRow[eachCol]
                        })
                    })
                }
                removeUnusedColumns()
                return arrCollection
            }
            //Convertimos calculateColumns en un array, tal como espera la libreria json2TableList
        function calculateColumns2Array() {
                var arrCColums = []
                if (list.options.calculateColumns) {
                    _.each(list.options.calculateColumns, function(value, key) {
                        var objCColums = {}
                        var t = value.split(',')
                        objCColums.column = key
                        objCColums.operation = t[0]
                        if (t[1] >= 0) {
                            objCColums.precision = parseInt(t[1])
                        }
                        arrCColums.push(objCColums)
                    })
                }
                list.options.calculateColumns = arrCColums
            }
            //Combina los elementos oneToMany
        function mergeArrayOneToMany(theSource, configSource, mainFieldName) {
            var nObj = {} //creamos el objeto
            var nkey = configSource.main_id //Establecemos el nombre del campo que relaciona
            var show = _.keys(configSource.columns) //los campos que se deben mostrar
            $.each(theSource, function(key, value) { //por cada elemento en uno de los joins
                var sObj = {}
                show.forEach(function(s) {
                    if (s != configSource.main_id) {
                        sObj[s] = value[s]
                    }
                })
                if (!nObj[value[nkey]]) {
                    nObj[value[nkey]] = {}
                }
                nObj[value[nkey]][value['_id']] = sObj
            })
            dSources.main.forEach(function(vkey) { //recorremos el array principal
                vkey[mainFieldName] = {}
                if (nObj[vkey._id]) {
                    vkey[mainFieldName] = nObj[vkey._id]
                }
            })
        }
        Tracker.autorun(function() {
            _.each(list.sources, function(iSource, key) {
                dSources[key] = loadSource(iSource, key)
            })
            _.each(dSources, function(idSource, key) {
                // dbg("key.type", list.sources[key].type)
                if (key != 'main') {
                    mergeArrayOneToMany(idSource, list.sources[key], key)
                }
            })
            if (dSources.main.length >= 1) {
                //Reordenamos la primera fila, con sus propios valores para que las columnas se muestren en el orden correcto
                var orderCols = {}
                _.each(list.sources.main.columns, function(value, key) {
                    orderCols[key] = dSources.main[0][key] || 1
                })
                dSources.main[0] = orderCols
                json2TableList(dSources.main, element, parseEvalObjects(list.options) || {})
            }
            /*else {
                dbg('diciendo no', $('#' + element))
                $(this.element).html('<span class="alert">La tabla no devuelve ningún resultado :\'(</span>')
            }*/
        })
    }
    //RELEASE quitar las comas de la lista de clases en tableClass (libreria json2TableList)
    //TODO Ver que ocurre con eval(luhlhlhh) cuando no se utiliza al final de la linea
    //Refactorizar autol, incluyendo el uso de _.extend para posibilitar relaciones oneToOne directamente. Ver si usandolo en el resto mejoramos el rendimiento
    //TODO HAcer compatible el sistema de grid con bootstrap y otros....
