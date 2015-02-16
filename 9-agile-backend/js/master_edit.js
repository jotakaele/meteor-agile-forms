//Lista de categorias a gestionar
categories = {
    html: {
        collection: "_html",
        ace: "html",
        renderFunction: function() {
            renderHtml(oVars.editorToSave(), 'ritem')
        }
    },
    template: {
        collection: "_template",
        ace: "jade",
        renderFunction: function() {}
    },
    markdown: {
        collection: "_markdown",
        ace: "markdown",
        renderFunction: function() {
            renderMarkdown(oVars.editorToSave(), 'ritem')
        }
    },
    css: {
        collection: "_css",
        ace: "css",
        renderFunction: function() {}
    },
    text: {
        collection: "_text",
        ace: "text",
        renderFunction: function() {}
    },
    config: {
        collection: "_config",
        ace: "yaml",
        renderFunction: function() {}
    },
    form: {
        collection: "_af",
        ace: "yaml",
        renderFunction: function() {
            var contentFiltered = oVars.editorToSave()
            if (contentFiltered) {
                cargaForm({
                    src: contentFiltered,
                    div: 'ritem',
                    name: $('input#name').val()
                })
            } else {
                $('#ritem').html('<div class="alert-box alert">Form config error.</div>')
            }
        }
    },
    list: {
        collection: "_al",
        ace: "yaml",
        renderFunction: function() {
            var contentFiltered = oVars.editorToSave()
            if (contentFiltered) {
                dbg('hay')
                renderList(contentFiltered, 'ritem')
            } else {
                $('#ritem').html('<div class="alert-box alert">List config error.</div>')
            }
        }
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
            //Creamos los indices si no se han creado antes
            if (!s('master_ensure_index_run_' + key)) {
                masterConnection[key]._ensureIndex({
                    name: 1
                }, {
                    unique: true,
                    dropDups: true
                })
                s('master_ensure_index_run_' + key, true)
            }
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
    oVars = {
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
                    try {
                        var oRes = jsyaml.load(editor.getValue())
                    } catch (e) {
                        console.log(e);
                        showToUser({
                            content: 'The YAML string is malformed <b>(LINEA ' + e.mark.line + ')</b>',
                            time: 2
                        })
                        editor.gotoLine(e.mark.line)
                        editor.moveCursorTo(e.mark.line - 1, e.mark.column - 1)
                    }
                    if (typeof oRes == 'object') {
                        return oRes
                    } else {
                        return false
                    }
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
    Template.masterEdit.rendered = function() {
        $('select#theme').val(s('active_ace_theme'))
    };
    Template.masterEdit.helpers({
        ace_mode: function() {
            return categories[s('masterActiveCategory')].ace
        },
        categories: function() {
            var aValues = []
            _(categories).each(function(value, key) {
                // 
                var oTemp = {
                    name: key,
                    title: key.toUpperCase(),
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
                },
                sort: {
                    name: 1
                }
            })
        }
    });
    Template.masterEdit.events({
        'change select#theme': function(ev) {
            s('active_ace_theme', $(ev.target).val())
            if (editor) {
                editor.setTheme(s('active_ace_theme'))
            }
        },
        'mouseover select#theme option': function(ev) {
            if (editor) {
                editor.setTheme($(ev.target).val())
            }
        },
        'mouseleave select#theme': function(ev) {
            if (editor) {
                editor.setTheme(s('active_ace_theme'))
            }
        },
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
        'click #idiomas': function() {
            if ($('#translatablewords').length >= 1) {
                $('#translatablewords').toggle()
            } else {
                showTraductionsPanel()
            }
        },
        'click #eliminar': function eliminarItem() {
            if (!confirm("Delete this " + s('masterActiveCategory') + "  snipped \n[" + oVars.sInitialName + "]?")) {
                return false
            }
            if (oVars.sCurrentItemId) {
                //Guardamos el actual a traves de log 
                Meteor.call('setLog', 'delete_master_' + s('masterActiveCategory'), {
                    name: oVars.sInitialName,
                    content: oVars.sInitialContent
                }, function(err, okLog) {
                    if (okLog) {
                        //Si ha insertado en el log
                        masterConnection[s('masterActiveCategory')].remove(oVars.sCurrentItemId)
                        showToUser({
                            content: t('Form') + ' ' + oVars.sInitialName + ' ' + t('deleted from database'),
                            class: 'secondary',
                            time: 2
                        })
                        $('input#name').val('')
                        loadAceEditor('', categories[s('masterActiveCategory')].ace, 'editor-container')
                        delete oVars.sCurrentItemId
                        delete oVars.sInitialName
                        dbg('oVars', oVars)
                    }
                })
            }
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
            $('.doc[name]').parent().removeClass('active')
            $el.parent().addClass('active')
            oVars.sInitialName = $el.attr('name');
            oVars.sCurrentItemId = $el.attr('id');
            $('input#name').val($el.attr('name'))
            loadAceEditor(sResContent, categories[s('masterActiveCategory')].ace, 'editor-container')
        },
        'click #guardar i': function() {
            saveItem($('input#name').val(), editor.getValue(), oVars.sCurrentItemId)
        },
    });
    //Destruye y crea un un nuevo editor ACE con el el contenido y configuración indicados
    editor = ''
    loadAceEditor = function loadAceEditor(sContent, sMode, sDivContainer) {
            var aceOptions = {
                maxLines: 'Infinity',
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                // showInvisibles: true,
                highlightGutterLine: true,
                theme: s('active_ace_theme') || 'ace/theme/clouds',
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
            categories[s('masterActiveCategory')].renderFunction()
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
            lanzarRenderizado()
        }
        //Guardar el item 
    function saveItem(sName, sContent, sId) {
        console.clear()
        console.log(sName, sContent, sId)
        sFilteredContent = oVars.editorToSave(sContent)
        if (!sFilteredContent) {
            return false;
        }
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
                if (sId) {
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
    var hacer = ''

    function lanzarRenderizado() {
        if (hacer) {
            clearTimeout(hacer)
            delete hacer
        }
        hacer = setTimeout(function() {
            if (oVars.bEditorCambiado === true) {
                $("#ritem").html('Se ha lanzado el renderizado ' + new Date())
                categories[s('masterActiveCategory')].renderFunction()
            }
        }, 800)
    }
}
//fixed Ver que pasa cuando se guardan los campos json si están mal formados. Evitar que se borren si no se han guardado correctamente.
//Todo crear un metodo para duplicar snippet
//Todo incorporar los elementos propios del modo edit , readonly y delete de form
