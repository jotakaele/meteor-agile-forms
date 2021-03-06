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
var myFold = {}
editor_cambiado = false
carga = function carga(options) {
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
        $('#ritem').html('')
        $("#nombre").val(res.name)
        $("#nombre").attr("itemid", res._id)
        $("#nombre").attr("theType", contentType(res.content))
        $(".doc[name]").removeClass('active')
        $('.doc#' + res._id).addClass('active')
        editor_cambiado = false
        editor = ace.edit('editor');
        editor.setOptions(aceOptions)
        editor.setValue(jsyaml.dump(sanitizeObjectNameKeys(res.content)))
        colorificaYaml()
        editor.gotoLine(1)
        renderType(res.content, 'ritem')
    })
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
        tag2Color(['fields', 'common', 'sources', 'options'], 'level1')
        tag2Color(['form', 'list', 'helpers', 'queries'], 'level0')
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
Template.autoEdit.helpers({
    items: function() {
        return Autof.find({
            state: "active"
        }, {
            content: {
                name: 0
            }
        })
    },
    initialItem: function() {
        carga(this.name)
    }
});
//fixme Parece que no funciona correctamente al hacer update (muestra los antiguos) Revisar!!!
Template.autoEdit.events({
        'click #eliminar': function eliminarItem() {
            if (confirm("¿Eliminar este item? \n[" + $("#nombre").val() + "]")) {
                var okDelete = Autof.update({
                    _id: $("#nombre").attr('itemid')
                }, {
                    $set: {
                        state: 'deleted',
                        update_date: new Date()
                    }
                })
            }
        },
        'click #guardar': function guardarItem() {
            if (confirm("¿Guardar la definición del item \n[" + $("#nombre").val() + "]")) {
                if ($("#nombre").attr('itemid')) {
                    var okUpdate = Autof.update({
                        _id: $("#nombre").attr('itemid')
                    }, {
                        $set: {
                            name: $("#nombre").val(),
                            state: 'autobackup',
                            update_date: new Date(),
                        }
                    })
                }
                var theContent = jsyaml.load(editor.getValue())
                if (theContent.form) {
                    theType = "form"
                }
                if (theContent.list) {
                    theType = "list"
                        //   theContent.list.source.filter = JSON.stringify(theContent.list.source.filter)
                }
                var okInsert = Autof.insert({
                    name: $("#nombre").val(),
                    content: desanitizeObjectNameKeys(theContent),
                    create_date: new Date(),
                    update: new Date(),
                    state: "active",
                    type: theType
                })
                dbg('okInsert', okInsert)
                if (okInsert) {
                    editor_cambiado = false
                    $("div#editor").removeClass("modificado")
                }
            }
        },
        'keypress #editor,keydown #editor': function alModificarEditor() {
            editor_cambiado = true
            $("div#editor").addClass("modificado")
            colorificaYaml()
        },
        'mouseleave #editor, dblclick #editor': function alSacarElMouseDelEditor() {
            if (editor_cambiado === true) {
                $("#ritem").html('')
                tx = jsyaml.load(editor.getValue())
                $('#ritem').fadeOut(200).fadeIn(300)
                renderType(tx, 'ritem')
            }
        },
        'click #crear': function crearDocumento(e) {
            if (editor_cambiado) {
                if (confirm("¿El item se ha modificado, pero no se ha guardado aún. \nSe perderán los cambios!! \n\n¿Continuar?") == false) return false;
            }
            $("#ritem").html('')
            $("div#editor").removeClass("modificado")
            $("#nombre").removeAttr("itemid").val("Nuevo item")
            defaultForm = jsyaml.dump({
                "form": {
                    "collection": "nombre_coleccion",
                    "name": "Titulo formulario",
                    "modes": "add,update,delete",
                    "permisions": null,
                    "classes": "none",
                    "fields": {
                        "_bloque_1": {
                            "class": "none"
                        },
                        "nombre": {
                            "maxlength": 13,
                            "title": "Mi nombre"
                        }
                    }
                },
                "list": {
                    "definition": "Aqui la definicion de la lista"
                }
            })
            editor = ace.edit("editor")
            editor.setOptions(aceOptions)
            editor.setValue(defaultForm)
            setTimeout(function() {
                editor.gotoLine(1)
                colorificaYaml()
                renderType({
                    def: jsyaml.load(defaultForm)
                }, 'ritem')
            }, 10)
        },
        'click #items_existentes li.button.filter': function filtarPorTipo(e) {
            $("li.button.filter").removeClass('active')
            $(e.target).addClass('active')
            if ($(e.target).attr("type") == "all") {
                $('li[name][type]').show()
            } else {
                $('li[name][type=' + $(e.target).attr("type") + ']').show()
                $('li[name]:not([type=' + $(e.target).attr("type") + '])').hide()
            }
        },
        'click .button.filter, click  #items_existentes a[id],keyup input#filtrar': function() {
            //fixme apñara esto para que los no se pueda cambiar ni filtrar si se ha modificado el editos
        },
        'click #items_existentes .doc[id]': function seleccionarDocumento(e) {
            if (editor_cambiado) {
                if (confirm("¿El item se ha modificado, pero no se ha guardado aún. \nSe perderán los cambios!! \n\n¿Continuar?") == false) {
                    return false;
                }
            }
            //dbg('intentando cargar', $(e.target).attr('name'))
            $('.doc').removeClass('active')
            $(e.target).addClass('active')
            carga({
                name: $(e.target).attr('name'),
                _id: $(e.target).attr('id')
            })
        },
        'keyup input#filtrar': function filtarLista(e) {
            tx = $(e.target).val()
            var theType = $(".button.filter.active").attr("type")
            workOn = theType == "all" ? $("#items_existentes li[name]") : ("#items_existentes li[name][type=" + theType + "]")
            dbg('workOn', workOn)
            $(workOn).each(function() {
                if ($(this).text().toUpperCase().indexOf(tx.toUpperCase()) == -1) {
                    $(this).hide(100)
                } else {
                    $(this).show(100)
                }
            })
        },
        'click #ayudacampos': function mostrarAyudaColumnas() {
            helpColumns()
        },
        'dblclick div.ace_content': function plegarSeccion() {
            var line = editor.getCursorPosition().row + 1
            if (myFold[editor.getSelectedText()] == true) {
                myFold[editor.getSelectedText()] = false
                editor.getSession().unfold(line)
            } else {
                myFold[editor.getSelectedText()] = true
                editor.getSession().foldAll(line - 1)
            }
            colorificaYaml()
        }
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
