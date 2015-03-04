if (Meteor.isClient) {
    //Inicializacion de Variables y filtros
    oVars = {
            bEditorCambiado: false,
            renderFromEditor: function () {
                //   renderList(jsyaml.load(editor.getValue()), 'ritem')
                //   El comando que se lanzará cuando queramos renderizar el list/etc depues d emodificarlo ene le editor
            },
            renderFromDatabase: function (src) {
                //renderList(src, 'ritem') //El comando que se lanzará cuando queramos renderizar el list/etc directamente desde la configuración de la base de datos
            },
            //Transformaciones que hacemos al valor recuperado del editor antes de guardarlo en la base de datos.
            editorToSave: function () {
                switch (snippets[s('masterActiveCategory')].ace) {
                case 'yaml':
                    //Si estamos almacenando JSON...
                    try {
                        var oRes = jsyaml.load(editor.getValue())
                    } catch (e) {
                        console.log(e);
                        // showToUser({
                        //     content: 'The YAML string is malformed <b>(LINEA ' + e.mark.line + ')</b>',
                        //     time: 2
                        // })
                        //editor.gotoLine(e.mark.line)
                        //editor.moveCursorTo(e.mark.line - 1, e.mark.column - 1)
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
            savedToEditor: function (src) {
                switch (snippets[s('masterActiveCategory')].ace) {
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
        /**
         * Extendemos la funcionalidad de snippets para trabajar con el backend
         */
    snippets.html.renderInMasterBackend = function () {
        //this.render(oVars.editorToSave(), 'ritem')
        doSnippet({
            type: 'html',
            src: oVars.editorToSave(),
            div: 'ritem',
            render: true
        })
    }
    snippets.jade.renderInMasterBackend = function () {
        //this.render(oVars.editorToSave(), 'ritem')
        doSnippet({
            type: 'jade',
            src: oVars.editorToSave(),
            div: 'ritem',
            render: true
        })
    }
    snippets.markdown.renderInMasterBackend = function () {
        //this.render(oVars.editorToSave(), 'ritem')
        doSnippet({
            type: 'markdown',
            src: oVars.editorToSave(),
            div: 'ritem',
            render: true
        })
    }
    snippets.css.renderInMasterBackend = function () {
        //this.render(oVars.editorToSave(), 'ritem')
        doSnippet({
            type: 'css',
            src: oVars.editorToSave(),
            div: 'ritem',
            render: true
        })
    }
    snippets.text.renderInMasterBackend = function () {}
    snippets.config.renderInMasterBackend = function () {}
    snippets.form.renderInMasterBackend = function () {
        $('#option-form').removeClass('hide')
        var contentFiltered = oVars.editorToSave()
        if (contentFiltered) {
            var oRenderOptions = {
                type: 'form',
                src: contentFiltered,
                div: 'ritem',
                name: $('input#name').val(),
                mode: $('select#form-mode').val() || s('master_edit_form_mode'),
                doc: $('select#form-doc-id').val() || s('last-' + $('input#name').val() + '-backend-edit-id'),
                values: s('last-' + $('input#name').val() + '-backend-edit-values') || {}
            }
            _(oRenderOptions).extend(jsyaml.load(editor.getValue()).test)
                // 
            doSnippet(oRenderOptions)
        } else {
            $('#ritem').html('<div class="alert-box alert">Form config error.</div>')
        }
    }
    snippets.list.renderInMasterBackend = function () {
            var contentFiltered = oVars.editorToSave()
            if (contentFiltered) {
                var oRenderOptions = {
                        type: 'list',
                        src: contentFiltered,
                        div: 'ritem'
                            // name: $('input#name').val()
                    }
                    //dbg("oRenderOptions", oRenderOptions)
                doSnippet(oRenderOptions)
            } else {
                $('#ritem').html('<div class="alert-box alert">List config error.</div>')
            }
            //dbg('bl', oRenderOptions)
        }
        /*    // Extendemos snippets con los metodos necesarios para el backend
        _.each(extendToBackend, function (value, key) {
            _.extend(snippets[key], value);
        });*/
    Template.masterEdit.rendered = function () {
        $('select#theme').val(s('active_ace_theme'))
        $('#items_existentes a[name="' + this.data.name + '"]').click()
    };
    Template.masterEdit.helpers({
        ace_mode: function () {
            return snippets[s('masterActiveCategory')].ace
        },
        form_modes: function () {
            var fModes = ['new', 'edit', 'readonly', 'delete']
            var fModesC = []
            _(fModes).each(function (value, key) {
                var oTemp = {}
                oTemp.name = value
                if (s('master_edit_form_mode') == value) {
                    oTemp.selected = 'selected'
                }
                fModesC.push(oTemp)
            })
            return fModesC
        },
        form_active_doc: function () {
            return s('last-' + this.name + '-backend-edit-id')
        },
        form_active_values: function () {
            return JSON.stringify(s('last-' + this.name + '-backend-edit-values'))
        },
        currentCategory: function () {
            return s('masterActiveCategory')
        },
        snippets: function () {
            var aValues = []
            var filtersnippets = this.mode ? _.pick(snippets, this.mode) : snippets
            _(filtersnippets).each(function (value, key) {
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
        items: function () {
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
        'change select#form-mode': function (ev) {
            s('master_edit_form_mode', $(ev.target).val())
        },
        'change select#theme': function (ev) {
            s('active_ace_theme', $(ev.target).val())
            if (editor) {
                editor.setTheme(s('active_ace_theme'))
            }
        },
        'mouseover select#theme option': function (ev) {
            if (editor) {
                editor.setTheme($(ev.target).val())
            }
        },
        'mouseleave select#theme': function (ev) {
            if (editor) {
                editor.setTheme(s('active_ace_theme'))
            }
        },
        'change select#category': function (ev) {
            s('masterActiveCategory', $(ev.target).val())
            $('#editor').remove()
            $('#eliminar,#duplicate').addClass('disabled')
            $('input#name').val('')
            $('#modeoptions > div').addClass('hide')
            $('#ritem').html('')
        },
        'keyup input#filtrar': function (e) {
            var tx = $(e.target).val()
            $("#items_existentes dd[name]").each(function () {
                if ($(this).text().toUpperCase().indexOf(tx.toUpperCase()) == -1) {
                    $(this).hide(100)
                } else {
                    $(this).show(100)
                }
            })
        },
        'click #duplicate': function () {
            if (!editor) {
                return false
            }
            var currentContent = editor.getValue()
            var sNewName = $('#name').val() + '-copy'
            $('#crear').click()
            editor.setValue(currentContent)
            editor.gotoLine(1)
            $('#name').val(sNewName)
            $('dd.active').removeClass('active')
        },
        'click #idiomas': function () {
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
                }, function (err, okLog) {
                    if (okLog) {
                        //Si ha insertado en el log
                        masterConnection[s('masterActiveCategory')].remove(oVars.sCurrentItemId)
                        showToUser({
                            content: t('Form') + ' ' + oVars.sInitialName + ' ' + t('deleted from database'),
                            class: 'secondary',
                            time: 2
                        })
                        $('input#name').val('')
                        loadAceEditor('', snippets[s('masterActiveCategory')].ace, 'editor-container')
                        delete oVars.sCurrentItemId
                        delete oVars.sInitialName
                    }
                })
            }
        },
        'click li#crear': function () {
            if (oVars.bEditorCambiado) {
                if (confirm("¿El item se ha modificado, pero no se ha guardado aún. \nSe perderán los cambios!! \n\n¿Continuar?") == false) {
                    return false;
                }
            }
            oVars.sInitialName = makeId(5)
            $('input#name').val(oVars.sInitialName)
            delete oVars.sCurrentItemId
            loadAceEditor('Hey i am a new ' + s('masterActiveCategory') + ' snippet', snippets[s('masterActiveCategory')].ace, 'editor-container')
        },
        'keyup input#name': function () {
            onEditorChange()
        },
        'click #items_existentes .doc[id]': function (ev) {
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
            loadAceEditor(sResContent, snippets[s('masterActiveCategory')].ace, 'editor-container')
        },
        'click #guardar i': function () {
            saveItem($('input#name').val(), editor.getValue(), oVars.sCurrentItemId)
        },
        'change select#form-doc-id': function (ev) {
            s('last-' + $('input#name').val() + '-backend-edit-id', $(ev.target).val())
            $('#ritem').html('')
            snippets[s('masterActiveCategory')].renderInMasterBackend()
        },
        'click #cargaides': function () {
            cargarIdes()
        }
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
            $('#eliminar,#duplicate').addClass('disabled')
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
            snippets[s('masterActiveCategory')].renderInMasterBackend()
            $('#eliminar,#duplicate').removeClass('disabled')
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
        }, function (err, res) {
            if (res) {
                if (sId) {
                    masterConnection[s('masterActiveCategory')].remove(sId)
                }
                sFilteredContent = oVars.editorToSave(sContent)
                var okInsert = masterConnection[s('masterActiveCategory')].insert({
                    name: sName,
                    content: desanitizeObjectNameKeys(sFilteredContent),
                    create_date: new Date(),
                    update: new Date()
                }, function (err, okInsert) {
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
        switch (s('masterActiveCategory')) {
        case 'jade':
            var t = 3000
            break;
        case 'html':
            var t = 0
            break;
        default:
            var t = 800
            break;
        }
        if (hacer) {
            clearTimeout(hacer)
            delete hacer
        }
        hacer = setTimeout(function () {
            if (oVars.bEditorCambiado === true) {
                showToUser({
                    content: '',
                    element: $('#ritem').parent(),
                    time: 2,
                    class: "renderized"
                })
                $('#ritem').html('')
                snippets[s('masterActiveCategory')].renderInMasterBackend()
            }
        }, t)
    }
}
//Carga los id de los elementos de formularios
function cargarIdes() {
        var coleccion = jsyaml.load(editor.getValue()).form.collection
        $.when(masterConnection[coleccion].find({}, {
            fields: {
                _id: true
            },
            sort: {
                autodate: -1
            }
        }).fetch()).done(function (res) {
            var $select = $('select#form-doc-id')
            $select.show()
            $('option', $select).remove()
            res.forEach(function (value, key) {
                $option = $('<option>').text(value._id).appendTo($select)
            })
            if (res[0]) {
                $select.val(res[0]._id)
            }
            $select.attr('title', coleccion)
            showToUser({
                content: coleccion,
                class: 'success',
                element: $('#form-doc-id').parent(),
                time: .1
            })
        })
    }
    //fixed Ver que pasa cuando se guardan los campos json si están mal formados. Evitar que se borren si no se han guardado correctamente.
    //fixed crear un metodo para duplicar snippet
    //fixed incorporar los elementos propios del modo edit , readonly y delete de form
    //todo Implementar métodos que permitan recuperar y transformar los snippets desde Javascript y desde templates, de manera cruzada, o sea que permitan usar uno en otros.
    //fixed Permitir abrr master/edit invocando a un modo y nombre en concreto, para llamarlo desde fuera. (tambien invocando con un modo e doc en el caso de formularios)
    //fixed @urgente. Se eliminan los elementos cuando se les cambia el nombre!!!

