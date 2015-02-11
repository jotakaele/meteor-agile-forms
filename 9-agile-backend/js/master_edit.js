//Lista de categorias a gestionar
var bEditorCambiado = false
categories = {
    "html": {
        "collection": "_html",
        "ace": "html"
    },
    "template": {
        "collection": "_template",
        "ace": "jade"
    },
    "css": {
        "collection": "_css",
        "ace": "css"
    },
    "text": {
        "collection": "_text",
        "ace": "text"
    },
    "config": {
        "collection": "_config",
        "ace": "yaml"
    }
}
Router.map(function() {
        this.route('masterEdit', {
            path: '/backend/master',
            controller: 'BaseController',
        });
    })
    //Creamos las conexiones
masterConnection = {}
_(categories).each(function(value, key) {
    dbg(key, o2S(value))
    if (!masterConnection[key]) {
        masterConnection[key] = new Mongo.Collection(value.collection);
    }
    if (Meteor.isServer) {
        Meteor.publish(key, function() {
            return masterConnection[key].find()
        })
    }
    if (Meteor.isClient) {
        Meteor.subscribe(key);
    }
})
if (Meteor.isClient) {
    Template.masterEdit.helpers({
        title: function() {
            return s('masterActiveCategory')
        },
        ace_mode: function() {
            return s('_backendMasterCategories')[s('masterActiveCategory')].ace
        },
        categories: function() {
            var aValues = []
            _(s('_backendMasterCategories')).each(function(value, key) {
                // 
                var oTemp = {
                    name: key,
                    collection: value['collection'],
                    ace: value['ace']
                }
                if (s('masterActiveCategory') == key) {
                    oTemp.selected = true
                }
                aValues.push(oTemp)
            })
            return aValues
        },
        items: function() {
            return masterConnection[s('masterActiveCategory')].find({}, {
                fields: {
                    name: 1
                }
            })
        }
    });
    Template.masterEdit.events({
        'change select#category': function(ev) {
            s('masterActiveCategory', $(ev.target).val())
        },
        'keyup input#filtrar': function(e) {
            var tx = $(e.target).val()
            $("#items_existentes dd[name]").each(function() {
                if ($(this).text().toUpperCase().indexOf(tx.toUpperCase()) == -1) {
                    $(this).hide(100)
                } else {
                    $(this).show(100)
                }
            })
        },
        'click #items_existentes .doc[id]': function(ev) {
            var $el = $(ev.target)
            if (editor_cambiado) {
                if (confirm("¿El item se ha modificado, pero no se ha guardado aún. \nSe perderán los cambios!! \n\n¿Continuar?") == false) {
                    return false;
                }
            }
            $('#ritem').html('')
            var sResContent = masterConnection[s('masterActiveCategory')].findOne($el.attr('id')).content
            loadAceEditor(sResContent, categories[s('masterActiveCategory')].ace, 'editor-container')
        }
    });
    //Destruye y crea un un nuevo editor ACE con el el contenido y configuración indicados
    loadAceEditor = function loadAceEditor(sContent, sMode, sDivContainer) {
        var aceOptions = {
            maxLines: 'Infinity',
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            // showInvisibles: true,
            highlightGutterLine: true,
            theme: 'ace/theme/clouds',
            highlightActiveLine: true,
            // mode: '/ace/mode/' + sMode,
            wrap: true,
            tabSize: 2
        }
        $('#editor').remove()
        var $editor = $('<div>', {
            id: 'editor'
        }).appendTo($('#' + sDivContainer))
        editor = ace.edit('editor');
        editor.setOptions(aceOptions)
        bEditorCambiado = false
            // editor.getSession().setUseWorker(false)
        editor.session.setMode({
            path: "ace/mode/" + sMode,
            v: Date.now()
        })
        editor.session.setValue(sContent)
            // editor.getSession().setUseWorker(true)
        editor.on('input', function() {
            bEditorCambiado = true
        })
    }
}
