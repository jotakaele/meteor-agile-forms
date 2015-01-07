#Notas generales de Agile

##Collection _defaults
Almacena las variables de session que son **persistentes** en la base de datos.
+ **lang** Default `en` Codigo de idioma activo
+ **translating** none*|auto|manual Modo de traduccion activa
    * none: no hace nada
    * auto: descraga las traducciones de la apia activa (inicialmente mymemory)
    * manual: activa el panel de traducción manual
+ **dbg** true*|false Activa o desactiva la salida de la funcion `dbg` en client y server
+ **log** true*|false Activa o desactiva el guardado de logs en la base de datos (collection `_logs`)
+ **log_expire** Determina la duración (formateada según moment.js) del log para cada uno de sus elementos
```json
        log_expire: { // Determina el tiempo de expiracion de los registros de log 
                    insert_record: {
                        year: 1
                    },
                    delete_record: {
                        year: 1
                    },
                    update_record: {
                        year: 1
                    }
                }
```
 

Las variables se manejan mediante la función `s`
```javascript
    s('lang') //Devuelve el contenido de la variable lang

    s('lang', 'es-ES') //establece el contenido de la variable 'lang' a 'es-ES' y la almacena en `_defaults`

    s('lang', 'es-ES', false) //establece el contenido de la variable 'lang' a 'es-ES' y NO la almacena en `_defaults`

```

##Collection logs





