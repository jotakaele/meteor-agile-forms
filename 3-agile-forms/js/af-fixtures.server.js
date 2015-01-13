if (Autof.find().count() === 0) {
    var defaultAutoF = {
        "form": {
            "collection": "persons",
            "title": "Persons data",
            "modes": {
                "new": null,
                "edit": null,
                "delete": null,
                "readonly": null
            },
            "permisions": null,
            "classes": "none",
            "fields": {
                "_personal_data": {
                    "class": "none"
                },
                "name": {
                    "maxlength": 20
                },
                "last_name": {
                    "maxlength": 50,
                    "required": true
                },
                "date_of_birth": {
                    "type": "date"
                },
                "gender": {
                    "enum": "man, woman",
                    "type": "radio"
                },
                "hobbies": {
                    "enum": "cine, futbol, sleep, running",
                    "multiple": true
                }
            }
        }
    }
    var sampleForm = {
        "form": {
            "collection": "persons",
            "title": "Form title",
            "modes": {
                "new": null,
                "edit": null,
                "delete": null,
                "readonly": null
            },
            "permisions": null,
            "classes": "none",
            "fields": {
                "_block_1": null,
                "field1": {
                    "title": "a name"
                },
                "_block_2": {
                    "limit": 1
                },
                "field_2": {
                    "type": "currency"
                },
                "field_3": {
                    "enum": "a,b"
                },
                "_block_3": {
                    "limit": 5
                },
                "field_4": {
                    "value": "$helper1$"
                },
                "field_5": {
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
                    "_block_1": {
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
                "collection": "persons",
                "filter": {
                    "name": {
                        "_$in": ["juan", "pedro"]
                    }
                },
                "format": {
                    "sort": {
                        "last_name": 1
                    },
                    "limit": 14
                },
                "value": "[name]",
                "label": "[name] + ' ' + [last_name]",
                "optgroup": "[last_name]"
            }
        }
    }
    var nombres = ["Juan", "Pedro", "Luis", "Carmen", "Raul", "Pili", "Zulema", "Aitana", "Javi", "Victor", "Jose", "Julian", "Elisa", "Almudena", "Sagrario", "Jesus", "Carolina"]
    var apellidos = ["Garcia", "Lopez", "Perez", "Gonzalez", "Sanchez", "Martinez", "Rodriguez", "Fernandez", "Gomez", "Martin", "Garcia garcia", "Hernandez", "Ruiz", "Diaz", "Alvarez", "Jimenez", "Lopez lopez", "Moreno", "Perez perez", "Munoz", "Alonso", "Gutierrez", "Romero", "Sanz", "Torres", "Suarez", "Ramirez", "Vazquez", "Navarro", "Lopez garcia", "Dominguez", "Ramos", "Garcia lopez", "Garcia perez", "Castro", "Gil", "Flores", "Morales"]
    var aficiones = ["Aviones Spotting", "Aerografía", "Aeromodelismo", "Amateur de Astronomía", "Radioaficionados", "Animales / Mascotas / Perros", "Artes", "Astrología", "Astronomía", "Backgammon (juego de mesa)", "Bádminton", "Béisbol", "Baloncesto", "Playa / Tomar el sol", "Caminar por la playa", "Chaquira", "Beatboxing", "Tocar campanas", "Danza del vientre", "Andar en bicicleta", "Observación de aves", "Futbol", "Baloncesto", "Judo", "Lectura"]
    var sexo = ["Hombre", "Mujer"]
    var provincias = ["Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "La Coruña", "Cuenca", "Gerona", "Granada", "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Islas Baleares", "Jaén", "León", "Lérida", "Lugo", "Madrid", "Málaga", "Murcia", "Navarra", "Orense", "Palencia", "Las Palmas", "Pontevedra", "La Rioja", "Salamanca", "Santa Cruz de Tenerife", "Segovia", "Sevilla", "Soria", "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza", "Ceuta", "Melilla"]
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
