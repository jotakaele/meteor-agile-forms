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
        html: {
            collection: "_html",
            ace: "html",
            transform: function (options) {
                return options.src;
            },
            renderInMasterBackend: function () {
                //this.render(oVars.editorToSave(), 'ritem')
                cargarSnippet({
                    type: 'html',
                    src: oVars.editorToSave(),
                    div: 'ritem',
                    render: true
                })
            }
        },
        jade: {
            collection: "_jade",
            ace: "jade",
            // transform: function (options) {
            //     return jadeProcess(options.src);
            // },
            transform: function (options) {
                Meteor.call('jadeRender', options.src, function (err, res) {
                    if (err) {
                        showToUser({
                            content: 'Jade render error',
                            element: $('#' + options.div).parent(),
                            time: 1
                        })
                    }
                    if (res) {
                        $('#' + options.div).html(res)
                    }
                });
            },
            renderInMasterBackend: function () {
                //this.render(oVars.editorToSave(), 'ritem')
                cargarSnippet({
                    type: 'jade',
                    src: oVars.editorToSave(),
                    div: 'ritem',
                    render: true
                })
            }
        },
        markdown: {
            collection: "_markdown",
            ace: "markdown",
            transform: function (options) {
                return marked(options.src)
            },
            renderInMasterBackend: function () {
                //this.render(oVars.editorToSave(), 'ritem')
                cargarSnippet({
                    type: 'markdown',
                    src: oVars.editorToSave(),
                    div: 'ritem',
                    render: true
                })
            }
        },
        css: {
            collection: "_css",
            ace: "css",
            transform: function (options) {
                var transformValue = options.render ? '<pre>' + options.src + '</pre>' : options.src;
                return transformValue;
            },
            renderInMasterBackend: function () {
                //this.render(oVars.editorToSave(), 'ritem')
                cargarSnippet({
                    type: 'css',
                    src: oVars.editorToSave(),
                    div: 'ritem',
                    render: true
                })
            }
        },
        text: {
            collection: "_text",
            ace: "text",
            transform: function (options) {
                return options.src;
            },
            renderInMasterBackend: function () {}
        },
        config: {
            collection: "_config",
            ace: "yaml",
            transform: function (options) {
                var transformValue = options.render ? EJSON.stringify(options.src) : options.src;
                return transformValue;
            },
            renderInMasterBackend: function () {}
        },
        form: {
            collection: "_af",
            ace: "yaml",
            transform: function (options) {
                cargaForm(options)
            },
            renderInMasterBackend: function () {
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
                    cargarSnippet(oRenderOptions)
                } else {
                    $('#ritem').html('<div class="alert-box alert">Form config error.</div>')
                }
            }
        },
        list: {
            collection: "_al",
            ace: "yaml",
            transform: function (options) {
                dbg('options', options)
                cargaList(options.name, options.div)
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
    //Devuelve el contenido de un snippet definido en oOptions  o bien lo renderiza en oOptions.div (si existe y render= true)
    // cargarSnippet({
    //     src: null,
    //     type: 'html',
    //     name: 'unHtml',
    //     div: 'ritem'
    //     render: true || false (Si vuelca el contenido transformado en .div)
    // })
if (Meteor.isClient) {
    cargarSnippet = function (oOptions) {
            //Si no hay src , lo extraemos de la base de datos, (Solo si es distinto de list o form, en cuyo caso se encarga renderForm o cargaList de consultar la base de datos)
            //
            if (['list', 'form'].indexOf(oOptions.type) == -1) {
                oOptions.render = true
                if (!oOptions.src) {
                    oOptions.src = masterConnection[oOptions.type].findOne({
                        name: oOptions.name
                    }).content
                }
            }
            //Si es uno de los elemento que necesariamente han de renderizarse en eun div y no se ha pasado, devolvemos un error
            if (!oOptions.div && ['list', 'form', 'jade'].indexOf(oOptions.type) >= 0) {
                throw Meteor.Error(oOptions.type + " require a div name to run.");
                return false
            }
            //dbg("oOptions.src", oOptions.src)
            var value = snippets[oOptions.type].transform(oOptions)
            if (oOptions.render && oOptions.div) {
                $('#' + oOptions.div).html(substSnippets(value))
                return true
            } else {
                return substSnippets(value)
            }
        }
        //TODO Organizar los metodos de snippet, de modo que la funcion cargaSnippet nos devuelva el contenido renderizado en cada caso ...
        /*
        Notas: la función render de snippets, debe ser llamada siempre con un unico objeto que contenga la configuración con que se le llama e internamente la funcion llamar al renderizador de cada tipo usando los elementos que necesite.

         */
        /**
         * Procesa cualquier cadena para substoituir los snippets por su contenido Se procesan los snippets con el siguiente formato: $snippet|html|unHtml$ o $snippet|markdown|algo$
         * Solo podemos incluir snippets que no sean ni list, ni form, ni jade sin embargo las sustitucion podemos hacerla en cualquier tipo de cadenas
         *
         * @param  {string} cadena [La cadena donde sustituir]
         * @return {string}        [LA cadena ya sustituida]
         */
    substSnippets = function substSnippets(cadena) {
        var expresion = /--snippet.*--/g
        var matches = cadena.match(expresion) || []
            //console.log(matches)
        matches.forEach(function (match) {
            //current ver como hacemos las substituciones para que no interfira con las sustituciones de helpers de los formularios
            var snippet = match.replace(/--/g, '').split('|')
            var conf = {
                    type: snippet[1],
                    name: snippet[2]
                }
                // console.log(conf)
            var res = cargarSnippet(conf)
            cadena = cadena.replace(match, res);
        })
        return cadena
    }
    Template.snippet.rendered = function () {
            var config = this.data
            config.render = true
            config.div = config.div || "snippetdest"
            dbg("config", o2S(config))
            Meteor.setTimeout(function () {
                cargaSnippet(config)
            }, 1500)
        }
        // Template.snippet.helpers({
        //         content: function () {
        //             dbg('this', this)
        //             var config = this
        //             return cargaSnippet(config)
        //         )
        //     }
        // });
        // current HAcer un helper que funcione y renderize el snippet llamado en cada caso. Probar en /test
}
