cargaForm = function cargaForm(options, destDivName) {
    dbg('options', options)
    destDivName = destDivName || "formdest"
    if ($.type(options) != "object") {
        options = {
            name: options,
            mode: "new"
        }
    }
    var objItem = {}
    if (options.name) {
        objItem.name = options.name
    }
    // if (options._id) {
 //     objItem._id = options._id
 // }

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
            renderForm(res, destDivName)
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
        cargaForm(config, 'formdest')
    }, 500)
}
