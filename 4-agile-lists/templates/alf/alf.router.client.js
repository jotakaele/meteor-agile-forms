Router.map(function() {
    this.route('alf', {
        path: '/alf/:list/:form?',
        controller: 'BaseController',
        name: 'alf',
        data: function() {
            return {
                form: this.params.form || this.params.list,
                list: this.params.list
            }
        }
    });
});
