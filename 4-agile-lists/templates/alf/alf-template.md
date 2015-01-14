#alf template ( `A`uto`L`ist`F`orm )
Plantilla para mostrar CRUD completo

Se llama unicamente mediante Router
Los nombres de listados y formas son case sensitive

Ejemplos
+ `http://localhost:3000/alf/torneos/torneos`
    * Parametros:
        1. `http://localhost:3000` (Dominio)
        2. `alf` (Nombre de la ruta)
        3. `torneos` (Nombre de la lista a cargar)
        4. `torneos` (Nombre del formulario a cargar, Opcional. **Si no existe buscará un formulario con el mismo nombre que la lista**)
+ `http://localhost:3000/alf/Lista de torneos/Formulario Torneos`
+ `http://localhost:3000/alf/personas`
    

Para que la edición funcione, el listado debe tener al menos un campo definido con el siguiente formato:
```javascript
    onl.link({texto:[actividad],edit:[_id])
```

y tiene que renderizar tal que 

```html
    <a edit="p98ybpuhyuf65e">Texto del enlace</a>
```
