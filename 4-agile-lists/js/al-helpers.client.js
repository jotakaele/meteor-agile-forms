cargaList = function cargaList(options, destDivName) {
    destDivName = destDivName || "listdest"
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
        res = Autol.findOne(obj)
        callback(res)
    }
    cargarItemInicial(obj.name, function(res) {
        if (res) {
            $.when(renderList(res, destDivName)).done(function() {
                activateFormLinks()
            })
        }
    })
}
Template.listshow.rendered = function() {
    var config = this.data
    Meteor.setTimeout(function() {
        cargaList(config.listName)
    }, 100)
}
Template.pageList.rendered = function() {
    dbg('this', this.data)
    var config = this.data
    Meteor.setTimeout(function() {
        cargaList(config.name, 'listdest')
    }, 500)
}
