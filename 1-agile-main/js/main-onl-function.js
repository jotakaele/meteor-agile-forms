//Libreria de uso comun para usar en cualquier lado
onl = {
    u: function(string) {
        return string.toUpperCase()
    },
    link: function(opt) {
        var cad = ""
        $.each(opt, function(key, value) {
            if (key != 'texto') {
                cad = cad + ' ' + key + '="' + value + '"'
            }
        })
        return '<a ' + cad + '>' + opt.texto + '</a>'
    },
    arr2label: function(theArray) {
        var tx = ''
        theArray.forEach(function(txt, clase) {
            tx = tx + '<span class="label ' + clase + '">' + txt + '</span>'
        })
        return tx
    },
    textCollapse: function(texto, characters) {
        var theId = '_' + makeId(6)
        var char = characters || 20
        var action = 'onclick = "$(\'#' + theId + '\').toggle(200)"'
        tx = '<a class="showmore" showid="makeId" title="' + texto + '" ' + action + '>' + _(texto).prune(char) + '</a>'
        tx = tx + '<div id="' + theId + '" style="display:none;"' + action + '>' + texto + '</div>'
        return tx
    },
    randomSeedColor: function(cadena) {
        function seedColor(seed) {
            return (Math.ceil(Math.abs(Math.sin(seed == undefined ? seed = Math.random() : seed = seed)) * 16777215) % 16777215).toString(16);
        }
        var master = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzñÑ?¡<>="\'_';
        var res = ''
        cadena = cadena + ' '
        cadena.split('').forEach(function(car) {
                res = res + master.indexOf(car) || 0
            })
            // console.log(res)
        return '#' + seedColor(parseFloat(res))
    },
    //Crea un elemento div justo debajo de $el y si existe le asigna className
    createDivInPlace: function($el, className) {
        $('div.in-place').remove()
        var pos = $el.position()
        pos.top += $el.innerHeight()
        var divId = makeId(4)
            //console.log(pos)
        var $theFrameDiv = $('<div>', {
            class: 'in-place ' + className || '',
            style: 'top:' + pos.top + 'px;left:' + pos.left + 'px;min-width:' + $el.innerWidth() + 'px;'
        }).appendTo($el.closest('div'))
        $theClose = $('<i>', {
            class: 'close fa fa-close right'
        }).appendTo($theFrameDiv)
        $theClose.on('click', function() {
            $(this).closest('.in-place').fadeOut(200, function() {
                $theFrameDiv.remove()
            })
        })
        $theDiv = $('<div>', {
            id: divId
        }).appendTo($theFrameDiv)
        return divId;
    }
}
