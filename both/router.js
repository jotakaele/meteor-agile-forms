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
//Elementos comunes para todas las rutas
BaseController = RouteController.extend({
    // specify stuff that every controller should have
    waitOn: function() {
        // return one handle, a function, or an array
        if (i18n('en') == '') {
            return Meteor.subscribe('_translations');
        }
    },
    action: function() {
        // this.ready() is true if all items returned from waitOn are ready
        if (this.ready()) {
            if (i18n('en') == '') {
                translationsStrings(localStorage.getItem('lc'))
            }
            this.render();
        } else {
            this.render('Loading');
        }
    }
});
