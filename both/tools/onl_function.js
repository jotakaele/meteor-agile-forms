//Libreria de uso comun para usar en cualquier lado
onl = {}
onl.u = function(string) {
    return string.toUpperCase()
}
onl.link = function(opt) {
    var cad = ""
    $.each(opt, function(key, value) {
        if (key != 'texto') {
            cad = cad + ' ' + key + '="' + value + '"'
        }
    })
    return '<a ' + cad + '>' + opt.texto + '</a>'
}
onl.arr2label = function(theArray) {
    var tx = ''
    theArray.forEach(function(txt, clase) {
        tx = tx + '<span class="label ' + clase + '">' + txt + '</span>'
    })
    return tx
}
onl.textCollapse = function(texto, characters) {
        var theId = '_' + makeId(6)
        var char = characters || 20
        var action = 'onclick = "$(\'#' + theId + '\').toggle(200)"'
        tx = '<a class="showmore" showid="makeId" title="' + texto + '" ' + action + '>' + _(texto).prune(char) + '</a>'
        tx = tx + '<div id="' + theId + '" style="display:none;"' + action + '>' + texto + '</div>'
        return tx
    }
    /*Renderiza un elemento en funcion de su tipo (form, list) */
    /*renderType = function renderType(objectSource, divDestName) {
        if (objectSource.form) {
            nx = objectSource
            autof = new AUTOF(divDestName, {
                def: sanitizeObjectNameKeys(objectSource)
            })
        }

        if (objectSource.list) {
            nx = objectSource
            autol = new AUTOL(divDestName, {
                def: sanitizeObjectNameKeys(objectSource)
            })
        }
    }
    */
