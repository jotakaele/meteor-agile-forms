Meteor.methods({
    //Guradar un registro desde af 
    'saveAfRecord': function(formName, formResults) {
        var theForm = Autof.findOne({
                name: formName
            }).content.form
            // dbg('theForm', theForm)
        var theSave = {}
        theSave.collection = theForm.collection
        theSave.data = formResults
        _.extend(theSave, validateRecord(theSave.data, theForm))
            //Datos que le añadimos siempre   
        var autoData = {
            autouser: Meteor.userId || 'unuser',
            autodate: new Date()
        }
        _.extend(theSave.data, autoData)
        if (theSave.isValid) {
            var theId = sCols[theSave.collection].insert(theSave.data)
            dbg("theId", theId)
            if (theId) {
                Meteor.call('setLog', 'insert_record', {
                    collection: theSave.collection,
                    id: theId
                })
                return {
                    status: 'saved',
                    id: theId
                }
            } else {
                return {
                    status: 'unsaved',
                    id: null
                }
            }
        } else {
            return {
                status: 'unvalid form',
                id: null
            }
        }
    },
    //Recuperar un registro
    'getDoc': function(theCollection, theId) {
        return sCols[theCollection].findOne(theId)
    },
    //Guardamos información en el log, lo que necesitemos
    'setLog': function(theType, objContent) {
        if (s('log') == true) {
            Logs.insert({
                autouser: Meteor.userId || 'unuser',
                autodate: new Date(),
                type: theType,
                content: objContent,
                expiredate: moment().add(s('log_expire').insert_record).toDate()
            })
        }
    }
});
//Comprueba la validación del formulario en el servidor, en base a diferentes parameros (campos requeridos, seguridad, etc)
function validateRecord(theData, theForm) {
    var theDataCopy = _.extend({}, theData)
    var check = {
        isValid: true,
        info: []
    }
    if (!theData) {
        check.isValid = false
        check.info = 'No hay datos'
        return check
    }
    if (!theForm) {
        check.isValid = false
        check.info = 'No hay form.'
        return check
    }
    //Vamos a convertir the Data en un objeto de una sola dimension...
    _.each(theDataCopy, function(value, key) {
            if (_.startsWith(key, '_')) {
                if (value.length == undefined) { //significa que es un objeto
                    _.each(value, function(oValue, oKey) {
                        theDataCopy[oKey + '.' + key] = oValue
                    })
                } else { // o es un array
                    _.each(value, function(aValue, aIndex) {
                        _.each(aValue, function(aoValue, aoKey) {
                            // dbg('aoKey', aoKey)
                            theDataCopy[aoKey + '.' + (aIndex + 1) + '.' + key] = aoValue
                        })
                    })
                }
                delete theDataCopy[key]
            }
        })
        // dbg("theDataCopy", o2S(theDataCopy))
    _.each(theDataCopy, function(value, key) {
        //Comprobamos required
        theRealKey = key.split('.')[0]
        if ((theForm.fields[theRealKey] || {}).required == false ? false : true) {
            // dbg(theRealKey, 'es requerido')
            if (!value || value == '') {
                check.isValid = false
                check.info.push('Field ' + key + ' required')
            }
        }
    })
    return check
}
