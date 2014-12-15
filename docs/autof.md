AutofJS es una librería en Javascript que construye y renderiza formularios a partir de su configuración en formato YAML ( puede ser un archivo .yml
YAML es un formato sencillo y simple y autofJS está enfocado a ser una herramienta de desarrollo de formularios muy rápida y ágil.
Utiliza las nuevas funcionalidades de formularios de html5
# Configuración de Yml#
No es necesario encerrar los valores entre comillas. Los valores que admiten listas se separan por comas.
La configuración del formulario, podría ser algo como:

    form:
        collection: test 
        name: Persons
        modes: add, update, delete
        permisions:
        classes: miniform, test  
        fields:
             name:
                title: Name
                pattern: ^[azAZ]$ 
                required: true
                placeholder: Here the name, please
             hobbies:
                title: My Hobbies
                enum: swiming,running, Museum, cinema 
                enum_config: asc, upper
                size: 4
                required: true
                help: The help text we can use in every fiel
                multiple: true      
            eyes_color:
                format: color
                size: 5
                css: 
                class: my_own_class
            notes:
                type: textarea


## Bloque general (form:)
### name

    form:
         name: My form name



Define el nombre del formulario, tal como se mostrará

### collection


    form:
         collection: my_mongo_db_collection

Define la colección de MongoDB que se empleará para persistencia de datos

### modes ###


    form:
         modes: delete, update, insert

Define las opciones que permitirá el formulario

### permisions ###
    form:
         user_permisions: user1, user2,-user3
Permisos por usuarios.
Si no se define todos permitidos
Utiliza la función filtro_activo() (pendiente)


### classes ###


    form:
         classes: my_css_class, my_other_css_class

Clases que se añadirán al formulario, por defecto, aunque no se indique, se añade la clase `autof`

##Bloque `fields`
    form:
        [...]
        fields:
            field_name: 
                [...]
            other_field:
                [...]
            
Cada campo del formulario lleva su propio bloque de configuración, los campos puedes ser, según su tipo:

* **`select`** Para las listas desplegables
+ **`input`** Para todos los campos de entrada de texto, independientemente de su formato, incluyen campos tipo color, email, date, datetime, url, etc
* **`textarea`** Para los areas de texto, incluidos los campos con edición html



##`select`##
    form:
        [...]
        fields:
            hobbies:
                title: My Hobbies
                enum: swiming,running, Museum, cinema 
                enum_config: asc, upper
                size: 4
                required: true
                help: The help text we can use in every fiel
                multiple: true  

No es necesario definir un campo select especificamente, lo es si incluye una propiedad `enum`

###Propiedades por defecto

* Todos los valores de la lista se muestran *humanizados*, es decir, con mayúscula inicial y el resto en minúsculas y sin caracteres extraños (comas, guiones, etc)
* Los valores de las listas se ordenan en orden ascendente.
* Estos comportamientos pueden cambiarse en la propiedad `enum_config`

### optgroup

        form:
            [...]
            fields:
                my_name:
                    enum: sports|optgroup, swimming, running, cultural|optgroup, art, cinema, music
Tambien pueden especificarse grupos `optgroup` para agrupar los elementos de la lista, en este caso la lista **no se ordena**, sino que se respeta el orden de la misma. 
**`optgroup`** también puede usarse en combinación con **`enum_depend`** para filtrar la lista de elementos en función de la elección en otro campo. 

### Grupos de campos
         
         form:
            [...]
            fields:
                _personal_data:
                    open: true
                    class: personal
                    css: background-color:silver;
* **`Notas`**
Permite hacer agrupaciones de campos, que son envueltos en un `div` con las propiedades que pueden asignarse.
Para que se interprete commo un grupo de campos, debe comenzar por guión bajo (underscore , _)
El nombre de la etiqueta establecido automáticamente a partir del nombre de la clave, en el ejemplo la etiqueta del grupo sería `Personal data`
Se muestra una etiqueta que puede mostar/ocultar el bloque
* **`Valores`**
    * `open`: Si esta establecido a falso el bloque aparece plegado 
    * `class`: La clase o clases que son asignadas al bloque.
    * `css`: los estilos css inline que no establecidos



### Valor por defecto
        form:
            [...]
            fields:
                my_name:
                    enum: first element, second element|*, third element, other
                    
Pasandole el filtro **`list_value|*`** indicamos que será el valor por defecto y aparecerá seleccionado en el formulario.


##`input`##
    form:
        [...]
        fields:
            name:
                title: Name
                type: text
                required: true
                help: The help text we can use in every fiel
                pattern: /^a/






##Propiedades de los campos

###title
ejemplo:

    form:
        [...]
        fields:
            my_name:
                title: My title 

* **`Notas:`**    
Opcional. Si no existe se utiliza la versión humanizada del nombre del campo, en el ejemplo sería **My name**
* **`Se aplica a:`**  
Todos los tipos de campo.(`<select>`, `<input>`,  `<textarea>`)


###enum
* **Ejemplo:**

        form:
            [...]
            fields:
                my_name:
                    enum: first element, second element, third element, other

* **Notas:**  
Lista de elementos separados por comas. Por ahora no es posible incluir elementos de la lista que incluyan coma.               
* **Se aplica a:**  
    `<select>` De manera implicita, si se ha definido esta propiedad y no se ha definido `type:radio` o `type:checkbox`,  el campo será `<select>[...]</select>`
    

###enum_config
* **Ejemplo:**
        form:
            [...]
            fields:
                my_name:
                    enum_config: nohumanize, desc, [...]
* **Notas:**   
Lista separada por comas de las opciones de configuración que se pasarán al campo select:
* **Valores:**   
    * **`nohumanize`**: Deshabilita el filtro `humanize`
    * **`unorder`**: Impide que se ordene la lista.
    * **`desc`**: Fuerza la ordenación descendente de la lista.
    * **`upper`**: Fuerza a mayúsculas todos los elementos de la lista.
    * **`lower`**: Fuerza a minúsculas todos los elementos de la lista.
* **Se aplica a:**
`select`


###enum_depend
* **Ejemplo:**
        form:
            fields:
                country:
                    enum: usa, spain, france
                cities:
                    enum: usa|optgroup, Detroit, Chicago, spain|optgroup, Madrid, Barcelona, Sevilla, France|optgroup, Paris, Bourdeaux, Lille
                    enum_depend: country
                    
                    
* **Notas:**   
Determina el valor de qué campo (de tipo select o radio) sirve para filtrar los valores del campo. Usa como agrupación lógica todo lo contenido desde un **`optgroup`** al siguiente.
No se puede utilizar con campos establecidos a radio o checkbox
* **Se aplica a:**
    <select>










###size
* **Ejemplo:**
        form:
            [...]
            fields:
                my_name:
                    size: 12
* **Notas:**
Default: **`1`**. Indica el número de elementos visibles en la lista.
* **Se aplica a:**
 `<select>`

###required
* **Ejemplo:**
        form:
            [...]
            fields:
                my_name:
                    required: True | False (def)
* **Notas:**
Default: **`False`**. Indica si se establecerá la propiedad **`required`** en el campo.
* **Se aplica a:**
            <select>
            <input>
            <textarea>



###help
* **Ejemplo:**
        form:
            [...]
            fields:
                my_name:
                    help: This field is very important
* **Notas:**
Establece el title (tip) que se muestra al pasar el mouse por el campo.
* **Se aplica a:**
                <select>
                <input>
                <textarea>
###multiple
* **Ejemplo:**
        form:
            [...]
            fields:
                my_name:
                    multiple: True | False (def)
* **Notas:**

Indica si el campo select permite selecciones multiples.
Si se establece a `multiple`un campo **`type: radio`**, este seconvierte automáticamente a checkbox

* **Se aplica a :**
        <select>

###placeholder
* **Ejemplo:**
        form:
            [...]
            fields:
                my_name:
                    placeholder: This is the placeholder text
* **Notas:**
Muestra un texto como sugerencia en el interior del campo
* **Se aplica a :**
        <input> (excepto en los tipos en los que por su naturaleza no puede mostrarse (ej: <input type="color">)
        <textarea>

###type
* **Ejemplo:**
        form:
            [...]
            fields:
                my_name:
                    type: email
* **Notas:**
Determina el tipo de campo que se mostrara en base a las especificaciones html5 + otros propios. Si el navegador no puede mostrarlo lo convertirá a `type="text"`
* **Valores:**
    * button
    * checkbox 
    * color
    * date
    * datetime
    * datetime-local
    * email
    * file
    * hidden
    * image
    * month
    * number
    * password
    * radio
    * range
    * reset
    * search
    * submit
    * tel
    * text
    * time
    * url
    * week 
    * currency (propio)
    * decimal (propio)
* **Se aplica a :**
        <input> 
###default
* **Ejemplo:**
        form:
            [...]
            fields:
                my_name:
                    default: Juan Chamizo González
* **Notas:**
Produce un valor por defecto que será mostrado al generar el formulario.
* **Se aplica a :**
        <input>
        <textarea>
###class
* **Ejemplo:**
        form:
            [...]
            fields:
                my_name:
                    class: mi-own-class , mi-other-own-class
* **Notas:**
Establece una o varias clases especiales para el campo. Se puede separar con comas, aunque no es imprescindible.
* **Se aplica a :**
        <input>
        <textarea>
        <select>
        
###css
* **Ejemplo:**
        form:
            [...]
            fields:
                my_name:
                    css: border-color:green;height:22px;background-color:silver
* **Notas:**
Establece la propiedad `style` para el campo.
* **Se aplica a :**
        <input>
        <textarea>
        <select>
         
###min
* **Ejemplo:**
        form:
            [...]
            fields:
                my_name:
                    min: 4
* **Notas:**
Establece la propiedad `style` para el campo.
* **Se aplica a :**
        <input>
        <textarea>
        <select>   
        
###own_attributes
* **Ejemplo:**
        form:
            [...]
            fields:
                my_name:
                    own_attributes: autocomplete|on, my_own_propertie_key|my_own_propertie_value
* **Notas:**
Establece atributos especificas en el campo. 
La clave y el valor de cada atributo han de estar separados por **`|`**
Se pueden establecer distintos atributos, separándolos por comas.
* **Se aplica a :**
        <input>
        <textarea>
        <select>           


###maxlength
* **Ejemplo:**
        form:
            [...]
            fields:
                my_name:
                    maxlength: 12
* **Notas:**
Establece el máximo de caracteres que serán admitidos en un campo input

* **Se aplica a :**
        <input>
        <textarea>

###readonly
* **Ejemplo:**
        form:
            [...]
            fields:
                my_name:
                    readonly: true
* **Notas:**
Establece el atributo de solo lectura al campo

* **Se aplica a :**
        <input>
        <textarea>  
        

###disabled
* **Ejemplo:**
        form:
            [...]
            fields:
                my_name:
                    disabled: true | false (def)
                    
* **Notas:**
Activa la propiedad **`disabled`** en el campo
* **Se aplica a :**
        <input>
        <select>
        <textarea>
        
###disabled_if
* **Ejemplo:**
        form:
            [...]
            fields:
                my_name:
                    disabled_if: nombre| luis, maria, pedro
* **Notas:**
Activa la propiedad disabled si uno de los valores del campo `nombre` esta en la lista (depues de `|` )
* **Se aplica a :**
        <input>
        <select>
        <textarea>
        
###accept
* **Ejemplo:**
        form:
            [...] 
            fields:
                my_name:
                    accept:image/*
                    
* **Notas:**
Determina el tipo de contenido que puede aceptar un campo`file`
* **Se aplica a :**
        <input type="file">
        
        
###attributes
* **Ejemplo:**
        form:
            [...] 
            fields:
                my_name:
                    attributes: attr1=a|other=b
                    
* **Notas:**
Permite indicar un lista de atributos para incluir en cualquier campo, se separan mediante "|" (NOTA: este es diferente que en los arrays enum y en otros y es así para poder utilizar la coma dentro del valor de cada atributo.) Los nombres de atributo pueden distinguir entre minúsculas y mayúsculas, aunque en el markup se renderiza como "underscored".
Dentro de los valores de los atributos son pasados por la función`parseEval()` por lo que podemos usar cosas como  **`attributes: defaultDate=eval new Date()`**
* **Se aplica a :**
        <input>
        <select>
        <textarea>
        
        