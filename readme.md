#oeneele - Plataforma Ágil

Este documento tiene la información básica para la gestión de la plataforma



##Modulos
###Autoformularios
Los formularios e construyen a partir de su configuración en formato YAML (ver documentación de la librería autofJS)
Para moddificar su configuración se gestiona desde una de las siguientes rutas:

*    **`aplicacion/backend/af/`**: Lo cual muestra un listado para gestionar todos los formularios existentes en la aplicación.
*   aplicacion/backend/af/**`S2e7z7uxYgCe6ePnk`**: siendo el último parámetro el id del formulario que se va a gestionar.

Los formularios se guardan en la colección autof en MongoDB

Cuando se modifica un formulario se hace copia de seguridad del mismo, anadiendo `[autobackup]` al nombre

