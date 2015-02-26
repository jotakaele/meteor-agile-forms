//Creamos las conexiones
//Las conexiones que comienzan por _ son conexiones del administrador y/o de la aplicacion, pero nonca del usuario. El resto son del usuario y la seguridad tiene que definirse en la publicación
//todo definir seguridad en la publicacion
masterConnection = {}
_(snippets).each(function (value, key) {
    if (!masterConnection[key]) {
        masterConnection[key] = new Mongo.Collection(value.collection);
    }
    if (Meteor.isServer) {
        //Creamos los indices si no se han creado antes
        if (!s('master_ensure_index_run_' + key)) {
            masterConnection[key]._ensureIndex({
                name: 1
            }, {
                unique: true,
                dropDups: true
            })
            s('master_ensure_index_run_' + key, true)
        }
        Meteor.publish(key, function () {
            return masterConnection[key].find()
        })
    }
    if (Meteor.isClient) {
        Meteor.subscribe(key);
    }
    // }
})
if (Meteor.isServer) {
    Meteor.methods({
        getUserCollections: function () {
            var aUserCollections = []
                //Extraemos las collecciones de list
            var lists = masterConnection.list.find().fetch()
            _.each(lists, function (value, key) {
                    aUserCollections.push(value.content.list.sources.main.collection)
                    _.each(value.content.list.sources, function (subValue, subKey) {
                        if (subKey != 'main' && subValue.collection) {
                            aUserCollections.push(subValue.collection)
                                //console.log(subValue.collection)
                        }
                    })
                })
                //Extraemos las coleccioes de form
            var forms = masterConnection.form.find().fetch()
            _.each(forms, function (value, key) {
                aUserCollections.push(value.content.form.collection)
            })
            aUserCollections = _.uniq(aUserCollections)
            _.each(aUserCollections, function (value) {
                if (!masterConnection[value]) {
                    masterConnection[value] = new Mongo.Collection(value);
                    Meteor.publish(value, function () {
                        return masterConnection[value].find()
                    })
                }
            })
            return aUserCollections
        }
    });
}
if (Meteor.isClient) {
    Meteor.call('getUserCollections', function (err, res) {
        if (!err && res) {
            console.log(res)
            _.each(res, function (value) {
                console.log(value)
                masterConnection[value] = new Mongo.Collection(value)
                Meteor.subscribe(value)
            })
        }
    })
}
