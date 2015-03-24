Router.map(function() {
    this.route('foundation', {
        path: '/backend/foundation',
        controller: 'BaseController'
    })
    this.route('masterEdit', {
        path: '/backend/:mode?/:name?',
        controller: 'BaseController',
        data: function() {
            if (this.params.mode) {
                se('masterActiveCategory', this.params.mode)
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
