cargaList = function cargaList(options) {
    dbg("loptions", options)

    function cargarItemInicial(nombreItem, callback) {
        res = Autol.findOne(_(options).pick('name'))
        callback(res)
    }
    cargarItemInicial(options.name, function (res) {
        if (res) {
            $.when(renderList(options)).done(function () {
                activateFormLinks()
            })
        }
    })
}
Template.listshow.rendered = function () {
    var config = this.data
    config.type = 'list'
    Meteor.setTimeout(function () {
        doSnippet(config)
    }, 100)
}
Template.pageList.rendered = function () {
    var config = this.data
    config.div = 'listdest'
    config.type = 'list'
    Meteor.setTimeout(function () {
        doSnippet(config)
    }, 500)
}
