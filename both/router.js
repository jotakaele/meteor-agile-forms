Router.map(function() {
    this.route('autoEdit', {
        path: '/backend/af/:itemname?',
        data: function() {
            vname = this.params.itemname || localStorage.getItem('lastFormAdminChargeName')
            datos = {
                name: vname
            }
            return datos || null
        },
        controller: 'BaseController'
    });
    this.route('pageForm', {
        path: '/af/:itemname/:itemmode/',
        controller: 'BaseController',
        data: function() {
            return {
                name: this.params.itemname,
                mode: this.params.itemmode
            }
        }
    });
    this.route('test', {
        path: '/test',
        controller: 'BaseController',
        name: 'exampleform'
    });
});
//TODO esto deberia ir en una parte comun
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
                s(item._id, item.value, false)
            })
            if (s('lang') != 'en') {
                translationsStrings(s('lang'))
            } //FIXME ¿Estyo no será una pesada carga'
            this.render();
        } else {
            this.render('Loading');
        }
    }
});
