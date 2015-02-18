Router.map(function() {
    this.route('kitchensink2', {
        path: '/backend/kitchensink',
        controller: 'BaseController'
    })
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
