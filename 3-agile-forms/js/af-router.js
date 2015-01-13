Router.map(function() {
    this.route('pageForm', {
        path: '/af/:itemname/:itemmode/:itemid?',
        controller: 'BaseController',
        data: function() {
            return {
                name: this.params.itemname,
                mode: this.params.itemmode,
                id: this.params.itemid
            }
        }
    });
    this.route('test', {
        path: '/test',
        controller: 'BaseController',
        name: 'exampleform'
    });
});
