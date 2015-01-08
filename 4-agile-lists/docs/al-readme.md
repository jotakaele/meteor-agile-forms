<!-- MarkdownTOC -->

- [Estructura][estructura]
  - [list][list]
  - [options][options]

<!-- /MarkdownTOC -->

# Estructura

## list

```
#!yaml
list:  # Obligatorio para inicializar la configuración de lista
  sources: 
    main:           #requerido. Es el item principal que se va a mostrar
      collection: personas #nombre de la colección principal
      sort: nombre desc #opcional, si queremos establecer un orden
      filter: #opcional. Usa el lenguaje natural de consultas de MongoDB 
        nombre: 
          $nin:
            - Jose
            - Julian
      columns:    #Las columnas que se van a mostrar en la tabla. Además se mostrará una columna por cada source del type oneTo Many
        nombre_completo: "[nombre] + ' ' + [primer_apellido] + ' ' + [segundo_apellido]"
        sexo: null
        text: makeId(4)
        rand: "_.random(1000,9999)"
    personas_colores: #Los joins type oneToMany son mostrados como una columna más con subobjetos
      type: oneToMany
      filter: null
      columns:
        color: "makeId(6) + [tono]+[color] + makeId(6)"
      main_id: personas_id #El nombre campo de la tabla secondaria que coincide con el _id de la tabla primaria.
    personas_mascotas:
      type: oneToMany
      filter: null
      columns:
        tipo: null
      main_id: personas_id
  options:
    title: "Una tabla!! eval(Meteor.release)"
```





## options
Se pone tal cual la librería  [json2TableList](https://github.com/jotakaele/json2TableList/blob/gh-pages/README.md), excepto para la opcion `calculateColumns` que se usa una sintaxis diferente... tal como se muestra en el ejemplo

Ejemplo
```
#!yaml

list:
  source:
    collection: personas
    sort: "primer_apellido desc,nombre"
  options:
    showRowIdColumn: false
    title: false
    tableClass: false
    cellDateFormat: "DD MM YYYY"
    createCellClassLimit: 10
    allowEvalCells: true
    sortable: true
    filterable: true 
    calculateColumns:
       campo1: avg, 2
       campo2: sum, 1 
```


