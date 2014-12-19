Router.map(function() {
    this.route('autoEdit', {
        path: '/backend/af/:itemname?',
        data: function() {
            vname = this.params.itemname || localStorage.getItem('lastFormAdminChargeName')
            datos = {
                name: vname
            }
            return datos || null
        }
    });
    this.route('pageForm', {
        path: '/af/:itemname/:itemmode/',
        data: function() {
            return {
                name: this.params.itemname,
                mode: this.params.itemmode
            }
        }
    });
    this.route('test', {
        path: '/test',
        name: 'exampleform'
    });
});
