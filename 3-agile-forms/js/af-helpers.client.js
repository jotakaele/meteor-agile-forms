/*
La función cargaForm espera un objeto tal que 
{
    src: {form: .... } //Opcional. src puede ser un objeto JSON de definicion del formulario, Si el parametro no existe, lo extraerá de la base de datos a partir de name (habitual)
    div: 'id_del_div_donde renderizar',
    mode: 'el modo del formulario [new,edit,delete,readonly]',
    name: El nombre del formulario a cargar
    doc: el id del documento(a cargar) si estamos en modo edit
}

*/
cargaForm = function cargaForm(objOptions) {
    // creamos opciones por defecto
    defOptions = {
            div: 'formdest',
            mode: 'new'
        }
        // Si solo hemos recibido un string lo tratamos como el nombre del formulario y lo integramos en defOptions
    if ($.type(objOptions) == 'string') {
        defOptions.name = 'objOptions'
    }
    //Creamos options y le ponemos los valores por defecto más los que hemos recibido como argumentos
    options = _.extend({}, defOptions, objOptions)
        // dbg("options", options)
        //Creamo objItem para conectar a la base de datos
    var objItem = {} //cremaos el objeto temporal
        //Si no existe objOptions.src es que estamos construyeno a apartir del nombre y vamos a coger el formualrio desde la bd
    if (!objOptions.src) {
        var obj = {
            state: 'active',
            name: objOptions.name
        }
    }
    //recuperamos el af, solo si no estamos recibiendo  objOptions.src como un objeto
    $.when((function(options) {
            if (!options.src) {
                return Autof.findOne(obj)
            } else {
                return options.src
            }
        })(options))
        //recuperamos el nombre de la coleccion a partir del resultado y extraemos el documento
        .then(function(res) {
            if (!options.src) {
                options.src = res
            } else {
                delete options.src
                options.src = {
                    content: objOptions.src
                }
            }
            var colName = options.src.content.form.collection
            if (_(['edit', 'readonly', 'delete']).indexOf(options.mode) >= 0) {
                //fixme ¿Quizas debamos recuperar desde un metodo, porque no siempre estarán todos los registros en el cliente....? OJO, ya hay un metodo hecho para ello
                var myRes = cCols[colName].findOne(options.doc)
                if (!myRes) {
                    Meteor.Errors.throw(t('No such document') + ' [' + options.doc + '] ' + t('on collection') + '  [' + colName + '], or isn`t allowed for current user')
                    delete options.src
                }
                return myRes
            }
            return null
        })
        // Incorporamos los datos del documento a theRes
        .then(function(theDoc) {
            if (theDoc) {
                insertDataValues(options.src.content.form.fields, theDoc)
            }
        })
        //lanzamos el renderizado
        .done(function(res) {
            if (options.src) {
                autof = new AF(options.div, {
                        def: sanitizeObjectNameKeys(options.src.content || option.src),
                        name: options.name,
                        mode: options.mode || 'new',
                        doc: options.id || null
                    })
                    //TODO Importante @security Poner una condicion que permita que solo los ususrios administradores puedan manejar la configuración
                if (1 == 1) {
                    var theAdminLink = $('<a>', {
                        class: 'admin admin-form',
                        target: '_blank',
                        href: '/backend/af/' + options.name,
                        title: t('Setup this form')
                    }).html('<i class="fa fa-wrench"></i>').prependTo($('#' + options.div).parent())
                }
            }
        })
    return options
}
Template.formshow.rendered = function() {
    var config = this.data
    Meteor.setTimeout(function() {
        cargaForm(config)
    }, 100)
}
Template.pageForm.rendered = function() {
        var config = this.data
        Meteor.setTimeout(function() {
            cargaForm(config)
        }, 500)
    }
    //Inserta los datos del documento (si existe) como value en la definición de cada field
insertDataValues = function insertDataValues(form, data) {
        var inBlock = false
        _(form).each(function(value, key, form) {
            //primero quitamos los valores por defecto
            delete value['value']
                //Despues marcamos los que pertenecen a un bloque, basandonos en su primer caracter
            if (_.startsWith(key, '_')) {
                inBlock = false
                if (value.limit) {
                    inBlock = key
                }
            } else {
                if (inBlock) {
                    value.block = inBlock
                }
            }
        })
        _(data).each(function(value, key, theR) {
            if (form[key]) {
                if (_.startsWith(key, '_')) {
                    //Procesamos los objetos
                    if (form[key].limit == 1) {
                        //Soy un objeto simple
                        //dbg(key, $.type(value))
                        _(value).each(function(dataValue, dataKey) {
                            // console.log(dataKey, dataValue)
                            if (form[dataKey].block == key) {
                                form[dataKey].value = bdToHtmlValue(dataValue, form[dataKey].type)
                            }
                        })
                    }
                    if (form[key].limit > 1) {
                        form[key].value = []
                            //Soy un array. Puedo cargar los valores en form como un array, pero aún no puedo asignarlos directamente a cada field, porque se renderizan en html
                        _(value).each(function(arrayValue, arrayKey) {
                            _(arrayValue).each(function(arrayDatavalue, arrayDataKey) {
                                    arrayDatavalue = bdToHtmlValue(arrayDatavalue, form[arrayDataKey].type)
                                        //   dbg(arrayDataKey, arrayDatavalue)
                                    arrayValue[arrayDataKey] = arrayDatavalue
                                })
                                // dbg(arrayKey, arrayValue)
                            form[key].value.push(arrayValue)
                        })
                    }
                } else {
                    //Procesamos los campos simples
                    form[key].value = bdToHtmlValue(value, form[key].type)
                }
            }
        })
        dbg('data', data)
        dbg('form', form)
    }
    //Convierte valores de kl abase de datos en el indicado en tyeHTML
bdToHtmlValue = function bdToHtmlValue(value, typeHTML) {
    switch ($.type(value)) {
        case 'string':
            res = value
            break;
        case 'date':
            switch (typeHTML) {
                case 'date':
                    res = moment(value).format(s('default_date_format').moment)
                    break;
                case 'datetime':
                    res = moment(value).format(s('default_datetime_format').moment)
                    break;
                case 'time':
                    res = moment(value).format(s('default_time_format').moment)
                    break;
                default:
                    break;
            }
            break;
        default:
            res = value
            break;
    }
    return res
}
