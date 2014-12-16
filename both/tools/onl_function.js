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
onl.randomSeedColor = function randomSeedColor(cadena) {
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
    return seedColor(parseFloat(res))
}
