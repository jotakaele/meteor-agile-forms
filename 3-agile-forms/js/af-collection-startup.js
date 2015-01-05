//Instanciamos en server y client Autof
Autof = new Meteor.Collection('_af', {})

if (Meteor.isClient) {
    cCols = {} //Aqui guardamos los }objetos collection del CLIENTE
}
if (Meteor.isServer) {
    //Publicamos autof, de mood que esta disponible para todos
    Meteor.publish('_af', function() {
        return Autof.find({
            state: 'active'
        })
    })

    if (!sCols) {
        var sCols = {}
    }

    var arrToRegister = getAutoColArray()

    //Instanciamos y publicamos en SERVER cada colección que hemos recuperado (de momento sin restricciones)
    arrToRegister.forEach(function(colName) {
        sCols[colName] = new Meteor.Collection(colName) //Instanciamos
        Meteor.publish(colName, function() { //Publicamos
            console.log('PUBLICANDO ', colName)
            return sCols[colName].find({})
        })
    })
}

//Nos subscribimos a Autof, para poder usarlo en todas partes
//FIXME Esto debería ser de solo lectura si el user no es admin @security
if (Meteor.isClient) {

    Meteor.subscribe('_af', function() {
        loadAutoCollection()
        Session.set('AutofLoad', 1)
    })
}

function loadAutoCollection() {

    var arrToRegister = getAutoColArray()
    arrToRegister.forEach(function(colName) {
        cCols[colName] = new Meteor.Collection(colName)
        Meteor.subscribe(colName, function() {})
    })
}

// if (Meteor.isClient) {
//     Meteor.subscribe('_af', function() {

//         Session.set('AutofLoad', 1)
//     })
// }

/*
 * Devuelve un array con todos los elementos collection definidos en la colacción autof
 * @param none
 * @return Array con los nombres de las colecciones
 */
function getAutoColArray() {
    var arrToRegister = []
    var xcols = Autof.find({
        state: 'active'
    })
    xcols.forEach(function(key) {
        try {
            var nLCol = key.content.list.sources.main.collection
            var nLJoinCol = _.keys(key.content.list.sources)
                // console.log(nLJoinCol)
        } catch (err) {}
        try {
            var nFCol = key.content.form.collection
        } catch (err) {}
        // console.log(nFCol, nLCol)
        if (nFCol) {
            arrToRegister.push(_.underscored(nFCol))
        }
        if (nLCol) {
            arrToRegister.push(_.underscored(nLCol))
        }
        if (nLJoinCol) {
            nLJoinCol.forEach(function(k) {
                // console.log(k)
                if (k != 'main') {
                    arrToRegister.push(_.underscored(k))
                }
            })
        }
    })
    arrToRegister = _.uniq(arrToRegister)
    return arrToRegister
}
