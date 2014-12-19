var defaultAutoF = {
    "form": {
        "collection": "personas",
        "title": "Datos de personas",
        "modes": "add,update,delete",
        "permisions": null,
        "classes": "none",
        "fields": {
            "_datos_personales": {
                "class": "none"
            },
            "nombre": {
                "maxlength": 20,
                "title": "Mi nombre",
                "required": true
            },
            "apellidos": {
                "maxlength": 50,
                "required": true
            },
            "fecha_nacimiento": {
                "type": "date"
            },
            "sexo": {
                "enum": "Hombre, Mujer",
                "type": "radio"
            },
            "aficiones": {
                "enum": "Aeromodelismo, Futbol, Macrame, Cine, Dormir",
                "multiple": true
            }
        }
    }
}
var sampleForm = {
    form: {
        "collection": "personas",
        "title": "Titulo formulario",
        "modes": "add,update,delete",
        "permisions": null,
        "classes": "none",
        "fields": {
            "_bloque_1": null,
            "field1": {
                "title": "Un name"
            },
            "_bloque_2": {
                "limit": 1
            },
            "field2": {
                "type": "currency"
            },
            "field3": {
                "enum": "a,b"
            },
            "_bloque_3": {
                "limit": 5
            },
            "field4": {
                "value": "$helper1$"
            },
            "field5": {
                "enum": "queries.lista_personas"
            }
        },
        "common": {
            "all": {
                "html": {
                    "placeholder": "Im a field"
                }
            },
            "control": {
                "input": {
                    "html": {
                        "placeholder": "Im a input"
                    }
                }
            },
            "type": {
                "currency": {
                    "html": {
                        "placeholder": "Im a currency"
                    }
                }
            },
            "block_content": {
                "_bloque_1": {
                    "html": {
                        "placeholder": "Im in _bloque_1"
                    }
                }
            },
            "blocks": {
                "style": "box-shadow: 0px 0px 5px  #777"
            }
        }
    },
    "helpers": {
        "helper1": "eval(makeId(7))"
    },
    "queries": {
        "lista_personas": {
            "collection": "personas",
            "filter": {
                "nombre": {
                    "_$in": ["juan", "pedro"]
                }
            },
            "format": {
                "sort": {
                    "apellidos": 1
                },
                "limit": 14
            },
            "value": "[nombre]",
            "label": "[nombre] + ' ' + [apellidos]",
            "optgroup": "[apellidos]"
        }
    }
}
var nombres = ["Juan", "Pedro", "Luis", "Carmen", "Raul", "Pili", "Zulema", "Aitana", "Javi", "Victor", "Jose", "Julian", "Elisa", "Almudena", "Sagrario", "Jesus", "Carolina"]
var apellidos = ["Garcia", "Lopez", "Perez", "Gonzalez", "Sanchez", "Martinez", "Rodriguez", "Fernandez", "Gomez", "Martin", "Garcia garcia", "Hernandez", "Ruiz", "Diaz", "Alvarez", "Jimenez", "Lopez lopez", "Moreno", "Perez perez", "Munoz", "Alonso", "Gutierrez", "Romero", "Sanz", "Torres", "Suarez", "Ramirez", "Vazquez", "Navarro", "Lopez garcia", "Dominguez", "Ramos", "Garcia lopez", "Garcia perez", "Castro", "Gil", "Flores", "Morales"]
var aficiones = ["Aviones Spotting", "Aerografía", "Aeromodelismo", "Amateur de Astronomía", "Radioaficionados", "Animales / Mascotas / Perros", "Artes", "Astrología", "Astronomía", "Backgammon (juego de mesa)", "Bádminton", "Béisbol", "Baloncesto", "Playa / Tomar el sol", "Caminar por la playa", "Chaquira", "Beatboxing", "Tocar campanas", "Danza del vientre", "Andar en bicicleta", "Observación de aves", "Futbol", "Baloncesto", "Judo", "Lectura"]
var sexo = ["Hombre", "Mujer"]
var provincias = ["Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "La Coruña", "Cuenca", "Gerona", "Granada", "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Islas Baleares", "Jaén", "León", "Lérida", "Lugo", "Madrid", "Málaga", "Murcia", "Navarra", "Orense", "Palencia", "Las Palmas", "Pontevedra", "La Rioja", "Salamanca", "Santa Cruz de Tenerife", "Segovia", "Sevilla", "Soria", "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza", "Ceuta", "Melilla"]
if (Autof.find().count() === 0) {
    dbg("Insertando datos de prueba de formulario");
    Autof.insert({
        type: "form",
        name: "Personas",
        content: defaultAutoF,
        state: "active"
    })
    Autof.insert({
        type: "form",
        name: "Sample Form",
        content: sampleForm,
        state: "active"
    })
    Autof._ensureIndex({
        name: 1
    }, {
        unique: true,
        dropDups: true
    })
}
