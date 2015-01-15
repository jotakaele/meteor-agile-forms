   // TODO Implementar mecanismo de selección de idioma, ¿Basado en preferencias de usuario?
   //Carga las traducciones desde  la base de datos
   translationsStrings = function translationsStrings(lang) {
       if (s('lang') != 'en') {
           var qF = JSON.parse(JSON.stringify({
               "_tr_": {
                   $exists: true
               }
           }).replace('_tr_', lang))
           cads = {}
           var c
           _.each(Translations.find(qF).fetch(), function(value) {
               cads[value._id] = value[lang]
           })
       }
   }
   translatableWords = []
       //Devuelve la cadena traducida*, teniendo en cuenta la capitalizacion
   t = function t(ocad) {
           if (s('lang') == 'en' || !s('lang') || !ocad) {
               return ocad
           }
           translatableWords.push(ocad)
           var lang = s('lang')
           var theTranslatedWord = ocad
           if (_.has(cads, ocad.toLowerCase())) {
               theTranslatedWord = cads[ocad.toLowerCase()]
           } else {
               theTranslatedWord = saveTraslationToDatabase(ocad.toLowerCase(), s('lang'))
                   //               unTranslatedWords.push(ocad.toLowerCase())
           }
           if (_.last(ocad).match(/[A-Z]/)) {
               theTranslatedWord = theTranslatedWord.toUpperCase()
           } else if (_.first(ocad).match(/[A-Z]/)) {
               theTranslatedWord = _.humanize(theTranslatedWord)
           }
           if (s('translating') == 'manual') {
               return theTranslatedWord
           }
           return theTranslatedWord
       }
       //Recupera una traduccion y la inserta en la base de datos local
   saveTraslationToDatabase = function saveTraslationToDatabase(thecad, lang) {
           if (s('translating') == 'auto') {
               lang = lang || 'es'
               var theTranslate = thecad
               $.ajax({
                   url: 'http://mymemory.translated.net/api/get?q=' + thecad + '&langpair=en|' + lang.split('-')[0] + '&de=juan.chamizo@gmail.com',
                   success: function(data) {
                       if (data.responseData.translatedText) {
                           //var nObj = {}
                           theTranslate = data.responseData.translatedText
                           console.info(thecad + '>>>>> ' + theTranslate)
                           var qId = {
                               _id: thecad.toLowerCase()
                           }
                           var qUpdate = JSON.parse(JSON.stringify({
                               '$set': {
                                   '_tr_': data.responseData.translatedText.toLowerCase(),
                                   datetime: new Date(),
                                   source: "mymemory.translated.net"
                               }
                           }).replace('_tr_', lang))
                           var qOptions = {
                               upsert: true
                           }
                           Translations.update(qId, qUpdate, qOptions)
                       } else {
                           console.info('No se ha obtenido texto')
                       }
                   }
               })
               return theTranslate
           } else {
               return thecad
           }
       }
       //Modifica (o añade) una cadena traducida y la inserta (o actualiza en la base de datos)
   translateText = function translateText(source, nTrans) {
           // var selText = theText.toLowerCase()
           // iCads = _.invert(cads)
           // selSource = iCads[selText]
           // if (!selSource) {
           //     alert('You can`t translate [' + selText + '] because isn`t in the i18n API!')
           //     return false
           // }
           // nTrans = prompt('Write the new traduction for \n ' + selSource + ' \t (en) \n ' + t(selSource) + '\t (' + s('lang') + ')')
           if (nTrans) {
               var qId = {
                   _id: source.toLowerCase()
               }
               var qUpdate = JSON.parse(JSON.stringify({
                   '$set': {
                       '_tr_': nTrans.toLowerCase(),
                       datetime: new Date(),
                       source: 'user'
                   }
               }).replace('_tr_', s('lang')))
               var qOptions = {
                   upsert: true
               }
               Translations.update(qId, qUpdate, qOptions)
               console.info('Cambiada la tradución para ' + source)
           }
       }
       //Muestra el panel de traducciones de la página activa.
   showTraductionsPanel = function showTraductionsPanel() {
       $('body').css('height', window.innerHeight * 2)
       var h = window.innerHeight / 2
       var $transDiv = $('<div>', {
           id: 'translatablewords',
           style: 'max-height: ' + window.innerHeight / 2 + 'px !important'
       }).html('<div class="title">' + t('Translations in this page') + '<i id="closeTrans" class="fa fa-times right"></i></div>').prependTo('body')
       $('#closeTrans').on('click', function() {
           $transDiv.hide(500)
           $('.currentTranslatedWord').removeClass('currentTranslatedWord')
       })
       _.each(_.uniq(translatableWords
           /*.sort()
            */
       ), function(c) {
           var $p = $('<p>').text(c + ' ').appendTo($transDiv)
           var $inp = $('<input>', {
               class: 'translatableword large-6 small-2 columns right',
               source: c,
           }).val(t(c)).appendTo($p)
           $inp.on('focus', function() {
               console.log('Entrando en ' + t(c))
               $('#translatablewords p').removeClass('active')
               $(this).parent().addClass('active')
               var palabra = t(c)
               $('.currentTranslatedWord').removeClass('currentTranslatedWord')
               $('.autof :contains(' + palabra + ')').last().addClass("currentTranslatedWord").show()
               if ($('.autof :contains(' + palabra + ')').last().offset()) {
                   var pos = $('.autof :contains(' + palabra + ')').last().offset().top - 12
               } else {
                   var pos = 0
               }
               $('html,body').animate({
                   scrollTop: pos
               }, 400);
               //$('.autof :contains("'+palabra)+'").last().position()
           })
           $inp.on('change', function() {
               translateText($(this).attr('source'), $(this).val())
               $(this).addClass('changed')
           })
       })
   }
   $(document).ready(function() {
           //Si estamos en modo traduccion manual, activamos el evento para traducir al hacer click sobre cadenas
           if (s('translating') == 'manual') {
               console.info('Activando traducción manual')
               $('label,option,span,div').on('click', function(ev) {
                   ev.preventDefault()
                   ev.stopPropagation()
                   var theText = $(this).text()
                   console.log(theText)
                   if (theText.length > 1) {
                       translateSelection(theText)
                   }
               })
           }
       })
       //Registro para usar en templates
   Template.registerHelper('tr', function(cadToTranslate) {
       return (t(cadToTranslate))
   });
