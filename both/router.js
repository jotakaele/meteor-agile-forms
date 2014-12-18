Router.map(function() {
    this.route('autoEdit', {
        path: '/backend/af/:itemname?',
        data: function() {
            vname = this.params.itemname
            localStorage.removeItem('lastFormAdminChargeId')
                //dbg('ir', this.params._itemname)
            datos = {
                name: vname
            }
            dbg('datos', datos)
            return datos || null
        }
    });
    this.route('test', {
        path: '/test',
        name: 'exampleform'
    });
});
