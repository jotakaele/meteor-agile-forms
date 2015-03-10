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
 * @type {Object}
 */
snippets = {
        html: {
            collection: "_html",
            ace: "html",
            transform: function (options) {
                return options.src;
            }
        },
        jade: {
            collection: "_jade",
            ace: "jade",
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
                        res = substSnippets(res)
                        $('#' + options.div).html(res)
                        return true
                    }
                });
            }
        },
        markdown: {
            collection: "_markdown",
            ace: "markdown",
            transform: function (options) {
                return marked(options.src)
            }
        },
        css: {
            collection: "_css",
            ace: "css",
            transform: function (options) {
                var transformValue = options.render ? '<pre>' + options.src + '</pre>' : options.src;
                return transformValue;
            }
        },
        text: {
            collection: "_text",
            ace: "text",
            transform: function (options) {
                return options.src;
            }
        },
        config: {
            collection: "_config",
            ace: "yaml",
            transform: function (options) {
                var transformValue = options.render ? EJSON.stringify(options.src) : options.src;
                return transformValue;
            }
        },
        form: {
            collection: "_af",
            ace: "yaml",
            transform: function (options) {
                return cargaForm(options)
            }
        },
        list: {
            collection: "_al",
            ace: "yaml",
            transform: function (options) {
                return renderList(options)
            }
        }
    }
    //Devuelve el contenido de un snippet definido en oOptions  o bien lo renderiza en oOptions.div (si existe y render= true)
    // doSnippet({
    //     src: null,
    //     type: 'html',
    //     name: 'unHtml',
    //     div: 'ritem'
    //     render: true || false (Si vuelca el contenido transformado en .div)
    // })
if (Meteor.isClient) {
    //
    doSnippet = function (oOptions) {
            //Si es uno de los elemento que necesariamente han de renderizarse en un div y no se ha pasado, devolvemos un error
            function returnError() {
                return ('<span class="error">Error,  --snippet|' + oOptions.type + ' | ' + oOptions.name + '-- not found</span>')
            }
            if (!snippets[oOptions.type]) {
                return returnError()
            }
            if (!oOptions.div && ['form', 'jade'].indexOf(oOptions.type) >= 0) {
                throw Meteor.Error(oOptions.type + " require a div name to run.");
                return false
            }
            if (!oOptions.src) {
                var r = masterConnection[oOptions.type].findOne({
                    name: oOptions.name
                }) || undefined
                if (r) {
                    oOptions.src = sanitizeObjectNameKeys(r.content)
                }
            }
            if (!oOptions.src) {
                return returnError()
            }
            //Stringifica transformando los valores
            function replacer(key, value) {
                    if (typeof value === "string") {
                        return substSnippets(value);
                    }
                    return value;
                }
                //oOptions.src = substSnippets(oOptions.src)
            if (typeof oOptions.src == 'object') {
                src = oOptions.src
                src = JSON.stringify(src, replacer)
                oOptions.src = JSON.parse(src)
                    // return null
                    // 
            } else {
                oOptions.src = substSnippets(oOptions.src)
            }
            var value = snippets[oOptions.type].transform(oOptions)
            if (oOptions.render && oOptions.div) {
                $('#' + oOptions.div).html(value)
                return true
            } else {
                return value
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
    substSnippets = function (cadena) {
        var expresion = /--snippet.*--/g
        var matches = cadena.match(expresion) || []
            // console.log(matches)
            // console.log('bucle')
        if (matches.length == 0) {
            return cadena
        }
        matches.forEach(function (match) {
            //current ver como hacemos las substituciones para que no interfira con las sustituciones de helpers de los formularios
            var snippet = match.replace(/--/g, '').split('|')
            var conf = {
                    type: snippet[1],
                    name: snippet[2]
                }
                // console.log(conf)
            var res = doSnippet(conf)
            if (cadena) {
                cadena = cadena.replace(match, res);
            }
        })
        return cadena
    }
    Template.snippet.rendered = function () {
            var config = this.data
            config.render = true
            config.div = config.div || "snippetdest"
            doSnippet(config)
        }
        // Template.snippet.helpers({
        //         content: function () {
        //             var config = this
        //             return cargaSnippet(config)
        //         )
        //     }
        // });
        // current HAcer un helper que funcione y renderize el snippet llamado en cada caso. Probar en /test
}

