//Inicializamos la tabla _defaults, con los valores que necesitamos al inicio
if (Defaults.find().count() === 0) {
    var objDef = {
        appName: "Agile-form-master",
        adminEmail: "juan.chamizo@gmail.com",
        appMode: "develop",
        default_date_format: {
            datetimepicker: 'd/m/Y',
            moment: 'DD/MM/YYYY'
        },
        default_time_format: {
            datetimepicker: 'H:i',
            moment: 'HH:mm'
        },
        default_datetime_format: {
            datetimepicker: 'd/m/Y H:i',
            moment: 'DD/MM/YYYY HH:mm'
        },
        dayOfWeekStart: 1,
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
            backup_af: {
                day: 3
            },
            form_mode_not_allowed: {
                day: 5
            }
        }
    }
    console.log('Cargando tabla _defaults')
    _.each(objDef, function(value, key) {
        Defaults.insert({
            _id: key,
            value: value
        })
    })
}
//TODO Importante hacer un mecanismo que elimine automáticamente los registros de log expirados
//TODO hacer un mecanismo que impida que los usuarios modifiquen las variables globales, pero que permita que los usuarios si modifiquen su configuración. Lo mejor será crear un campo user, y uno global ¿y quizas uno scope, para odficinas, grupos, roles, etc....?
