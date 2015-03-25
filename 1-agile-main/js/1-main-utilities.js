randEl = Function
    /*Devuelve un elemento aleatorio del arrat theArray*/
randEl = function(theArray) {
    var els = theArray.length
    var ind = Math.floor(Math.random() * els)
    return theArray[ind]
}
makeId = Function
    //Devuelve una cadena aleatoria de @num || 5 caracteres
makeId = function(num) {
        var pas = num || 5
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < pas; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    //Muestra  la salida de console log
    //RELEASE  Modificar de manera que quede desactivado en producción
dbg = function dbg(sometitle, something) {
        //if (Meteor.isClient) {
        if (se('dbg') == true) {
            var d = new Date()
            a = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds()
            console.log(a + ' >>> [' + sometitle + ']', something);
        }
        //}
    }
    //Atajo para escribir y recoger de Session. Mantiene el valor de la variable en la base de datos a no ser que pasemos el parametro saveToBD como false
se = function(key, value, saveToBD) {
        if (Meteor.isClient) {
            if (value == undefined) {
                return Session.get(key)
            }
            var curVal = Session.get(key) || null
            if (curVal != value) { // Solo guardamos en base de datos en caso de que sea diferente (hay que ahorrar escrituras a disco)
                Session.set(key, value)
                if (saveToBD != false) {
                    if (Defaults.update({
                            _id: key
                        }, {
                            _id: key,
                            value: value
                        }, {
                            upsert: true
                        }) != 1) {
                        {
                            console.log('No se ha podido almacenar la variable en la base de datos')
                        }
                    }
                    Meteor.call('setLog', 'session_variable_changed', {
                        from: 'client',
                        key: key,
                        value: value
                    })
                }
            }
        }
        //server
        if (Meteor.isServer) {
            var curVal = (Defaults.findOne(key) || {}).value || null
            if (value == undefined) {
                return curVal
            }
            if (curVal != value) {
                if (saveToBD != false) {
                    if (Defaults.update({
                            _id: key
                        }, {
                            _id: key,
                            value: value
                        }, {
                            upsert: true
                        }) != 1) {
                        {
                            console.log('No se ha podido almacenar la variable en la base de datos')
                        }
                    }
                    Meteor.call('setLog', 'session_variable_changed', {
                        from: 'client',
                        key: key,
                        value: value
                    })
                }
            }
        }
    }
    /*
                                            EvalUa en Javascript la cadena pasada por @cadena
                                            @param cadena Una cadena que debe comenzar por "eval ..." (notese el espacio). Si la cadena es "eval new Date()" devolverá una fecha.
                                            @return Depende de lo que evalue o la mima cadena que ha recibido si no se ha pasado eval
                                            */
parseEval = function parseEval(cadena) {
        if (_(cadena).strLeft(' ') !== 'eval') {
            return cadena
        }
        var toEvaluate = _(cadena).strRight(' ')
        return eval(toEvaluate)
    }
    /*
                                            Convierte todos los valores de un objeto que hayan sido encerrados enntre `eval()` en su valor pasado por eval, a a cualquier nivel de profundidad del objeto
                                            */
parseEvalObjects = function parseEvalObjects(obj) {
        obj = obj || {}
        var v = JSON.stringify(obj, undefined, 1) //importante devolver con indentacion para que pueda detectar los saltos de linea
        var expresion = /eval\(.*\)/g
        var matches = v.match(expresion) || []
            //console.log(matches)
        matches.forEach(function(match) {
            var vEval = match.replace(/eval/, '');
            v = v.replace(match, eval(vEval));
            //console.log(vEval)
        })
        return JSON.parse(v)
    }
    /*reemplazamos  caracteres que prioducen errores para evitar errores en la inserción en MongoDb */
desanitizeObjectNameKeys = function desanitizeObjectNameKeys(obj) {
        obj = JSON.stringify(obj)
        obj = obj.replace(/\$/g, '_$') // Reemplazamos $ por _$
        obj = obj.replace(/\./g, '_point_') // Reemplazamos . por _point_
        return JSON.parse(obj)
    }
    /*revertimos desanitizeObjectNameKeys*/
sanitizeObjectNameKeys = function sanitizeObjectNameKeys(obj) {
        obj = JSON.stringify(obj)
        obj = obj.replace(/_\$/g, '$') // Reemplazamos _$ por $
        obj = obj.replace(/_point_/g, '.') //Reemplazamos _point_ por .
        return JSON.parse(obj)
    }
    /*Stringifica un objeto*/
o2S = function o2S(object, indent) {
        var indent = indent || 2
        return JSON.stringify(object, undefined, indent)
    }
    /*DES- Stringifica un objeto*/
s2O = function s2O(thestring) {
        return JSON.parse(thestring)
    }
    /*Devuelve la clave del primer elemento de un objecto, lo usamos para determinar el tipo de los objetos de confuiguración, principalmente*/
contentType = function contentType(theObject) {
        return _.keys(theObject)[0]
    }
    //Pasa la operacion simple "theOperation" al array "theArray", devuelve el array procesado. Probado con trim, toLoWerCase, etc...
arrayProcess = function arrayProcess(theArray, theOperacion) {
        return theArray.map(Function.prototype.call, String.prototype[theOperacion])
    }
    //Devuelve un objeto fecha formateado a partir de un string en el pattern patern
toDate = function toDate(formaDateString, pattern) {
        pattern = pattern || se('default_date_format').datetimepicker.replace(/\//g, '').toLowerCase()
        formaDateString = formaDateString.toString().replace(/\//g, '-')
        formaDateString = formaDateString.toString().replace(/\./g, '-')
        var b = formaDateString.split('-')
        if (pattern == 'dmy') {
            var y = b[2]
            var m = s.lpad(b[1], 2, 0)
            var d = s.lpad(b[0], 2, 0)
        } else if (pattern == 'mdy') {
            var y = b[2]
            var m = s.lpad(b[0], 2, 0)
            var d = s.lpad(b[1], 2, 0)
        }
        var e = [
            y,
            m,
            d
        ]
        return new Date(e)
    }
    //$.ajax({
    //    url: 'http://api.randomuser.me/?results=200',
    //    dataType: 'json',
    //    success: function(data) {
    //        console.log(data.results)
    //        data.results.forEach(function(u) {
    //            cols.personas.insert(u.user)
    //        })
    //    }
    //})
showToUser = function showToUser(options) {
        var opt = {
            class: options.class || 'alert',
            content: options.content,
            element: options.element || $('body'),
            time: options.time || null,
            modal: options.modal || false,
            log: options.log || false,
            id: makeId(3),
            image: options.image || null,
            close: options.close || 'click'
        }
        var theDiv = $('<div>', {
            class: 'showToUser alert-box ' + opt.class + (opt.modal ? ' reveal-modal-bg' : ''),
            title: t(opt.close + ' to close'),
            style: 'display:none',
            id: opt.id
        }).html(opt.content).prependTo(opt.element).on(opt.close, function() {
            $d = $(this)
            $d.slideUp(400, function() {
                $d.remove()
            })
        }).slideDown(400)
        if (opt.log) {
            Meteor.call('setLog', 'user_show_message', _.omit(opt, 'element'))
        }
        if (opt.image) {
            var theImage = $('<i>', {
                class: 'right fa fa-2x ' + opt.image
            }).prependTo(theDiv)
        }
        if (opt.time) {
            var theCounter = $('<div>', {
                class: 'counter'
            }).appendTo(theDiv)
            theCounter.animate({
                width: '100%'
            }, opt.time * 1000, 'linear', function() {
                theDiv.slideUp(200, function() {
                    theDiv.remove()
                })
            })
        }
    }
    /**
     * Devuelve un array con los valores unicos en la colecion indicada
     * @param  {string} col            [La coleccion donde buscar]
     * @param  {string} field          [El nombre del campo donde buscar]
     * @param  {object} oQuerySelector [El objeto selector de la query hacia mongo]
     * @return {Array}                [Un array con los valores unico en el campo indicado]
     */
getArrayValues = function(col, field, oQuerySelector) {
    var campos = JSON.parse('{"' + field + '":1}')
    var res = masterConnection[col].find(oQuerySelector || {}, {
        fields: campos
    }).fetch()
    myArray = _.uniq(res.map(function(item) {
        return item[field]
    }))
    return myArray
}
doQuery_first = function(sMode, sCollection, oSelector, oOptions) {
        if (sMode == 'find') {
            return masterConnection[sCollection].find(oSelector || {}, oOptions || {}).fetch()
        } else if (sMode == 'findOne') {
            return masterConnection[sCollection].findOne(oSelector || {}, oOptions || {})
        }
    }
    /**
     * [doQuery Ejecuta una funcion sobre mongo]
     * @param  {[string find|findOne]} mode       [El tipo de consulta a ajecutar]
     * @param  {[string]} collection [La colección a utilizar]
     * @param  {[object]} selector   [El objeto selector de Mongodb]
     * @param  {[object]} options    [El objeto oprions de Mongodb]
     * @return {[array | object]}            [Si mode es find, devuelve un array de objetos, si es findOne devuelve un objeto]
     */
doQuery = function(sMode, sCollection, oSelector, oOptions) {
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
        }
        */
        oOptions = oOptions || {}
        var tmpObj = {
            fields: {}
        }
        var bodyF = '' //El cuerpo de la funcion a crear al vuelo
        var originalFields = oOptions.fields || {}
        var keysToKeep = _.keys(originalFields) //Los campos indicados expresamente
        if (oOptions.fields) {
            _.each(originalFields, function(trValue, trKey) {
                if (trValue && typeof trValue == 'string') {
                    bodyF += 'doc.' + trKey + '=' + trValue.replace(/@/g, 'doc.') + ';\n'
                    tmpObj.transform = new Function('doc', bodyF + 'return doc;')
                    trValue.match(/@[A-Z0-9]*/gi) || [].map(function(item) {
                        tmpObj.fields[item.replace(/@/, '')] = 1
                    })
                }
            })
            _.extend(oOptions, tmpObj, {
                fields: {}
            });
        }
        // Creamos un  objeto como plantilla del registro, para evitar que queden huecos en los campos
        var recordTemplate = _.object(keysToKeep, keysToKeep.map(function(b) {
            return ' '
        }))
        if (sMode == 'find') {
            var res = masterConnection[sCollection].find(oSelector || {}, oOptions || {}).fetch()
            if (oOptions.fields) {
                return res.map(function(record) {
                    return _.extend(EJSON.clone(recordTemplate), _.pick(record, keysToKeep))
                })
            } else {
                return res;
            }
        } else if (sMode == 'findOne') {
            var res = masterConnection[sCollection].findOne(oSelector || {}, oOptions || {})
            if (oOptions.fields) {
                return _.pick(res, keysToKeep)
            } else {
                return res;
            }
        }
        return Meteor.Error('The "doQuery" query has errors')
    }
    /**
     * Convierte recursivamente un objeto JSON o Array en su estructura a base de DIV, a cada nodo lo encierra en un div y le pone como class el tipo de elemento devuelto por $.type()
     * @param  {object || array} obj  Requerido. El objeto o array de objetos JSON a convertir
     * @param  {jQuery element } $div Optional. El elemento JQuery que encerrara el resultado de la función. Se usa internamente para recursividad
     * @return {string}      El html listo para usar
     */
o2HTML = function(obj, $div) {
    if (typeof obj != 'object') {
        return obj
    }
    if (!$div) {
        var isParent = true
        $div = $('<div>')
    }
    //$parent = $('<div>') //Creo un objeto padre para contener el html
    _.each(obj, function(value, key) { //Recorro los nodos del objeto
        theType = $.type(value) //Determino el tipo de objeto que es (objeto, array u otro...)
        var $currentDIV = $('<div>', {
            class: theType,
            id: key,
            type: theType,
        })
        if (theType == 'object') {
            $currentDIV.html(o2HTML(value)).appendTo($div)
        } else if (theType == 'array') {
            $currentDIV.html(o2HTML(value)).appendTo($div)
        } else {
            $currentDIV.html(value).appendTo($div)
        }
    })
    return isParent ? '<div class="parent">' + $div.html() + '</div>' : $div.html()
}


/**
 * Devuelve un div con la fecha formateada segun format de modoo ue mantiene el orden 
 * @param  {date} date   El objeto fecha
 * @param  {string} format El formato que queremos que nos devuelva
 * @return {string}        
 */
rDate = function(date, format) {
    return moment(date).format(format || 'DD-MM-YYYY')
        //var order = moment(date).format('YYYYMMDD')

    //return ('<div order="' + order + '">' + m + '</div>')

}

/**
 * Checkea la existencia de la clave permissions dentro de objectChecked y devuelve tru o false en fucnion de los valores en aloow o deny
 * @param  {object} objectChecked Objeto a checkear. 
 * @param  {string} sElementId    Id del elemento de la página donde se mostrará el error
 * @param  {string} sName         Nombre del elemento que se esta checkeando, parar mostrarlo en la información al usuari.
 * @return {[type]}               [description]
 */
checkPermissions = function(objectChecked, sElementId, sName) {
    dbg('check', objectChecked)

    var state = true
    var info = []
    if (!_.has(objectChecked, 'permissions')) {
        var state = false
    }
    var permissions = objectChecked.permissions
    var rolesPlusUser = Meteor.user().roles.concat(userInfo().email)

    if (_.has(permissions, 'allow')) {
        var state = false
        var allowTo = _.intersection(rolesPlusUser, permissions.allow)
        if (allowTo.length > 0) {
            var state = true
            info.push('<div class="label success">allow to Role: ' + allowTo + '</div>')
        }
    }

    if (_.has(permissions, 'deny')) {
        var denyTo = _.intersection(rolesPlusUser, permissions.deny)
        if (denyTo.length > 0) {
            var state = false
            info.push('<div class="label alert">deny to Role: ' + denyTo + '</div>')
        }
    }

    if (state == false) {
        var obj = {
            content: '<strong>You are not allowed to use [' + sName + '].</strong> If you think is an error, please contact with the maintainer of ' + se('appName') + '<div>' + info + '</div>',
            image: 'fa-minus-circle',
            class: 'secondary'
        }
        if (sElementId) {
            obj.element = $('#' + sElementId)
        }

        showToUser(obj)
    }

    return state;
}
