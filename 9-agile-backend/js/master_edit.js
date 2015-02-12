//Lista de categorias a gestionar
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
    },
    "form": {
        "collection": "_af",
        "ace": "yaml"
    },
    "list": {
        "collection": "_al",
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
    if (key == 'form') {
        masterConnection[key] = Autof
    } else if (key == 'list') {
        masterConnection[key] = Autol
    } else {
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
    }
})
if (Meteor.isClient) {
    //Inicializacion de Variables y filtros
    var oVars = {
        bEditorCambiado: false,
        renderFromEditor: function() {
            //   renderList(jsyaml.load(editor.getValue()), 'ritem')
            //   El comando que se lanzará cuando queramos renderizar el list/etc depues d emodificarlo ene le editor
        },
        renderFromDatabase: function(src) {
            //renderList(src, 'ritem') //El comando que se lanzará cuando queramos renderizar el list/etc directamente desde la configuración de la base de datos
        },
        //Transformaciones que hacemos al valor recuperado del editor antes de guardarlo en la base de datos.
        editorToSave: function() {
            switch (categories[s('masterActiveCategory')].ace) {
                case 'yaml':
                    //Si estamos almacenando JSON...
                    return jsyaml.load(editor.getValue())
                    break;
                default:
                    return editor.getValue()
                    break;
            }
        },
        //Transformaciones que hacemos al valor recuperado de la base de datos antes de volcarlo en el editor
        savedToEditor: function(src) {
            switch (categories[s('masterActiveCategory')].ace) {
                case 'yaml':
                    // Si estamos recuperando JSON y vamos a trabajar en YAML ....
                    return jsyaml.dump(sanitizeObjectNameKeys(src))
                    break;
                default:
                    return sanitizeObjectNameKeys(src)
                    break;
            }
        },
    }
    Template.masterEdit.helpers({
        title: function() {
            return s('masterActiveCategory')
        },
        ace_mode: function() {
            return categories[s('masterActiveCategory')].ace
        },
        categories: function() {
            var aValues = []
            _(categories).each(function(value, key) {
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
            $('#editor').remove()
            $('input#name').val('')
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
        'click li#crear': function() {
            if (oVars.bEditorCambiado) {
                if (confirm("¿El item se ha modificado, pero no se ha guardado aún. \nSe perderán los cambios!! \n\n¿Continuar?") == false) {
                    return false;
                }
            }
            oVars.sInitialName = makeId(5)
            $('input#name').val(oVars.sInitialName)
            delete oVars.sCurrentItemId
            loadAceEditor('Hey i am a new ' + s('masterActiveCategory') + ' snippet', categories[s('masterActiveCategory')].ace, 'editor-container')
        },
        'keyup input#name': function() {
            onEditorChange()
        },
        'click #items_existentes .doc[id]': function(ev) {
            var $el = $(ev.target)
            if (oVars.bEditorCambiado) {
                if (confirm("¿El item se ha modificado, pero no se ha guardado aún. \nSe perderán los cambios!! \n\n¿Continuar?") == false) {
                    return false;
                }
            }
            $('#ritem').html('')
            var sResContent = masterConnection[s('masterActiveCategory')].findOne($el.attr('id')).content
            sResContent = oVars.savedToEditor(sResContent)
            loadAceEditor(sResContent, categories[s('masterActiveCategory')].ace, 'editor-container')
            oVars.sInitialName = $el.attr('name');
            oVars.sCurrentItemId = $el.attr('id');
            $('input#name').val($el.attr('name'))
            $('.doc[name]').parent().removeClass('active')
            $el.parent().addClass('active')
        },
        'click #guardar i': function() {
            saveItem($('input#name').val(), editor.getValue(), oVars.sCurrentItemId)
        },
    });
    //Destruye y crea un un nuevo editor ACE con el el contenido y configuración indicados
    var editor = ''
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
            oVars.bEditorCambiado = false
                // editor.getSession().setUseWorker(false)
            editor.session.setMode({
                path: "ace/mode/" + sMode,
                v: Date.now()
            })
            oVars.sInitialContent = sContent //Aplicar aqui las trasnformaciones de cada modo
            editor.session.setValue(oVars.sInitialContent)
            editor.on('input', onEditorChange)
        }
        //Lo que procesamos cuando se cambia algo en ele editor o en el input#name
    onEditorChange = function onEditorChange() {
            if (oVars.sInitialContent != editor.getValue() || oVars.sInitialName != $('input#name').val()) {
                oVars.bEditorCambiado = true
                $('#editor').addClass('modificado')
                $('li#guardar i').removeClass('hide').parent().addClass('modificado')
            } else {
                $('#editor').removeClass('modificado')
                $('li#guardar i').addClass('hide').parent().removeClass('modificado')
            }
        }
        //Guardar el item 
    function saveItem(sName, sContent, sId) {
        console.clear()
        console.log(sName, sContent, sId)
        if (!oVars.bEditorCambiado) {
            return false;
        }
        if (!confirm("Save the form definition \n[" + sName + "]?")) {
            return false
        }
        //Guardamos el actual a traves de log 
        Meteor.call('setLog', 'backup_master_' + s('masterActiveCategory'), {
            name: oVars.sInitialName,
            content: oVars.sInitialContent
        }, function(err, res) {
            if (res) {
                if (!sId == undefined) {
                    masterConnection[s('masterActiveCategory')].remove(sId)
                }
                sFilteredContent = oVars.editorToSave(sContent)
                var okInsert = masterConnection[s('masterActiveCategory')].insert({
                    name: sName,
                    content: sFilteredContent,
                    create_date: new Date(),
                    update: new Date()
                }, function(err, okInsert) {
                    if (okInsert) {
                        showToUser({
                            content: t('Saved form') + ' <b>' + sName + '</b>',
                            class: 'success',
                            time: 1
                        })
                        oVars.bEditorCambiado = false
                        $('li#guardar i').addClass('hide').parent().removeClass('modificado')
                        $("div#editor").removeClass("modificado")
                        $('.doc[name]').parent().removeClass('active')
                        $('.doc[name="' + sName + '"]').parent().addClass('active')
                        oVars.sCurrentItemId = okInsert
                        oVars.sInitialName = sName
                        oVars.sInitialContent = sContent
                    }
                })
            }
        })
    }
}
