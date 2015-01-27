Router.map(function() {
    this.route('pageForm', {
        path: '/af/:itemname/:itemmode/:itemdoc?',
        controller: 'BaseController',
        data: function() {
            return {
                name: this.params.itemname,
                mode: this.params.itemmode,
                doc: this.params.itemdoc
            }
        }
    });
    this.route('test', {
        path: '/test',
        controller: 'BaseController',
        name: 'exampleform'
    });
});
