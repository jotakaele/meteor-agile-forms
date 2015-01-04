//Instanciamos en server y client Autof

Translations = new Meteor.Collection('_translations')

if (Meteor.isServer) {
  
    Meteor.publish('_translations', function() {
            return Translations.find()
        }) //Publicamos las traducciones
    
  
}

