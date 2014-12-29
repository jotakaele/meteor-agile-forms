if (Autof.find().count() === 0) {
    var defaultAutoF = {
        "form": {
            "collection": "persons",
            "title": "Persons data",
            "modes": "add,update,delete",
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
            "modes": "add,update,delete",
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
// TODO El bloque de idiomas deberia ir en la parte general, no en agile-forms
//Inicializamos la base de datos de traducciones.
if (Translations.find().count() === 0) {
    nObj = {
        "_id": "en",
        "datetime": new Date(),
        "source": "fixtures"
    }
    ln = ["de-DE", "de-CH", "am-ET", "hy-AM", "az-AZ", "bjs-BB", "bem-ZM", "bn-IN", "be-BY", "my-MM", "bi-VU", "bs-BA", "br-FR", "bg-BG", "kab-DZ", "kea-CV", "ka-IN", "ca-ES", "cb-PH", "ch-GU", "cs-CZ", "ny-MW", "zh-CN", "zh-TW", "zdj-KM", "cop-EG", "ko-KR", "hr-HR", "da-DK", "dv-MV", "dz-BT", "sk-SK", "sl-SI", "es-ES", "eo-EU", "et-EE", "fn-FNG", "fo-FO", "fi-FI", "fr-FR", "acf-LC", "ht-HT", "crs-SC", "gl-ES", "cy-GB", "gd-GB", "ga-IE", "gv-IM", "ka-GE", "el-GR", "grc-GR", "gu-IN", "ha-NE", "haw-US", "he-IL", "hi-IN", "hu-HU", "id-ID", "en-GB", "aig-AG", "bah-BS", "gcl-GD", "gyn-GY", "vic-US", "jam-JM", "svc-VC", "is-IS", "it-IT", "ja-JA", "jw-ID", "kk-KZ", "km-KM", "rw-RW", "ky-KG", "rn-RN", "ku-TR", "ku-TR", "lo-LA", "la-VA", "lv-LV", "lt-LT", "lb-LU", "mk-MK", "ms-MY", "mg-MG", "mt-MT", "mi-NZ", "mh-MH", "mfe-MU", "men-SL", "mn-MN", "nl-NL", "ne-NP", "niu-NU", "no-NO", "ur-PK", "pau-PW", "pa-IN", "pap-PAP", "ps-PK", "fa-IR", "pis-SB", "pl-PL", "pt-PT", "pov-GW", "pot-US", "qu-PE", "rm-RO", "ro-RO", "ru-RU", "sm-WS", "sg-CF", "sr-RS", "sn-ZW", "si-LK", "syc-TR", "so-SO", "srn-SR", "sw-SZ", "sv-SE", "tl-PH", "th-TH", "tmh-DZ", "ta-LK", "tg-TJ", "te-IN", "tet-TL", "bo-CN", "ti-TI", "tpi-PG", "tkl-TK", "to-TO", "tn-BW", "tr-TR", "tk-TM", "tvl-TV", "uk-UA", "ppk-ID", "uz-UZ", "eu-ES", "vi-VN", "wls-WF", "wo-SN", "xh-ZA", "yi-YD", "zu-ZU", "ar-SA"]
    ln.forEach(function(itemLn) {
        nObj[itemLn] = itemLn
    })
    Translations.insert(nObj)
}
//Inicializamos la tabla _defaults, con los valores que necesitamos al inicio
if (Defaults.find().count() === 0) {
    var objDef = {
        lang: 'en',
        translating: 'none' // auto|none|manual
    }
    dbg('Cargando tabla _defaults')
    _.each(objDef, function(value, key) {
        Defaults.insert({
            _id: key,
            value: value
        })
    })
}
