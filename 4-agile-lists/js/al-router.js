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
});
Router.map(function() {
    this.route('list', {
        path: '/list/:itemname/',
        controller: 'BaseController',
        data: function() {
            return {
                name: this.params.itemname,
            }
        }
    });
});
