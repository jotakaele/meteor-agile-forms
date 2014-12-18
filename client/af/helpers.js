cargaForm = function cargaForm(options) {
        // dbg('options', options)
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
            // dbg('cargando ', nombreItem)
        function cargarItemInicial(nombreItem, callback) {
            res = Autof.findOne(obj)
            callback(res)
        }
        cargarItemInicial(obj.name, function(res) {
            // dbg('obj', obj)
            // dbg("res", res)
            if (res) {
                renderForm(res.content, 'formdest')
            }
        })
    }
    



Template.formshow.rendered = function() {
	var config = this.data
	//dbg('this',this.data)
    Meteor.setTimeout(function() {
        cargaForm(config.formName)
    }, 100)
}





Template.formshow.helpers({
	h: function(){
		dbg('h',$('#formdest'))
	}



})