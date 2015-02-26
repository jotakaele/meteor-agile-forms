var defaultAutoL = {
    "list": {
        "sources": {
            "main": {
                "collection": "persons",
                "sort": "sexo desc",
                "filter": {
                    "nombre": {
                        "_$in": ["Jose", "Julian", "Juan"]
                    }
                },
                "columns": {
                    "nombre_completo": "[nombre] + ' ' + [primer_apellido] + ' ' + [segundo_apellido]",
                    "sexo": null,
                    "text": "makeId(4)"
                }
            },
            "personas_colores": {
                "type": "oneToMany",
                "filter": null,
                "columns": {
                    "color": "[tono]+[color]"
                },
                "main_id": "personas_id"
            },
            "personas_direccion": {
                "type": "oneToOne",
                "filter": null,
                "columns": {
                    "municipio": null,
                    "makeid": "makeId(5)"
                },
                "main_id": "personas_id"
            }
        },
        "options": {
            "title": "Una tabla!! eval(Meteor.release)"
        }
    }
}
var nombres = ["Juan", "Pedro", "Luis", "Carmen", "Raul", "Pili", "Zulema", "Aitana", "Javi", "Victor", "Jose", "Julian", "Elisa", "Almudena", "Sagrario", "Jesus", "Carolina"]
var apellidos = ["Garcia", "Lopez", "Perez", "Gonzalez", "Sanchez", "Martinez", "Rodriguez", "Fernandez", "Gomez", "Martin", "Garcia garcia", "Hernandez", "Ruiz", "Diaz", "Alvarez", "Jimenez", "Lopez lopez", "Moreno", "Perez perez", "Munoz", "Alonso", "Gutierrez", "Romero", "Sanz", "Torres", "Suarez", "Ramirez", "Vazquez", "Navarro", "Lopez garcia", "Dominguez", "Ramos", "Garcia lopez", "Garcia perez", "Castro", "Gil", "Flores", "Morales"]
var aficiones = ["Aviones Spotting", "Aerografía", "Aeromodelismo", "Amateur de Astronomía", "Radioaficionados", "Animales / Mascotas / Perros", "Artes", "Astrología", "Astronomía", "Backgammon (juego de mesa)", "Bádminton", "Béisbol", "Baloncesto", "Playa / Tomar el sol", "Caminar por la playa", "Chaquira", "Beatboxing", "Tocar campanas", "Danza del vientre", "Andar en bicicleta", "Observación de aves", "Futbol", "Baloncesto", "Judo", "Lectura"]
var sexo = ["Hombre", "Mujer"]
var provincias = ["Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "La Coruña", "Cuenca", "Gerona", "Granada", "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Islas Baleares", "Jaén", "León", "Lérida", "Lugo", "Madrid", "Málaga", "Murcia", "Navarra", "Orense", "Palencia", "Las Palmas", "Pontevedra", "La Rioja", "Salamanca", "Santa Cruz de Tenerife", "Segovia", "Sevilla", "Soria", "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza", "Ceuta", "Melilla"]
if (Autol.find().count() === 0) {
    dbg("Insertando datos de prueba de listados");
    Autol.insert({
        name: "Persons list",
        content: defaultAutoL,
        state: "active"
    });
    Autol._ensureIndex({
        name: 1
    }, {
        unique: true,
        dropDups: true
    })
}


/*if (!Fixtures) {
    Fixtures = new Mongo.Collection('fixtures_data', {})
}
if (Fixtures.find().count() === 0) {
    var cantidad = 100
    for (c = 1; c <= cantidad; c++) {
        Fixtures.insert({
            name: randEl(nombres),
            last_name: randEl(apellidos),
            gender: randEl(sexo),
            age: _.random(18, 80),
            state: randEl(provincias),
            hobbies: _.uniq([randEl(aficiones), randEl(aficiones), randEl(aficiones), randEl(aficiones)]),
            comments: ""
        })
    }
}
*/