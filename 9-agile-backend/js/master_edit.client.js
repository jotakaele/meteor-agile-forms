//Configuracion del modulo para que sirva para futuras implementaciones
var modConfig = {
    title: 'list', //El nombre del modulo
    dbConnection: Autol, //La conexion a mongo
    templateName: 'masterEdit', //El nombre de la plantilla
    renderFromEditor: function() {
        renderList(jsyaml.load(editor.getValue()), 'ritem')
            //El comando que se lanzará cuando queramos renderizar el list/etc depues d emodificarlo ene le editor
    },
    renderFromDatabase: function(src) {
        renderList(src, 'ritem') //El comando que se lanzará cuando queramos renderizar el list/etc directamente desde la configuración de la base d edatos
    },
    lastItemLocalStorageName: 'lastListAdminChargeName', //la plantilla de los nuevos elementos
    defaultItem: {
        list: {
            sources: {
                main: {
                    columns: {
                        nombre: null,
                        apellidos: null
                    },
                    collection: 'persons'
                }
            }
        }
    },
    aceOptions: {
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
}
var initialYAML = ''
var initiallNameText = ''
currentItem = {}
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
    //Esta funcíón guarda la configuración del item 
guardarItemDef = function guardarItemDef() {
    if (!editor_cambiado) {
        return false;
    }
    var data = {}
    data.name = $('input#nombre').val()
    data._id = currentItem._id
    if (confirm("Save the " + modConfig.title + " definition \n[" + data.name + "]?")) {
        if (data._id) {
            //Guardamos el actual a traves de log 
            Meteor.call('setLog', 'backup_' + modConfig.title, currentItem)
                //Si ha insertado en el log
            modConfig.dbConnection.remove(data._id)
        }
        data.theContent = jsyaml.load(editor.getValue())
        var okInsert = modConfig.dbConnection.insert({
            name: data.name,
            content: desanitizeObjectNameKeys(data.theContent),
            create_date: new Date(),
            update: new Date(),
            state: "active"
        })
        if (okInsert) {
            //console.info('Se ha guardado el formulario ' + data.name)
            showToUser({
                content: t('Saved  ' + modConfig.title) + ' <b>' + data.name + '</b>',
                class: 'success',
                time: 1
            })
            editor_cambiado = false
            $('li#guardar i').addClass('hide').parent().removeClass('modificado')
            $("div#editor").removeClass("modificado")
            $('.doc[name]').parent().removeClass('active')
            $('.doc[name="' + data.name + '"]').parent().addClass('active')
            currentItem._id = okInsert
            currentItem.name = data.name
            currentItem.content = data.theContent
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
                //editorJSON = 
            $('#ritem').fadeOut(200).fadeIn(300)
            modConfig.renderFromEditor()
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
itemCharge = function itemCharge(itemName) {
    //1 Recuperamos la def del item
    var res = {}
    dbg(itemName)
    $.when((function(itemName) {
            var res = modConfig.dbConnection.findOne({
                name: itemName
            })
            localStorage.setItem(modConfig.lastItemLocalStorageName, itemName)
            currentItem = res
                // dbg('res', res)
            return res
        })(itemName))
        //2 Ponemos yaml en editor
        .then(function(res) {
            dbg('res', res)
            initialYAML = jsyaml.dump(sanitizeObjectNameKeys(res.content))
            editor.setValue(initialYAML)
            $('#ritem').html('')
            $("#nombre").val(itemName)
            $(".doc[name]").parent().removeClass('active')
            initiallNameText = $('li#guardar #nombre').val()
            editor.gotoLine(1)
            coloreaEtiquetas()
            colorificaYaml()
            $('li#guardar #nombre').on("input", editorCambiado)
            editorCambiado = false
            modConfig.renderFromDatabase(res.content)
            $('.doc[name="' + itemName + '"]').parent().addClass('active')
        })
        //3. Hacemos algo más
}
Template[modConfig.templateName].rendered = function() {
    editor = ace.edit('editor');
    editor.setOptions(modConfig.aceOptions)
    editor.on('input', editorCambiado)
};
Template[modConfig.templateName].helpers({
    items: function() {
        return modConfig.dbConnection.find({}, {
            content: {
                name: 0
            }
        })
    },
    cargarItemInicial: function() {
        //FIXME esto no deberia funcionar con setTimeout!!!
        Meteor.setTimeout(function() {
            itemCharge(this.vname || localStorage.getItem(modConfig.lastItemLocalStorageName))
        }, 500)
    }
});
//fixme Parece que no funciona correctamente al hacer update (muestra los antiguos) Revisar!!!
Template[modConfig.templateName].events({
        'click #eliminar': function eliminarItem() {
            if (confirm("Delete the " + modConfig.title + " \n[" + currentItem.name + "]?")) {
                if (currentItem._id) {
                    //Guardamos el actual a traves de log 
                    Meteor.call('setLog', 'delete_af', currentItem)
                        //Si ha insertado en el log
                    modConfig.dbConnection.remove(currentItem._id)
                    showToUser({
                        content: t('Form') + ' ' + currentItem.name + ' ' + t('deleted from database'),
                        class: 'secondary',
                        time: 2
                    })
                }
            }
        },
        'click #idiomas': function() {
            if ($('#translatablewords').length >= 1) {
                $('#translatablewords').toggle()
            } else {
                showTraductionsPanel()
            }
        },
        'click #guardar i': guardarItemDef,
        'input #editor': lanzarRenderizado,
        'click #crear': function crearDocumento(e) {
            if (editor_cambiado) {
                if (confirm("¿El item se ha modificado, pero no se ha guardado aún. \nSe perderán los cambios!! \n\n¿Continuar?") == false) return false;
            }
            currentItem = {}
            $("#ritem").html('')
            $("div#editor").removeClass("modificado")
            $("#nombre").removeAttr("itemid").val(makeId(8))
            editor.setValue(jsyaml.dump(modConfig.defaultItem))
            modConfig.renderFromEditor()
        },
        'click #items_existentes .doc[id]': function seleccionarDocumento(e) {
            if (editor_cambiado) {
                if (confirm("¿El item se ha modificado, pero no se ha guardado aún. \nSe perderán los cambios!! \n\n¿Continuar?") == false) {
                    return false;
                }
            }
            $('#ritem').html('')
            itemCharge($(e.target).attr('name'))
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
    //Ponemos formato a los elementos del editos
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
