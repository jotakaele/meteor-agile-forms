//Inicializamos la tabla _defaults, con los valores que necesitamos al inicio
if (Defaults.find().count() === 0) {
    var objDef = {
        lang: 'en',
        translating: 'none', // auto|none|manual
        dbg: true, //true|false activa o desacctiva la salida dbg
        log: true, // activa o desactiva la grabación de logs en el servidor
        log_expire: { // Determina el tiempo de expiracion de los registros de log 
            insert_record: {
                year: 1
            },
            delete_record: {
                year: 1
            },
            update_record: {
                year: 1
            },
            form_mode_not_allowed: {
                day: 5
            }
        }
    }
    dbg('Cargando tabla _defaults')
    _.each(objDef, function(value, key) {
        Defaults.insert({
            _id: key,
            value: value
        })
    })
}
//TODO Importante hacer un mecanismo que elimine automáticamente los registros de log expirados
