//Inicializamos la tabla _defaults, con los valores que necesitamos al inicio
if (Defaults.find().count() === 0) {
    var objDef = {
        lang: 'en',
        translating: 'none' // auto|none|manual
    }
    dbg('Cargando tabla _defaults')
    _.each(objDef, function(value, key) {
        Defaults.insert({
            _id: key,
            value: value
        })
    })
}
