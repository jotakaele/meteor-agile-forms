Router.map(function() {
    this.route('autoFormEdit', {
        path: '/backend/af/:itemname?',
        data: function() {
            vname = this.params.itemname || localStorage.getItem('lastFormAdminChargeName')
            datos = {
                name: vname
            }
            return datos || null
        },
        controller: 'BaseController'
    });
    this.route('autoListEdit', {
     path: '/backend/al/:itemname?',
     data: function() {
         vname = this.params.itemname || localStorage.getItem('lastListAdminChargeName')
         datos = {
             name: vname
         }
         return datos || null
     },
     controller: 'BaseController'
 });

})
