Defaults = new Meteor.Collection('_defaults')
Logs = new Meteor.Collection('_logs')
if (Meteor.isServer) {
    //Publicamos _defaults, de modo que esta disponible para todos
    Meteor.publish('_defaults', function() {
        return Defaults.find()
    })
}
