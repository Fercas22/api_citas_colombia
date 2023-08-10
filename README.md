# API PARA PROYECTO DE CITAS

## Tabla de contenido

- [Requerimientos](#requermientos)
- [Inicialización](#init)
- [End Points](#endpoints)

<hr>

## Requerimientos <a name = "requerimientos"></a>

Para poder hacer uso o pruebas de esta API en local es importante tener instalado lo siguiente:
- Nodejs versión 16.18.0 o superior
- NPM versión 8.19.2 o superior
- VS Code (recomendado)
- Extensiones de Express (recomendado, solo VS CODE)

<hr>

## Inicialización <a name = "init"></a>

Para poder ejecutar este proyecto en su local debes ejecutar la siguiente linea en su terminal:
```
npm install
```
Esto instalara todas las dependencias usadas en el proyecto. Cabe mencionar que para que esto funcione tiene que tener instalado Nodejs y NPM

Y para poder correr el proyecto ya que se encuentra en desarrollo deberás tener instalado nodemon de manera global si lo prefiers: 
```
npm i nodemon -g
```
Una vez tengas nodemon puedes ejecutar el siguiente comando para correr el proyecto:
```
npm run dev
```

<hr>

## End Points
### Funcionamiento de los End Points
Para poder uso de tablas o enviar IDs al servidor se realiza por medio del End Point,  esto remplazando el **:parametro** por el dato que se desea enviar. Ejemplo:

Si tenemos la siguiente ruta
```
/api/showusers/:filter/:filterData
```
puedes remplazar < :filter > o < :filterData > por parametros. En este caso filter es la columna y filterData es el contenido de la columna.
```
/api/showusers/city/Guadalajara
```

### End Points <a name ="endpoints"></a>

**POST - Registrar usuario**
```
/api/registeruser
```

**GET - Ver usuario**
```
/api/showuser/:id
```

**GET -Ver usuarios**
```
/api/showusers
```

**GET - Filtrar usuarios**

**:filter** es un filtro basico (city, age, etc.) es decir es el campo que se desea filtrar.

**:filterData** es el contenido del filtro, por decir si desea filtrar por ciudad de remplaza por la ciudad que se desea filtrar

```
/api/showusers/:filter/:filterData'
```

**DELETE - Eliminar registro**

:table es la tabla en la cual se desea eliminar, si desea eliminar un usuario remplaze **:table** por **users**
```
/api/delregister/:table/:id
```

**PUT - Actualizar usuarios**

:table es la tabla en la cual se desea actualizar, si desea actualizar un usuario remplaze **:table** por **users**
```
/api/updregister/:table/:id
```

**POST - Login**

Para iniciar sesión existe este end point:
```
/api/login
```
Los resultados que puede arrojar son los siguientes:

| statusCode | info | descripción |
|:----------:|:-----|:------------|
| 200 | done | La autenticación fue correcta |
| 401 | incorrect | Contraseña o correos invalidos |
| 500 | internal error | Error interno en el servidor |

El API guarda un token en las cookies del navegador, la cookie se llama **auth** y contendra una cadena muy larga de caracteres que contiene el correo del usuario.


**DELETE - Logout**

Para cerrar una sesión se hace por medio de el siguente end point.
```
/api/logout
```
Lo que hace esta URL es eliminar la cookie para destruir la sesión que está iniciada; por lo que para volver a acceder se tendra que iniciar sesión nuevamente.