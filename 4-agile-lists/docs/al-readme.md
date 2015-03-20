# LIST
Los listados se generan utilizando [jquery Datatables](http://datatables.net) 

## Configuracion YAML

```yaml

list: #requerido
  sources:  #requerido
    main:   #requerido. La fuente principal de datos
      collection: persons   #el nombre de la coleccion principal
      selector: #Opcional. La lista de selectores sobre "find". Lenguaje MongoDB
        nombre: #Un  campo sobre el que filtramos
          $nin:   #Un operador
             - juan 
      options:  #requerido
        fields:   # la lista de columnas a mostrar
          index: null   #Opcional. si queremos mostrar columna index
          nombre_completo: "(@nombre)" #Columna interpretada con Javascript
          fecha1/date: "moment(@fecha1).format('DD/MM/YYYY mm:ss')//date" #columna interpretada. En el nombre se pude poner la clase a mostrar despues de /
          fecha2: "rDate(@fecha2)"  #...
          numero/euro: null #...
          numero1/number: null  #...
    contratos: #Opcional. Una tabla relacionada
      collection: contracts #el nombre de la colección secundaria
      options:
        fields:
          inicio:
          fin:
          tipo:
      relation: #requerido. Indica la relación entre contratos y main
        source: main@_id  #requerido. la colección y el campo con el que relacionar
         self: persons_id   #requerido. el campo de esta colección que relaciona
  datatables: #opcional. configuración de datatables 
    search:
      regex: true
    tableTools:
      aButtons:
        - copy
        - print
  html: #opcional. html a renderizar antes y despues de la tabla
    before: "<h1>Titulo de la tabla</h1>"
    after: "--snippet|html|micro--"
  css:  #opcional. css a injectar antes de la tabla
    span.micro:
      font-size: 8px;
      line-height: 10px;
      display: inline-block;
      color: silver;
    td.cell-fecha1:
      width: "25%;"
      color: brown;
      background-color: "#fff;"
    "td.cell-fecha1:hover":
      font-size: "150%;"
```

