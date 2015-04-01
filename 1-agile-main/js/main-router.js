//Elementos comunes para todas las rutas
BaseController = RouteController.extend({
    // specify stuff that every controller should have
    waitOn: function() {
        // return one handle, a function, or an array
        return [Meteor.subscribe('_translations'), Meteor.subscribe('_defaults')]
    },
    action: function() {
        // this.ready() is true if all items returned from waitOn are ready
        //Cargamos las variables de la tabla _defaults como variables de session, 
        if (this.ready()) {
            Defaults.find().fetch().forEach(function(item) {
                se(item._id, item.value, false)
            })
            Tracker.autorun(function() {
                se('app', masterConnection.config.findOne({
                    name: 'app'
                }).content.app)

                se('menu', masterConnection.config.findOne({
                    name: 'menus'
                }).content.menus)
            });


            if (se('lang') != 'en') {
                translationsStrings(se('lang'))
            } //FIXME ¿Estyo no será una pesada carga'
            this.render();
        } else {
            this.render('Loading');
        }
    }
});
//Definimos una plantilla global para todas las rutas
Router.configure({
    layoutTemplate: 'main'
});



// Router.map(function() {
//     this.route('go', {
//         path: '/go',
//         controller: 'BaseController',
//     });
// });
