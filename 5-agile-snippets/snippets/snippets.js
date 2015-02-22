//Lista de categorias a gestionar
//
//
//
//
//
/**
 * Contiene la conmfiguración de los diferentes snippets, cada clave contiene:
 * collection: La collección mongo donde se guardan los snippets
 * ace; El resaltado de sintextis de ACE que usa cada tipo
 * render: la función maestra que renderiza cada snippet,
 * renderInMasterBackend: el modo en que llamamamos a snippets.clave.render en el editor backend.
 * @type {Object}
 */
snippets = {
    test: {
        collection: "_test",
        ace: "test",
        /**
         * [transform  Hace las transformaciones requeridas en cada tipo de elemento]
         * @param  {[string]} src [origen del snippet, generalmente recuperado de la base de datos]
         * @return {[string]}     [HTML(o texto) devuelto, listo para enviar al navegador]
         */
        transform: function (src) {
            return src;
        },
        render: function (sContent, sDivName) {
            $('#' + sDivName).html(sContent)
        },
        renderInMasterBackend: function () {
            this.render(oVars.editorToSave(), 'ritem')
        }
    },
    html: {
        collection: "_html",
        ace: "html",
        transform: function (src) {
            return src;
        },
        render: function (sContent, sDivName) {
            $('#' + sDivName).html(sContent)
        },
        renderInMasterBackend: function () {
            this.render(oVars.editorToSave(), 'ritem')
        }
    },
    template: {
        collection: "_template",
        ace: "jade",
        transform: function (src) {
            return jadeRender(src);
        },
        render: function (sContent, sDivName) {
            Meteor.call('jadeRender', sContent, function (err, res) {
                if (err) {
                    showToUser({
                        content: 'Jade render error',
                        element: $('#' + sDivName).parent(),
                        time: 1
                    })
                }
                if (res) {
                    $('#' + sDivName).html(res)
                }
            });
        },
        renderInMasterBackend: function () {
            this.render(oVars.editorToSave(), 'ritem')
        }
    },
    markdown: {
        collection: "_markdown",
        ace: "markdown",
        transform: function (src) {
            return src;
        },
        render: function (sContent, sDivName) {
            $('#' + sDivName).html(marked(sContent))
        },
        renderInMasterBackend: function () {
            this.render(oVars.editorToSave(), 'ritem')
        }
    },
    css: {
        collection: "_css",
        ace: "css",
        render: function (sContent, sDivName) {
            $('<pre>').appendTo($('#' + sDivName)).html(sContent)
        },
        transform: function (src) {
            return src;
        },
        renderInMasterBackend: function () {
            this.render(oVars.editorToSave(), 'ritem')
        }
    },
    text: {
        collection: "_text",
        ace: "text",
        transform: function (src) {
            return src;
        },
        renderInMasterBackend: function () {}
    },
    config: {
        collection: "_config",
        ace: "yaml",
        transform: function (src) {
            return src;
        },
        renderInMasterBackend: function () {}
    },
    form: {
        collection: "_af",
        ace: "yaml",
        render: function (sContent, sDivName) {
            cargaForm(sDivName, sContent)
        },
        renderInMasterBackend: function () {
            $('#option-form').removeClass('hide')
            var contentFiltered = oVars.editorToSave()
            if (contentFiltered) {
                var oRenderOptions = {
                    src: contentFiltered,
                    div: 'ritem',
                    name: $('input#name').val(),
                    mode: $('select#form-mode').val() || s('master_edit_form_mode'),
                    doc: $('select#form-doc-id').val() || s('last-' + $('input#name').val() + '-backend-edit-id'),
                    values: s('last-' + $('input#name').val() + '-backend-edit-values') || {}
                }
                _(oRenderOptions).extend(jsyaml.load(editor.getValue()).test)
                    // 
                cargaForm(oRenderOptions)
            } else {
                $('#ritem').html('<div class="alert-box alert">Form config error.</div>')
            }
        }
    },
    list: {
        collection: "_al",
        ace: "yaml",
        render: function (sContent, sDivName) {
            cargaList(sDivName, sContent)
        },
        renderInMasterBackend: function () {
            var contentFiltered = oVars.editorToSave()
            if (contentFiltered) {
                renderList(contentFiltered, 'ritem')
            } else {
                $('#ritem').html('<div class="alert-box alert">List config error.</div>')
            }
        }
    }
}
if (Meteor.isServer) {
    Meteor.methods({
        /**
         * [getSnippet description]
         * @param  {string} type [Tipo de snippet [snippets[key]]]
         * @param  {string} name [Nombre del documento ]
         * @return {string}      [Devuelve el contenido del snippet, en brruto, sin renderizar]
         */
        getSnippet: function (type, name) {
            var src = masterConnection[type].findOne({
                name: name
            })
            return src
        }
    });
}
//Devuelve el contenido de un snippet definido en oOptions  o bien lo renderiza en oOptions.div (si existe)
// cargarSnippet({
//     src: null,
//     type: 'html',
//     name: 'unHtml',
//     div: 'ritem'
// })
if (Meteor.isClient) {
    cargarSnippet = function (oOptions) {
        //Si no hay src, lo extraemos de la base de datos
        if (!oOptions.src) {
            oOptions.src = masterConnection[oOptions.type].findOne({
                name: oOptions.name
            }).content
        }
        //Si es uno de los elemento que necesariamente han de renderizarse en eun div y no se ha pasado, devolvemos un error
        if (!oOptions.div && _.has(['list', 'form', 'template'], oOptions.type)) {
            return new Meteor.error(oOptions.type + " require a div name to run.");
        }
        dbg("oOptions.src", oOptions.src)
        if (oOptions.div) {
            snippets[oOptions.type].render(oOptions.src, oOptions.div)
            return true
        } else {
            return snippets[oOptions.type].render
        }
    }
}
//TODO Organizar los metodos de snippet, de modo que la funcion cargaSnippet nos devuelva el contenido renderizado en cada caso ...
/*
Notas: la función render de snippets, debe ser lalmada siempre con un unico objeto que contenga la configuración con que se le llama e internamente la funcion llamar al renderizador de cada tipo usando los elementos que necesite.

 */
