//Inicializamos la tabla _defaults, con los valores que necesitamos al inicio
if (Defaults.find('appName').count() === 0) {
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
        masterActiveCategory: 'form',
        dayOfWeekStart: 1,
        lang: 'en',
        _passphrase: 'unacadena aleatoria', //La cadena que se usara como frase de paso en la operaciones de encriptado/desencriptado
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


if (!masterConnection.config.findOne({
        name: 'menus'
    })) {

    var menusDefault = {
        "menus": {
            "main": [{
                "name": "Inicio",
                "img": "fa-home",
                "attrs": {
                    "area1": "unform",
                    "area2": "unalist"
                },
                "pass": {
                    "allow": ["admin"]
                },
                "classes": "active"
            }, {
                "name": "Alumnos",
                "img": "fa-users",
                "classes": "red green",
                "sub": [{
                    "name": "2-1"
                }, {
                    "name": "2-22232",
                    "img": "fa-camera fa-1x",
                    "sub": [{
                        "name": 231
                    }, {
                        "name": 232,
                        "pass": {
                            "allow": ["admin"]
                        },
                        "sub": [{
                            "name": "algo profundo",
                            "img": "fa-camera"
                        }]
                    }]
                }]
            }, {
                "name": "Gastos",
                "img": "fa-euro"
            }, {
                "name": "Otras Cosas"
            }]
        }
    }

    masterConnection.config.insert({
        name: "menus",
        content: menusDefault
    })



}

if (!masterConnection.config.findOne({
        name: 'roles'
    })) {
    rolesDefault = {
        "roles": {
            "admin": ["juan.chamizo@gmail.com"],
            "gestor": ["gestor1@gmail.com", "gestor2@gmail.com", "admin@gmail.com"],
            "operator": ["operator1@gmail.com", "operator2@gmail.com", "operator3@gmail.com"]
        },
        "users": {
            "juan_point_chamizo@gmail_point_com": ["nada", "algo"]
        }
    }

    masterConnection.config.insert({
        name: "roles",
        content: rolesDefault
    })

}


//TODO Importante hacer un mecanismo que elimine automáticamente los registros de log expirados
//TODO hacer un mecanismo que impida que los usuarios modifiquen las variables globales, pero que permita que los usuarios si modifiquen su configuración. Lo mejor será crear un campo user, y uno global ¿y quizas uno scope, para odficinas, grupos, roles, etc....?
