/*Router.map(function() {
    this.route('autoFormEdit', {
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
    this.route('autoListEdit', {
        path: '/backend/al/:itemname?',
        data: function() {
            vname = this.params.itemname || localStorage.getItem('lastListAdminChargeName')
            datos = {
                name: vname
            }
            return datos || null
        },
        controller: 'BaseController'
    });
})*/
Router.map(function() {
    this.route('masterEdit', {
        path: '/backend/:mode?/:name?',
        controller: 'BaseController',
        data: function() {
            if (this.params.mode) {
                s('masterActiveCategory', this.params.mode)
            }
            var datos = {}
            if (this.params.mode) {
                datos.mode = this.params.mode
            }
            if (this.params.name) {
                datos.name = this.params.name
            }
            return datos
        },
    });
})
