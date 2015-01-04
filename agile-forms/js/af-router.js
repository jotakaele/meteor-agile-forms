
Router.map(function() {
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
