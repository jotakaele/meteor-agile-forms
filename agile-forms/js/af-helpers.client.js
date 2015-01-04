cargaForm = function cargaForm(options, destDivName) {
    destDivName = destDivName || "formdest"
    if ($.type(options) != "object") {
        options = {
            name: options
        }
    }
    var objItem = {}
    if (options.name) {
        objItem.name = options.name
    }
    if (options._id) {
        objItem._id = options._id
    }
    obj = _.extend({
        state: 'active'
    }, objItem)

    function cargarItemInicial(nombreItem, callback) {
        res = Autof.findOne(obj)
        callback(res)
    }
    cargarItemInicial(obj.name, function(res) {
        if (res) {
            renderForm(res, destDivName)
        }
    })
}
Template.formshow.rendered = function() {
    var config = this.data
    Meteor.setTimeout(function() {
        cargaForm(config.formName)
    }, 100)
}
Template.pageForm.rendered = function() {
    dbg('this', this.data)
    var config = this.data
    Meteor.setTimeout(function() {
        cargaForm(config.name, 'formdest')
    }, 500)
}
