# Sistema de traducción propio basado en base de datos 
Puede usarse de las siguientes maneras
## Traducir cadenas
* **Mediante javascript**: `t("Palabra o palabras a traucior")` El origen siempre es en ingles.
   
*  **Mediante un helper en cualquier template**: El origen siempre en ingles.
```javascript
        {{tr "Palabra o palabras a traducir"}}
```

## Usa el panel de traducción
Puede llamarse al panel de traduccción manual mediante la funcion cliente 
`showTraductionsPanel()`


## Variables de sesion
El sistema de traducción usa las siguientes variables de sesion:

+ `lang`, que por defecto es 'en', pero que puede ser cualquier codigo de lenguaje (es-ES, ca-ES, fr-FR, .......)
+ `translating` que determina el modo en que se traducen las palabras, puede ser:
    * **none** Simplemente se recuperan las palabras ya traducidas
    * **auto** Descraga las traduciones mediante la API de mymemory (de momento)
    * **manual** Activa el panel de traduciones manual.


