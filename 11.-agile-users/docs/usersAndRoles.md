#Usuarios
Onl usa el paquete [useraccounts-foundation](https://github.com/meteor-useraccounts/core/blob/master/Guide.md#features) para la gestion de la pantalla de login.

#Roles
Para los roles se utiliza el paquete [alanning:roles](https://atmospherejs.com/alanning/roles). Los roles son definidos a través de snippets config y se almacenan en la collection **_config** en **{name:roles}**

Los roles pueden definirse mediante la clave roles, o mediante la clave users, indistintamente.

```yaml

roles:
  admin:
    - "admin1@gmail.com"
  gestor:
    - "gestor1@gmail.com"
    - "gestor2@gmail.com"
  operator:
    - "operator1@gmail.com"
    - "operator2@gmail.com"
    - "operator3@gmail.com"
  pintamonas:

users:
  juan.chamizo@gmail.com:
    - admin
    - operador
    - gestor
    - pintamonas
  perico@delospalotes.com:
    - pinamonas
    - gestor

```

**Nota:** Cuando el snippet de *config.roles* es modificado (en realidad es una nueva insercion) se llama a automáticamente al metodo de servidor *createRolesFromConfigRoles()*, que se encarga de actualizar (re-generar) toda la información de roles, en *todos* los usuarios. 