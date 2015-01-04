//Instanciamos en server y client Autof

Defaults = new Meteor.Collection('_defaults')
if (Meteor.isServer) {
    //Publicamos autof, de mood que esta disponible para todos
   
    Meteor.publish('_defaults', function() {
            return Defaults.find()
        }) //Publicamos los valores defaults
        //Inicializamos el objeto sCols , ene el cual vamos a guardar las conexiones a cada colección del SERVER
    
        //Recuperamos e forma de array la lista de colecciones que hay que manejar... lo hacemos a traves de la function  getAutoColArray
    
        
}

    //Nos subscribimos a Autof, para poder usarlo en todas partes
    //FIXME Esto debería ser de solo lectura si el user no es admin @security
if (Meteor.isClient) {
    Meteor.subscribe('_af', function() {
        loadAutoCollection()
        Session.set('AutofLoad', 1)
    })
}
cCols = {} //Aqui guardamos los objetos collection del CLIENTE
function loadAutoCollection() {
    //cols = {}
    var arrToRegister = getAutoColArray()
    arrToRegister.forEach(function(colName) {
        cCols[colName] = new Meteor.Collection(colName)
        Meteor.subscribe(colName, function() {})
    })
}
