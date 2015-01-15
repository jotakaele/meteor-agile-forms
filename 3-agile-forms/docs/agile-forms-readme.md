

# AgileForms (AF)
AgileForm es un sistema de definicion de formularios pensado para funcionar con Meteor y Mongodb. La configuración se hace mediante un objeto JSON, que puede editarse directamente desde la aplicación. 
Para facilitar la edición y convertirlo en "Agil", la configuración de los formularios se hace mediante YAML, lo que permite construir y/o modificar rápidamente y eficazmente formularios sencillos o muy complejos, sin tener que tocar nada de html.
La definicion de cada formulario, se guarda en MongoDb en la colección `_af`, que se crea automaticamente cuando se instala el paquete.



## form (YAML config): 
### collection:
- Requerido. El nombre de la colección sobre la cual actua el formulario. solo una 

### title: 
- Opcional. Si no existe utiliza `Form + el nombre de la coleccion`
 
### id:
- Opcional. Un identifiador único para el formulario. Si no existe utiliza el `_.slugify(title + collection )`

### modes:
- Pendiente de implementacion

### permissions:
- Pendiente de implementación

### i18n:
- Opcional. Default `true`  Si no existe o el valor es `true` traduce los siguientes elementos del formulario:
    + Etiquetas de los campos (incluidos los bloques)
    + Título del Formulario
    + Mensajes del formulario
    

### classes:
- Opcional. Clases que se añadirán al formulario. Siempre se añade la clase `autof`.

```yaml
form:
    collection: people
    title: My Form title
    id: form123
    modes: "add, read, delete"
    permissions: #pendiente
    classes: my-own-class
    fields:
        #.....
common:
    #.....
queries:
    #.....
```

### fields
En la clave `fields` puede haber tres tipos de entradas:
- La definicion de campos (input, select o texarea) que apareceran en el formulario. 
- La definicion del inicio de un bloques de campos. **Comienzan por guión bajo _**
- La finalización de un bloque de campos **_endblock** Lo cual es en realidad un bloque de campos que no se visualiza como tal mediante css. No es obligatorio cerrar los bloques expresamente. 
```yaml
form:
    #....
    fields:

        im_a_input:
            #....and my name is "im_a_input"
        _im_a_block:
            #....and my name is "im_a_block"     
        _im_a_endblock:
common:
    #.....
queries:
    #.....
```

#### bloques
Los bloques permiten la agrupación de un número indefinido de campos, con el fin de, simplemente mostrarlos agrupados, o bien de darles el tratamiento como un objeto en si mismo, de modo que en la base de datos se guardarían como un **array**, o como un objeto **JSON** en vez de como un campo regular.

Los bloques contienen todos los campos que se definen despues, hasta llegar al siguiente bloque. Si al inicio no se define ningún bloque, existe un bloque automático, llamado `startBlock` que por defecto no se muestra como tal, aunque sí, su contenido

Un bloque `siempre` tiene que comenzar por `guión bajo (_)` y puede tener las siguientes entradas:
- `class` Opcional. La clase o clases que se incluiran en el bloque.
- `limit` Opcional. Si no existe, el bloque simplemente actua como agrupación visual de los campos que incluye. En caso de existir, los valores puedens ser:
    - **1** En cuyo caso los campos que incluye se guardaran como un objeto JSON, en vez de como un campo regular 
    - **>1** El contenido se guardará como un *array* de *objetos* cada uno de los cuales contiene los campos . En este caso, se incluye en el bloque un boton para crear filas adicionales, hasta llegar al límite definido en *limit*

```yaml
        form:
        #....
            fields:
                _visual_block:
                _one_object_block:
                    limit: 1
                _array_objects_block:
                    limit: 3
```

- `activate` Opcional. [Ver activate](#activate). 
- `visibility` Opcional. `[open|close]` Default `open`. 
- `style` Opcional. Estilos css que se aplican directamente al bloque Ej: `background-color:red;color:#fff`. *Debe encerrarse entre comillas dobles.*
- `columns` Opcional. Default 12. El número de columnas que ocupará elñ bluque en el sistema de *grid*

#### campos
##### propiedades comunes de todos los campos
###### save_as
Por defecto los campos se envian a la baswe de datos con su tipo implicito, es decir:
- `date`,`datetime` y `time` son procesados como objetos `Date`
- `number`,`range` y `currency` son procesados como numeros
- *el resto* de campos son procesados como String

En el caso de `number` y `string` Puede sobrescribirse este comportamiento:mediante la propiedad 
```yaml
       form:
        #....
            fields:
                importe:
                    type: currency
                    save_as: string #Opcional. [string,number,date]
                valor:
                    enum: "1,2,3" #Si no se moidifica esto seria un string
                    save_as: number
```
save_as: 

###### noprocess
Se aplica a los campos que son transformados despues de su creación, para evitar su transformación (`select`,`textarea`,`date`,`datetime`,`time`)
###### html
Son los `atributos` que serán incluidos automáticamente en todos los campos, independientemenbte de su tipo. Es válido todo lo que sea permitido por html5 en cada caso.
```yaml
form:
    #....
    fields:
        an_input_name:
            type: text
            html: 
                maxlength: 40
                onclick: alert('hola')
                pattern: a|b|c
        an_input_range:
            type: range
            html:
                min: 1
                max: 50
                step: 10
        an_select_name:
            enum: a,b,c
            html:
                size: 10
                placeholder: I'm a select
common:
    #.....
queries:
    #.....
```
###### columns
Opcional. Default 12. El número de columnas que ocupará en control creado en el sistema de grid.
###### value
Opcional. El valor por defecto que tomará el control renderizado
##### datetimepicker, selectize y autosize
Los campos de tipo select, fecha, fecha y hora, hora y tags utilizan librerias externas para su configuración. Puesto que estas librerias reciben su configuración en fomatoi `JSON` esta puede ser sobreescrita en el apartado de cada campo o en el pertinente apartado de `common` Para ello, utilizar la sintaxis propia de cada una de las librerias.
```yaml
form:
    #.....
    fields:
        letras:
            enum: "a,b,c,d,e,f"
            multiple: true
            selectize:
                maxItems: 3
        hora:
            type: time
            value: "14:47"
            datetimepicker:
                inline: true
                allowTimes:
                - "12:00"
                - "13:00"

```

##### input
No es necesario indicar expresamente que queremos crear un control `input`. Para ello se utiliza la propiedad `type` en caso de existir. Si no existe la propiedad `type` (ni tampoco la propiedad `enum`) se crea un 

```html
<input type="text">
```

Podemos utilizar todos los tipos aceptados por [html5](https://developer.mozilla.org/es/docs/Web/HTML/Elemento/input)
`'button', 'color', 'date', 'datetime', 'datetime-local', 'email', 'file', 'hidden', 'image', 'month', 'number', 'password', 'range', 'reset', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week', 'decimal', 'currency', 'tags'`

*Casos especiales de inputs sobre inputs*
- *Fecha y hora* Los campos con `type: date` o `type: datetime` o `type: time` utilizan [datetimepicker.js](https://github.com/xdan/datetimepicker). Pueden personalizarse usando la entrada datetimepicker. 
- *Tags*  Los campos `type: tags`, se transforman haciendo uso de [selectize.js](http://brianreavis.github.io/selectize.js/)
- *Radio* Los campos `type: radio` son los únicos `input` que pueden contener la clave `enum`.

##### select
Todos los campos que contiene la clave `enum` (a excepción de los `type: radio`) son convertidos en controles `select`. 
Pueden contener las siguientes claves:
- **enum** Define el origen de la lista a utilizar. Puede haber varios tipos:
    + **Mediante un string de elementos separados por comas**: 
        * Ejemplo:    `letras-, a, b*, c, numeros-, 1,2,3`
        * Los items finalizados en _guión medio (-)_ son considerados como inicios de un grupo, *no como valores de la lista*
        * Los item finalizados en _asterisco (*)_ son considerados como valores seleccionados `selected=selected`
    + **Mediante el tipo especial `boolean`**: 
        * Ejemplo:    enum: `boolean`
        * Devuelve una lista con lo valores _Sí_, _No_ 
        * Al procesar el formulario, son almacenados como _true_ o _false_
    + **Mediante un array con un lista de valores**
        * Ejemplo: 
        
 ```yaml
form:
    fields:
        gender:
            enum: 
                - male
                - female
        colors:
            enum:
                - hot- #this is a optgroup
                - brown
                - orange
                - cold- #this is a optgroup 
                - blue* #this is a selected item
                - green
 ```


   + **Mediante un array de objetos**
       * Cada elemento de la lista debe corresponderse con un objeto JSON como este:
 ```json 
{
    value: "brown ",
    label: "The brown color",
    optgroup: "hot_colors"
}
 ```
 
        Por eso, en la configuración YAML debe representarse:

   ```yaml
    form:
        fields:
            colors:
                enum:
                    - optgroup: hot_colors #this is a optgroup
                      label: The brown color
                      value: brown
                    - optgroup: hot_colors
                      value: orange   #Si label no existe utiliza value en su lugar
   ```

   + **Mediante un la definición de una consulta contra Mongodb**
       * Podemos indicar una consulta definida en `queries:` que nos dara el resultado para rellenar la lista. ver el apartado _queries_ para ver el formato.
 ```yaml
    form:
        fields:
            colors:
                enum: queries.query001 # esto arrojará el resultado de la clave queries: query001
    queries:
        query001:
            #..... 
 ```

- **multiple** Opcional. `[true|false] Default false`. Indica si el control puede devolver más de un elemento, en cuyo caso devolverá un array.
- **enum_depend** Indica de qué otro campo depende lo que se muestra en la lista. Para ello utiliza como selector el `optgroup`. **NOTA: Tener cuidado en el caso de utilizar *enum_i18n* porque esto puede alterar el resultado del filtro. En este caso se recomienda traducir solamente los valores de label**  
-  **enum_i18n** Opcional. `[label|all]`. Indica si hay que traducir los valores de la lista.
    +  `label` Solamente traduce la etiqueta y el valor lo deja intacto
    +  `all` Traduce tanto la etiqueta como el valor.

 
 ```yaml
    form:
         fields:
            texto:
              type: radio
              enum: "letras,numeros"
              item_columns: 2
            un_select:
              enum_depend: texto
              enum:
                - letras-
                - a
                - b
                - c
                - numeros-
                - "1"
                - "2"
 ```

##### textarea
Los campos de tipo textarea son transformados con [autosize.js](https://github.com/jackmoore/autosize) Solo tiene dos posibles personalizaciones: 
- html
- noprocess 


##### activate
Se aplica a campos normales y a campos de bloque , que comienzan por _ (underscore)
```yaml 
form:
    fields:
        field_name:
            activate:   
                mode: enable_if | disable_if | hide_if | show_if # Requerido 
                initial:  enabled | disabled | hidden | visible  # Opcional. Estado en que se mostrara el item, si no se indica se muestra el contrario del indicado en mode
                expression: # Opcional. Ej: _.random(1,2) == 2  Una expresion javascript. Si devuelve true (y solo en ese caso se evalua). Si no existe la clave triggers, expression es evaluado solo en la carga inicial, en caso contrario se evalua en cada evento.
                triggers: # Opcional. Una clave, por cada nombre de campo que será evaluado al cambiar
                    nombre_campo: #Requerido. el nombre de un campo input, select, textarea, etc cuyo valor sea evaluable
                        in: # Requerido. Si el valor del campo es uno de los elementos, realiza la accion "mode" Case insensitive. 
                            - cad1
                            - cad2
                            - cad3
                            - etc
                        not_in: # Requerido. Si el valor del campo NO es uno de los elementos, realiza la accion "mode" Case insensitive. 
                            - cad1
                            - cad2
                            - cad3
                            - etc
```


### common
Indicamos la configuración que se aplicará a los diferentes campos:
El order en que se van sobrescribiendo las configuración, esn caso de existir es 
** `all`
** `control`
** `type`
** `block_content`
** `blocks`
** El definido en la clave de cada campo

```yaml
form:
    fields:
    common: #Opcional. 
        all: # Configuraciones comunes para todos los campos
        control: #Opcional
            control_htmltype: input | select | textarea # requerido Configuración para todos los controles del tipo indicado
        type: #Opcional
            field_type: text | date | email | tags | currency etc #Requerido. Configuración para los campos que tengan la propiedad type establecida al nombre de clave.
        block_content:
            _nombre_del_bloque: #por ejemplo: _bloque_1 Se aplica la configuración contenida en todo los campos del bloque indicado


        blocks: #Opcional Configuración comun para todos los bloques (sus valores puedes ser class, columns, style, columns o limit. NOTA: NO afecta a los campos contenidos, sino solamente a la configuracion del bloque contenedor.
```

## helpers (y sustituciones)
Se permite el uso de `$nombreDeOtraClave$` para insertar en su posición el contenido de la clave indicada.
Si la clave no contiene una ruta (uno o más . [puntos]) se espera que sea un clave dentro de helpers, que debe estar en el primer nivel de la configuración,  en caso contrario debe indicarse la ruta completa

`$colorbase$` es reemplazado por la clave helpers.colorbase
`$form.fields.campo1.columns$` será sustituido por el valor de la ruta indicada


```yaml


```


## queries (consultas contra la base de datos)
Devuelve el resultado de una consulta a la base de datos, con formato listo para ser usado en un enum. Usa el lenguaje de consultas propio de Meteor.Mongo

 ```yaml
form:
    fields:
        candidate:
            enum: queries.persons_list # esto arrojará el resultado de la clave queries: query001
queries:
  persons_list: # Requerido. El nombre de la clave que usaremos despues
    collection: persons # Requerido. El nombre de la coleccion de mongo donde ha de buscar.
    filter: #Opcional. importante comprobar que devuelve datos con valor al menos. 
      primer_apellido: # El nombre de un (o más) campo a comprobar dentro de filter
        $in: ["garcia", "sanchez"] #la(s) condicion(es) a comprobar
    format: # Opcional. definimos los campos que va a devolver y como la consulta. 
      sort: #Opcional. Si no existe ordenará por el primer campo usado en "value"
        primer_apellido: 1
      limit: 20  #Opcional. El número de registros devueltos por la consulta.
    value: "[nombre]" # Requerido.El valor que se utilizará como value en el control, debe aparecer encerrado entre corchetes. Puede componerse a apartir de varios campos. Es pasado por eval()
    label: "[nombre] + ' ' + [primer_apellido]" #Opcional. La cadena que se mostrará. Es pasado por eval. Los campos deben encerrarse entre corchetes. Si no existe se utiliza "value" en su lugar.
    optgroup: "[sexo]" #Opcional. El valor por el que agruparemos, Es pasado por eval, y los campos que utiliza deben encerrarse entre corchetes.
 ```



## Cargar un formulario

### Desde Javascript. 
Se puede llamar a un formulario usando la función `cargaForm`


```javascript

    cargaForm({
        src: {form: .... } //Opcional. src puede ser un objeto JSON de definicion del formulario, Si el parametro no existe, lo extraerá de la base de datos a partir de name (habitual)
        div: 'divname',  // Opcional. Default 'formdest' El id del div donde se va a renderizar el form
        mode: 'edit', // Opcional. Default 'new' [new,edit,delete,readonly]
        name: 'Personas', //Requerido. Nombre del formulario a cargar
        doc: 'kjhklgh876ggf5c' // Requerido si 'mode' es 'edit' o 'readonly'. Id del documento a cargar enel formulario
    })

```


### Desde una template

```html
  
    {{> formshow name="torneos" mode="edit" docId="kjhklgh876ggf5c"}}


    {{> formshow name="Personas"}}


    {{> formshow name="theFormName" mode="new"}}


```