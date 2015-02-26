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





##Funcion showToUser()
Para mostrar mensajes al cliente en pantalla

```javascript

function showToUser(options) {
    var opt = {
        class: //Opcional. ['alert*','success','secondary','....']
        content: //Requerido. El html que se mostrará en el mensaje 
        element: //Opcional. Default: $('body') El $elemento jQuery en que se mostará el mensaje 
        time: //Opcional. El número de segundos en que se cerrará el mensaje automáticamente
        modal: //Opcional. Si el mensaje se muestra en modal Default: false
        log: //Opcional. Si ademas de mostrarse en el cliente se hace log del mensaje.       
        image: //Opcional. la image de font-awesome que se mostrará. Default none:
        close: //Opcional. evento con el que se cerrará el mensaje. Default. Clik (Solo si no se ha definido time)
    }

``` 

Ejemplo:

showToUser(
    {
        class: 'success',
        content: 'Hola, yo soy el html', //Es el único requerido
        element: $('div#undiv'),
        time: 5,
        log: true,
        image: 'fa-html5'
    }
    )
```

##Función onl.createDivInPlace($el, class)
Esta función crea un div (no modal) y lo posiciona exactamente el *bottom left*de *$el*. Devuelve el **id** del div creado.
Parametros:
 - **$el**: Requerido. El elemento $jQuery en el que posicionarse.
 - **class**: Opcional. El nombre de la clase (o clases seeparadas por espacio) que se añadirán al div recien creado. La clase **in-place** se crea automáticamente.
```javascript
    onl.createDivInPlace($('a.mienlace'),'mi_clase1 mi_clase2')

```


# Snippets

Los diferentes tipos de snippets están definidos en la variable **snippets** que indica: 
- El nombre del snippet
- La colección de mongo donde se almacenan
- El modo de la libreria ACE para que muetsre la sintaxis correcta a cada tipo
- El metodo **transform** que indica como se renderiza (o devuelve) el snippet
 

Actualmemte existes los siguientes typos

## Funcion doSnippet
Esta funci