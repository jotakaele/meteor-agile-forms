//Instanciamos en server y client Autof
Autol = new Meteor.Collection('_al', {})
if (Meteor.isClient) {
    cCols = cCols || {} //Aqui guardamos los }objetos collection del CLIENTE
}
if (Meteor.isServer) {
    //Publicamos autof, de mood que esta disponible para todos
    Meteor.publish('_al', function () {
        return Autol.find()
    })
    sCols = sCols || {}
    var arrToRegister = getAutoListColArray()
        //Instanciamos y publicamos en SERVER cada colección que hemos recuperado (de momento sin restricciones)
    arrToRegister.forEach(function (colName) {
        if (!sCols[colName]) {
            sCols[colName] = new Meteor.Collection(colName) //Instanciamos
            Meteor.publish(colName, function () { //Publicamos
                console.log('PUBLICANDO ', colName)
                return sCols[colName].find({})
            })
        }
    })
}
// Devuelve un array con todos los elementos collection definidos en la colección autol
// @param none
// @return Array con los nombres de las colecciones
function getAutoListColArray() {
        var arrToRegister = []
        var xcols = Autol.find({
            state: 'active'
        })
        xcols.forEach(function (key) {
            try {
                var nLCol = key.content.list.sources.main.collection
                var nLJoinCol = _.keys(key.content.list.sources)
                    // console.log(nLJoinCol)
            } catch (err) {}
            // console.log(nFCol, nLCol)
            if (nLCol) {
                arrToRegister.push(_.underscored(nLCol))
            }
            if (nLJoinCol) {
                nLJoinCol.forEach(function (k) {
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
    //Nos subscribimos a Autol, para poder usarlo en todas partes
    //FIXME Esto debería ser de solo lectura si el user no es admin @security
if (Meteor.isClient) {
    Meteor.subscribe('_al', function () {
        loadAutoCollection()
        Session.set('AutolLoad', 1)
    })
}

function loadAutoCollection() {
    var arrToRegister = getAutoListColArray()
    arrToRegister.forEach(function (colName) {
        if (!cCols[colName]) {
            cCols[colName] = new Meteor.Collection(colName)
            Meteor.subscribe(colName, function () {})
        }
    })
}
