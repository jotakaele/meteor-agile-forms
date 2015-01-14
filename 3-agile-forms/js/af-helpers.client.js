/*
La función cargaForm espera un objeto tal que 
{
    div: 'id_del_div_donde renderizar',
    mode: 'el modo del formulario [new,edit,delete,readonly]',
    name: El nombre del formulario a cargar
    doc: el id del documento(a cargar) si estamos en modo edit
}

*/
cargaForm = function cargaForm(objOptions) {
    defOptions = {
        div: 'formdest',
        mode: 'new'
    }
    if ($.type(objOptions) == 'string') {
        defOptions.name = 'objOptions'
    }
    options = {}
    _.extend(options, defOptions, objOptions)
    var objItem = {} //cremaos el objeto temporal
    if (options.name) {
        objItem.name = options.name
    }
    var obj = _.extend({
        state: 'active'
    }, objItem)
    dbg("options", options)
    var theRes = {}
        //recuperamos el af
    $.when(Autof.findOne(obj))
        //recuperamos el nombre de la coleccion a partir del resultado y extraemos el documento
        .then(function(res) {
            _(theRes).extend(res)
            var colName = res.content.form.collection
            if (_(['edit', 'readonly', 'delete']).indexOf(options.mode) >= 0) {
                //Quizas debamos recuperar desde un metodo, porque no siempre estarán todos los registros en el cliente....
                return cCols[colName].findOne(options.doc)
            }
            return null
        })
        // Incorporamos los datos del documento a theRes
        .then(function(theDoc) {
            dbg("theDoc", theDoc)
            dbg("theRes", theRes)
            if (theDoc) {
                insertDataValues(theRes.content.form.fields, theDoc)
            }
        })
        //lanzamos renderForm
        .done(function(res) {
            dbg('finalres', theRes)
            renderForm(theRes, options)
        })
}
Template.formshow.rendered = function() {
    dbg('this.data', this.data)
    var config = this.data
    Meteor.setTimeout(function() {
        cargaForm(config)
    }, 100)
}
Template.pageForm.rendered = function() {
        dbg('this.data', this.data)
        var config = this.data
        Meteor.setTimeout(function() {
            cargaForm(config)
        }, 500)
    }
    //Inserta los datos del documento (si existe) como value en la definición de cada field
insertDataValues = function insertDataValues(form, data) {
    _(form).each(function(value, key, theR) {
        // console.log(key)
        if (data[key]) {
            //current hay que devolver los values dependiendo del tipo de campo que sea, especialmente cuidado con los date, arrays y objetos
            value['value'] = data[key]
        }
    })
}
