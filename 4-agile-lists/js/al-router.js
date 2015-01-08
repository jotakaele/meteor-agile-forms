Router.map(function() {
    this.route('pageList', {
        path: '/al/:itemname/',
        controller: 'BaseController',
        data: function() {
            return {
                name: this.params.itemname
            }
        }
    });
    this.route('altest', {
        path: '/altest',
        controller: 'BaseController',
        name: 'examplelist'
    });
});
