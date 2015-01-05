//Instanciamos en server y client Autof
Defaults = new Meteor.Collection('_defaults')
if (Meteor.isServer) {

    //Publicamos _defaults, de modo que esta disponible para todos
    Meteor.publish('_defaults', function() {
        return Defaults.find()
    })
}
