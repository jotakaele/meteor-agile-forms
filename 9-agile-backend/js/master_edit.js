//both
//...............................................................................................
//Configuracion del modulo para que sirva para futuras implementaciones..........................
var theModName = 'html'
var theModCollection = '_' + theModName
var editorMode = 'html'
    //...............................................................................................
    //...............................................................................................
    //...............................................................................................
modConfig = {
    dbConnection: new Meteor.Collection(theModCollection, {}), //La conexion a mongo    //collectionName: this.dbConnection._name,
    templateName: 'masterEdit', //El nombre de la plantilla
    renderFromEditor: function() {
        //   renderList(jsyaml.load(editor.getValue()), 'ritem')
        //   El comando que se lanzará cuando queramos renderizar el list/etc depues d emodificarlo ene le editor
    },
    renderFromDatabase: function(src) {
        //renderList(src, 'ritem') //El comando que se lanzará cuando queramos renderizar el list/etc directamente desde la configuración de la base de datos
    },
    //Transformaciones que hacemos al valor recuperado del editor antes de guardarlo en la base de datos.
    editorToSave: function() {
        return editor.getValue()
            // Si estamos recuperando JSON y vamos a trabajar en YAML ....
            //return jsyaml.load(editor.getValue())
    },
    //Transformaciones que hacemos al valor recuperado de la base de datos antes de volcarlo en el editor
    savedToEditor: function(src) {
        editor.setValue(sanitizeObjectNameKeys(src) || null)
            //Si estamos almacenando JSON...
            //editor.setValue = jsyaml.dump(sanitizeObjectNameKeys(src))
    },
    lastItemLocalStorageName: 'last_' + theModName + '_ChargeName', //la plantilla de los nuevos elementos
    cargarItemInicial: false, //
    defaultItem: "body {color: green;}",
    aceOptions: {
        maxLines: Infinity,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        // showInvisibles: true,
        highlightGutterLine: true,
        theme: "ace/theme/textmate",
        highlightActiveLine: true,
        mode: "ace/mode/" + editorMode,
        wrap: true,
        tabSize: 2
    }
}
Router.map(function() {
        this.route('masterEdit', {
            path: '/backend/' + theModName + '/:itemname?',
            data: function() {
                vname = this.params.itemname || localStorage.getItem(modConfig.lastItemLocalStorageName)
                datos = {
                    name: vname
                }
                return datos || null
            },
            controller: 'BaseController'
        });
    })
    //Server
if (Meteor.isServer) {
    //Publicamos autof, de mood que esta disponible para todos
    Meteor.publish(modConfig.dbConnection._name, function() {
        return modConfig.dbConnection.find()
    })
}
//Client
if (Meteor.isClient) {
    Meteor.subscribe(theModCollection)
    var initialEditorValue = ''
    var initiallNameText = ''
    var currentItem = {}
    var editor_cambiado = false
    var coloreaEtiquetas = function() {
        $('dd[collection]').each(function() {
            var color = onl.randomSeedColor($(this).attr('collection'))
            $(this).css('border-bottom', '3px solid #' + color)
        })
    }
    var hacer = ''
    initialEditorValue = {}
    initiallNameText = ''
        //Esta funcíón guarda la configuración del item 
    var guardarItemDef = function guardarItemDef() {
        if (!editor_cambiado) {
            return false;
        }
        var data = {}
        data.name = $('input#nombre').val()
        data._id = currentItem._id
        if (confirm("Save the " + theModName + " definition \n[" + data.name + "]?")) {
            if (data._id) {
                //Guardamos el actual a traves de log 
                Meteor.call('setLog', 'backup_' + theModName, currentItem)
                    //Si ha insertado en el log
                modConfig.dbConnection.remove(data._id)
            }
            data.theContent = modConfig.editorToSave()
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
                    content: t('Saved  ' + theModName) + ' <b>' + data.name + '</b>',
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
    var editorCambiado = function editorCambiado() {
        if (initialEditorValue != editor.getValue() || initiallNameText != $('li#guardar #nombre').val()) {
            editor_cambiado = true
            $('li#guardar i').removeClass('hide').parent().addClass('modificado')
            $("div#editor").addClass("modificado")
        } else {
            editor.session.getUndoManager().reset()
            editor_cambiado = false
            $('li#guardar i').addClass('hide').parent().removeClass('modificado')
            $("div#editor").removeClass("modificado")
        }
    }
    var itemCharge = function itemCharge(itemName) {
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
                initialEditorValue = res.content
                modConfig.savedToEditor(initialEditorValue)
                $('#ritem').html('')
                $("#nombre").val(itemName)
                $(".doc[name]").parent().removeClass('active')
                initiallNameText = $('li#guardar #nombre').val()
                editor.gotoLine(1)
                coloreaEtiquetas()
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
        title: theModName.toUpperCase(),
        format: editorMode,
        items: function() {
            return modConfig.dbConnection.find({}, {
                content: {
                    name: 0
                }
            })
        },
        cargarItemInicial: function() {
            //FIXME esto no deberia funcionar con setTimeout!!!
            if (modConfig.cargarItemInicial) {
                Meteor.setTimeout(function() {
                    itemCharge(this.vname || localStorage.getItem(modConfig.lastItemLocalStorageName))
                }, 500)
            }
        }
    });
    //fixme Parece que no funciona correctamente al hacer update (muestra los antiguos) Revisar!!!
    Template[modConfig.templateName].events({
        'click #eliminar': function eliminarItem() {
            if (confirm("Delete the " + theModName + " \n[" + currentItem.name + "]?")) {
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
            editor.setValue('')
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
        }
    })
}
