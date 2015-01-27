//modo en que estamos trabajando en diseño
aceOptions = {
    maxLines: Infinity,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    // showInvisibles: true,
    highlightGutterLine: true,
    theme: "ace/theme/textmate",
    highlightActiveLine: true,
    mode: "ace/mode/yaml",
    wrap: true,
    tabSize: 2
}
var initialYAML = ''
var initiallNameText = ''
var myFold = {}
currentForm = {}
editor_cambiado = false
coloreaEtiquetas = function() {
    $('dd[collection]').each(function() {
        var color = onl.randomSeedColor($(this).attr('collection'))
        $(this).css('border-bottom', '3px solid #' + color)
    })
}
var hacer = ''
initialYAML = {}
initiallNameText = ''
guardarFormDef = function guardarFormDef() {
    // dbg('currentForm', currentForm)
    if (!editor_cambiado) {
        return false;
    }
    var data = {}
    data.name = $('input#nombre').val()
    data._id = currentForm._id
    if (confirm("Save the form definition \n[" + data.name + "]?")) {
        if (data._id) {
            //Guardamos el actual a traves de log 
            Meteor.call('setLog', 'backup_af', currentForm)
                //Si ha insertado en el log
            Autof.remove(data._id)
        }
        data.theContent = jsyaml.load(editor.getValue())
        var okInsert = Autof.insert({
            name: data.name,
            content: desanitizeObjectNameKeys(data.theContent),
            create_date: new Date(),
            update: new Date(),
            state: "active"
        })
        if (okInsert) {
            //console.info('Se ha guardado el formulario ' + data.name)
            showToUser({
                content: t('Saved form') + ' <b>' + data.name + '</b>',
                class: 'success',
                time: 1
            })
            editor_cambiado = false
            $('li#guardar i').addClass('hide').parent().removeClass('modificado')
            $("div#editor").removeClass("modificado")
            $('.doc[name]').parent().removeClass('active')
            $('.doc[name="' + data.name + '"]').parent().addClass('active')
            currentForm._id = okInsert
            currentForm.name = data.name
            currentForm.content = data.theContent
        }
    }
}

function lanzarRenderizado() {
    if (hacer) {
        clearTimeout(hacer)
        delete hacer
    }
    hacer = setTimeout(function() {
        if (editor_cambiado === true) {
            $("#ritem").html('')
            devForm.src = jsyaml.load(editor.getValue())
            $('#ritem').fadeOut(200).fadeIn(300)
            cargaForm(devForm)
        }
    }, 800)
}
editorCambiado = function editorCambiado() {
        if (initialYAML != editor.getValue() || initiallNameText != $('li#guardar #nombre').val()) {
            editor_cambiado = true
            $('li#guardar i').removeClass('hide').parent().addClass('modificado')
            $("div#editor").addClass("modificado")
        } else {
            editor.session.getUndoManager().reset()
            editor_cambiado = false
            $('li#guardar i').addClass('hide').parent().removeClass('modificado')
            $("div#editor").removeClass("modificado")
        }
        colorificaYaml()
    }
    //current Conntrolar el estad del editor, cambiado etc
carga = function carga(nombreForm) {
    // dbg('nombreForm', nombreForm)
    //1 Recuperamos la def del form
    var res = {}
    $.when((function(nombreForm) {
            var res = Autof.findOne({
                state: "active",
                name: nombreForm
            })
            localStorage.setItem('lastFormAdminChargeName', nombreForm)
            currentForm = res
            return res
        })(nombreForm))
        //2 Ponemos yaml en editor
        .then(function(res) {
            initialYAML = jsyaml.dump(sanitizeObjectNameKeys(res.content))
            editor.setValue(initialYAML)
            $('#ritem').html('')
            $("#nombre").val(nombreForm)
            $(".doc[name]").parent().removeClass('active')
            initiallNameText = $('li#guardar #nombre').val()
            editor.gotoLine(1)
            coloreaEtiquetas()
            colorificaYaml()
            $('li#guardar #nombre').on("input", editorCambiado)
            editorCambiado = false
                // editorCambiado()
            devForm = {
                mode: s('_formDesignMode'),
                div: 'ritem',
                name: nombreForm,
                doc: s('_formDesignDocId'),
                src: jsyaml.load(editor.getValue())
            }
            cargaForm(devForm)
            $('.doc[name="' + nombreForm + '"]').parent().addClass('active')
        })
        //3. Hacemos algo más
}
colorificaYaml = function colorificaYaml() {
    function tag2Color(cadenas, clase, ambito) {
        if ($.type(cadenas) != 'array') {
            cadenas = [cadenas]
        }
        if (!ambito) {
            ambito = $('div.ace_text-layer')
        }
        cadenas.forEach(function(item) {
            ambito.find('.ace_tag').filter(function() {
                return ($(this).text().trim() == item)
            }).addClass(clase)
        })
    }
    setTimeout(function() {
        coloreaEtiquetas()
        tag2Color(['fields', 'common', 'sources', 'options'], 'level1')
        tag2Color(['form', 'list', 'helpers', 'queries', 'css'], 'level0')
        tag2Color(['selectize', 'html', 'enum', 'datetimepicker'], 'collapsible')
        $('div.ace_text-layer .ace_tag:contains(fields)').addClass('level1')
        if (jsyaml.load(editor.getValue()).form) {
            _.each(jsyaml.load(editor.getValue()).form.fields, function(index, key) {
                $('div.ace_content .ace_line:contains("' + key + '")').each(function() {
                    if (_.startsWith($(this).text().trim(), key + ':')) {
                        $('.ace_tag', this).addClass('level2')
                    }
                    if (_.startsWith($(this).text().trim(), '_')) {
                        $('.ace_tag', this).addClass('fieldgroup')
                    }
                })
            })
        }
        if (jsyaml.load(editor.getValue()).list) {
            _.each(jsyaml.load(editor.getValue()).list.sources, function(index, key) {
                $('div.ace_content .ace_line:contains("' + key + '")').each(function() {
                    if (_.startsWith($(this).text().trim(), key + ':')) {
                        $('.ace_tag', this).addClass('level2')
                    }
                    _.each(jsyaml.load(editor.getValue()).list.sources[key].columns, function(index, key2) {
                        $('div.ace_content .ace_line:contains("' + key2 + '")').each(function() {
                            if (_.startsWith($(this).text().trim(), key2 + ':')) {
                                $('.ace_tag', this).addClass('level3')
                            }
                        })
                    })
                })
            })
        }
    }, 1)
}
Template.autoFormEdit.rendered = function() {
    editor = ace.edit('editor');
    editor.setOptions(aceOptions)
    editor.on('input', editorCambiado)
};
Template.autoFormEdit.helpers({
    formdefaults: function() {
        return {
            _formDesignDocId: s('_formDesignDocId'),
            _formDesignMode: s('_formDesignMode'),
            _theClass: s('_formDesignMode') == 'new' ? 'hide' : null
        }
    },
    items: function() {
        return Autof.find({
            state: "active"
        }, {
            content: {
                name: 0
            }
        })
    },
    cargarItemInicial: function() {
        //FIXME esto no deberia funcionar con setTimeout!!!
        Meteor.setTimeout(function() {
            carga(this.vname || localStorage.getItem('lastFormAdminChargeName'))
        }, 500)
    }
});
//fixme Parece que no funciona correctamente al hacer update (muestra los antiguos) Revisar!!!
Template.autoFormEdit.events({
        'change select#form-mode': function(event) {
            s('_formDesignMode', $('select#form-mode').val())
            devForm.mode = $('select#form-mode').val()
            lanzarRenderizado()
        },
        'change select#form-doc-id': function(event) {
            s('_formDesignDocId', $('select#form-doc-id').val())
            devForm.doc = $('select#form-doc-id').val()
            lanzarRenderizado()
        },
        'click #eliminar': function eliminarItem() {
            if (confirm("Delete the form \n[" + currentForm.name + "]?")) {
                if (currentForm._id) {
                    //Guardamos el actual a traves de log 
                    Meteor.call('setLog', 'delete_af', currentForm)
                        //Si ha insertado en el log
                    Autof.remove(currentForm._id)
                    showToUser({
                            content: t('Form') + ' ' + currentForm.name + ' ' + t('deleted from database'),
                            class: 'secondary',
                            time: 2
                        })
                        // console.info('Form ' + currentForm.name + ' deleted from database')
                }
                //editor.setValue('')
                // editor.session.getUndoManager().reset()
                // editor_cambiado = false
                // $('li#guardar i').addClass('hide')
                // $("div#editor").removeClass("modificado")
            }
        },
        'click #idiomas': function() {
            if ($('#translatablewords').length >= 1) {
                $('#translatablewords').toggle()
            } else {
                showTraductionsPanel()
            }
        },
        'click #guardar i': guardarFormDef,
        'input #editor': lanzarRenderizado,
        'click #crear': function crearDocumento(e) {
            if (editor_cambiado) {
                if (confirm("¿El item se ha modificado, pero no se ha guardado aún. \nSe perderán los cambios!! \n\n¿Continuar?") == false) return false;
            }
            currentForm = {}
            $("#ritem").html('')
            $("div#editor").removeClass("modificado")
            $("#nombre").removeAttr("itemid").val(makeId(8))
            defaultForm = jsyaml.dump({
                    "form": {
                        "collection": "persons",
                        "title": "Titulo formulario",
                        "modes": {
                            "new": null,
                            "edit": null,
                            "delete": null,
                            "readonly": null
                        },
                        "permisions": null,
                        "i18n": true,
                        "classes": "none",
                        "fields": {
                            "_bloque_1": null,
                            "field1": {
                                "title": "Un name"
                            },
                            "_bloque_2": {
                                "limit": 1
                            },
                            "field2": {
                                "type": "currency"
                            },
                            "field3": {
                                "enum": "a,b"
                            },
                            "_bloque_3": {
                                "limit": 5
                            },
                            "field4": {
                                "value": "$helper1$"
                            },
                            "field5": {
                                "enum": "queries.lista_personas"
                            }
                        },
                        "common": {
                            "all": {
                                "html": {
                                    "placeholder": "Im a field"
                                }
                            },
                            "control": {
                                "input": {
                                    "html": {
                                        "placeholder": "Im a input"
                                    }
                                }
                            },
                            "type": {
                                "currency": {
                                    "html": {
                                        "placeholder": "Im a currency"
                                    }
                                }
                            },
                            "block_content": {
                                "_bloque_1": {
                                    "html": {
                                        "placeholder": "Im in _bloque_1"
                                    }
                                }
                            },
                            "blocks": {
                                "style": "box-shadow: 0px 0px 5px  #777"
                            }
                        }
                    },
                    "helpers": {
                        "helper1": "eval(makeId(7))"
                    },
                    "queries": {
                        "lista_personas": {
                            "collection": "persons",
                            "filter": {
                                "nombre": {
                                    "$in": ["juan", "pedro"]
                                }
                            },
                            "format": {
                                "sort": {
                                    "apellidos": 1
                                },
                                "limit": 14
                            },
                            "value": "[nombre]",
                            "label": "[nombre] + ' ' + [apellidos]",
                            "optgroup": "[apellidos]"
                        }
                    }
                })
                // editor = ace.edit("editor")
                // editor.setOptions(aceOptions)
            editor.setValue(defaultForm)
            setTimeout(function() {
                editor.gotoLine(1)
                colorificaYaml()
                devForm.src = jsyaml.load(editor.getValue())
                devForm.mode = 'new'
                cargaForm(devForm)
            }, 10)
        },
        'click #items_existentes .doc[id]': function seleccionarDocumento(e) {
            if (editor_cambiado) {
                if (confirm("¿El item se ha modificado, pero no se ha guardado aún. \nSe perderán los cambios!! \n\n¿Continuar?") == false) {
                    return false;
                }
            }
            $('#ritem').html('')
            $.when(cargarIdes($(e.target).parent().attr('collection'))).then(s('_formDesignDocId', $('select#form-doc-id option:first').text())).done(carga($(e.target).attr('name')))
        },
        'keyup input#filtrar': function filtarLista(e) {
            tx = $(e.target).val()
            $("#items_existentes dd[name]").each(function() {
                if ($(this).text().toUpperCase().indexOf(tx.toUpperCase()) == -1) {
                    $(this).hide(100)
                } else {
                    $(this).show(100)
                }
            })
        },
        'click #ayudacampos': function mostrarAyudaColumnas() {
                helpColumns()
            }
            /*'change select#form-doc-id': function(ev) {
                $this = $(ev.target)
                showToUser({
                    content: $this.val(),
                    element: $this.parent(),
                    close: 'mouseleave',
                    class: 'secondary'
                })
            }*/
    })
    //Inserta la lista dec ampos disponibles en el editor, para ayuda y referencia
function helpColumns() {
        var src = jsyaml.load(editor.getValue())
        var col = []
        if (src.list) {
            col.push(src.list.sources.main.collection)
            try {
                $.each(src.list.sources, function(key) {
                    if (key != 'main') {
                        col.push(key)
                    }
                })
            } catch (err) {}
        }
        if (src.form) {
            col.push(src.form.collection)
        }
        var tx = ''
        col.forEach(function(val) {
            tx = tx + '\n\n#' + _.pad(val, 40, ' ') + ' | Tipo'
            tx = tx + '\n\#' + _.rpad('-', 40, '-') + ' | ' + _.rpad('-', 10, '-')
            try {
                $.each(cCols[val].findOne(), function(key, value) {
                    tx = tx + '\n\#' + _.rpad(key, 40, ' ') + ' | ' + $.type(value)
                })
            } catch (err) {}
        })
        var pos = editor.getCursorPosition()
        editor.setValue(editor.getValue() + tx)
        colorificaYaml()
        editor.moveCursorToPosition(pos)
        editor.clearSelection()
    }
    //todo Documentar el proceso de eliminar , update  y borrado lógico
    //todo Arreglar las ayudas para que vuelque la estructura de los campos complejos
    // fixme LOs enlaces a backend llevan a la version localhost:3000
    //Cargamos los ides de la collecion oportuna
cargarIdes = function cargarIdes(coleccion) {
    $.when(cCols[coleccion].find({}, {
        fields: {
            _id: true
        },
        sort: {
            autodate: -1
        }
    }).fetch()).done(function(res) {
        var $select = $('select#form-doc-id')
        $('option', $select).remove()
        res.forEach(function(value, key) {
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
            time: 1
        })
    })
}
