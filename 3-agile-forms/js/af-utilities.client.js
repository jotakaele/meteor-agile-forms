//Activamos los enlaces para que cargen formularios en el div indicado, a través de cargaForm
activateFormLinks = function activateFormLinks() {
        $('.form2div:not(.form2div-init)').each(function() {
            //Creamos un div para el contenido
            if ($(this).attr('div') == 'modal') {
                if ($('#modalDiv').length == 0) {
                    var $theModalDiv = $('<div>', {
                        id: 'modalDiv',
                        class: 'reveal-modal',
                        'data-reveal': ''
                    }).appendTo($('body'))
                }
            }
            $(this).addClass('form2div-init') //Indicamos que el enlace ya ha sido inicializado para excluirlo de las siguientes llamadas
            $(this).on('click', function() {
                switch ($(this).attr('div')) {
                    case 'in-place':
                        var destDivName = onl.createDivInPlace($(this), $(this).attr('in-place-class'))
                        break;
                    case 'modal':
                        var destDivName = 'modalDiv'
                        break;
                    default:
                        var destDivName = $(this).attr('div')
                        break;
                }
                var obj = {}
                obj.values = {}
                $link = $(this)
                if ($(this).attr('inject')) {
                    $(this).attr('inject').split(',').forEach(function(val) {
                        obj.values[val] = $link.attr(val)
                    })
                }
                obj.name = $link.attr('name')
                obj.mode = $link.attr('mode')
                obj.div = destDivName
                if ($link.attr('doc')) {
                    obj.doc = $link.attr('doc')
                }
                $('#' + obj.div).html('')
                cargaForm(obj)
                if ($(this).attr('div') == 'modal') {
                    $('#modalDiv').foundation('reveal', 'open')
                }
            })
        })
    }
    //current Documentar el uso de (y las propias funciones) @activateFormLinks y @onl.createDivInPlace
    //current Buscar de que modo podemos activar la funcion despues de renderizar @cualquier página y despues de añadir nuevos enlaces por reactividad
