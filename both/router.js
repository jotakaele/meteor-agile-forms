Router.map(function() {
    this.route('autoEdit', {
        path: '/backend/af/:itemname',
        data: function() {
            vname = this.params.itemname
                //dbg('ir', this.params._itemname)
            datos = {
                name: vname
            }
            return datos
        }
    });
});
