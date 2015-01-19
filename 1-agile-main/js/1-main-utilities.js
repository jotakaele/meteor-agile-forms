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
        if (s('dbg') == true) {
            var d = new Date()
            a = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds()
            console.log(a + ' >>> [' + sometitle + ']', something);
        }
        //}
    }
    //Atajo para escribir y recoger de Session. Mantiene el valor de la variable en la base de datos a no ser que pasemos el parametro saveToBD como false
s = function s(key, value, saveToBD) {
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
    /*
                                        Sustituye todos los valores entre $valor$ por el elemento del objeto correspondiente
                                        */
parseSubstNodes = function parseSubstNodes(obj) {
        obj = obj || {}
        obj.helpers = obj.helpers || {}
        var v = JSON.stringify(obj, undefined, 1) //importante devolver con indentacion para que pueda detectar los saltos de linea
        var expresion = /\$.*\$/g
        var matches = v.match(expresion) || []
        matches.forEach(function(match) {
            var vEval = match.replace(/\$/g, '');
            var cad = 'obj.def'
            var trozos = vEval.split('.')
            if (trozos.length == 1) {
                cad = 'obj.def.helpers'
            }
            trozos.forEach(function(item) {
                    cad = cad + '[\'' + item + '\']'
                })
                // console.log(cad)
            v = v.replace(match, eval(cad));
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
        pattern = pattern || s('default_date_format').datetimepicker.replace(/\//g, '').toLowerCase()
        formaDateString = formaDateString.replace(/\//g, '-')
        formaDateString = formaDateString.replace(/\./g, '-')
        var b = formaDateString.split('-')
        if (pattern == 'dmy') {
            var y = b[2]
            var m = _.lpad(b[1], 2, 0)
            var d = _.lpad(b[0], 2, 0)
        } else if (pattern == 'mdy') {
            var y = b[2]
            var m = _.lpad(b[0], 2, 0)
            var d = _.lpad(b[1], 2, 0)
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
