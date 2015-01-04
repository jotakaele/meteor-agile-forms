//Instanciamos en server y client Autof
Autof = new Meteor.Collection('_af', {})


if (Meteor.isServer) {
    //Publicamos autof, de mood que esta disponible para todos
    Meteor.publish('_af', function() {
        return Autof.find({
            state: 'active'
        })
    })
    
   
}
if (Meteor.isClient) {
    Meteor.subscribe('_af', function() {
        Session.set('AutofLoad', 1)
    })
}
