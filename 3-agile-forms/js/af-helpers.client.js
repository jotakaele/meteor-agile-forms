//Current Cambiando el modo en que llmamamos a la función cargaForm, para que reciba un objeto que incluya el modo (y el id)
/*
La función cargaForm espera un objeto tal que 
{
    divName: 'id_del_div_donde renderizar',
    mode: 'el modo del formulario [new,edit,delete,readonly]',
    name: El nombre del formulario a cargar
    docId: el id del documento(a cargar) si estamos en modo edit
}

*/
cargaForm = function cargaForm(objOptions) {
    defOptions = {
        divName: 'formdest',
        mode: 'new'
    }
    if ($.type(objOptions) == 'string') {
        defOptions.name = 'objOptions'
    }
    options = {}
    _.extend(options, defOptions, objOptions)
    dbg('options', options)
    var objItem = {} //cremaos el objeto temporal
    if (options.name) {
        objItem.name = options.name
    }
    var obj = _.extend({
        state: 'active'
    }, objItem)
    dbg('obj', obj)

    function cargarItemInicial(nombreItem, callback) {
        res = Autof.findOne(obj)
        callback(res)
    }
    cargarItemInicial(obj.name, function(res) {
        if (res) {
            renderForm(res, options)
        }
    })
}
Template.formshow.rendered = function() {
    var config = this.data
    Meteor.setTimeout(function() {
        cargaForm(config)
    }, 100)
}
Template.pageForm.rendered = function() {
    dbg('this', this.data)
    var config = this.data
    Meteor.setTimeout(function() {
        cargaForm(config)
    }, 500)
}
