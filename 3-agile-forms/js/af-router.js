Router.map(function() {
    this.route('pageForm', {
        path: '/af/:itemname/:itemmode/:itemdoc?/',
        controller: 'BaseController',
        data: function() {
            //dbg("this.params.query", this.params.query)
            var queryData = _.has(this.params.query || {}, 'data') ? EJSON.parse(secure2o(this.params.query.data)) : {}
            dbg("this.params.query", queryData)
            return {
                name: this.params.itemname,
                mode: this.params.itemmode,
                doc: this.params.itemdoc,
                values: queryData
            }
        }
    });
    this.route('test', {
        path: '/test',
        controller: 'BaseController',
        name: 'exampleform'
    });
});
