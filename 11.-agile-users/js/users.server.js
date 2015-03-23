Meteor.publish("userData", function() {
    if (this.userId) {
        return Meteor.users.find({
            _id: this.userId
        }, {
            fields: {
                profile: 1,
                services: 1
            }
        });
    } else {
        this.ready();
    }
});




/**
 * Regenera la lista de roles de cada usuario en funcion de la configuración de config > roles
 * @return {[type]} [description]
 */
createRolesFromConfigRoles = function() {
    // Recuperamos config>roles
    var res = sanitizeObjectNameKeys(masterConnection.config.findOne({
            name: 'roles'
        }).content)
        //Creamos una variable para cada tipo de clave
    var roles = res.roles ? res.roles : {}
    var usersRoles = res.users ? res.users : {}
        // dbg('roles', roles)
        //Recorremos la lista de usuarios
    userList = Meteor.users.find().fetch();
    //Eliminamos los roles actuales
    _.each(userList, function(user) {
        Meteor.users.update({
            _id: user._id
        }, {
            $set: {
                roles: []
            }
        })

        //Extraemos el email dependiendo del servicio
        //fixme Habra que eliminar el servicio twitter
        //fixme @importante ver como funciona la verificacion de emails y usar solo los verificados
        if (user.services.password) {
            var email = user.emails[0].address
        } else if (user.services.google) {
            var email = user.services.google.email
        } else if (user.services.facebook) {
            var email = user.services.facebook.email
        }


        //INsertamos los roles de la clave roles
        _.each(roles, function(value, key) {
                // dbg(key)

                if ((value || []).indexOf(email) >= 0) {

                    Roles.addUsersToRoles(user._id, [key])

                }
            })
            //INsertamos los roles de la clave users
        if (_.has(usersRoles, email)) {
            Roles.addUsersToRoles(user._id, usersRoles[email])

        }





    })

    console.log('Roles modified!')

}



masterConnection.config.after.insert(function(userId, doc) {
    if (doc.name = 'roles') {
        // Meteor.call('recreateRoles')
        createRolesFromConfigRoles()
    }

});



// Meteor.methods({
//     recreateRoles: function() {
//         createRolesFromConfigRoles()
//     }
// });
