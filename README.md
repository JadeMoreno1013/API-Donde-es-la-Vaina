# Donde es la Vaina API

API REST para la venta de entradas a eventos (conciertos, teatro y otros), construida con Node.js, Express y MySQL. Permite registrar usuarios, administrar lugares y eventos, comprar entradas y dejar reseñas de eventos finalizados.

## Requisitos

- Node.js 20.6 o superior (el script de arranque usa `node --env-file`)
- MySQL 8
- MySQL Workbench (opcional, para ejecutar el script SQL)

## Instalación

1. Clona el repositorio e instala las dependencias:

   ```bash
   git clone <URL-DEL-REPOSITORIO>
   cd <carpeta-del-repositorio>
   npm install
   ```

2. Crea la base de datos ejecutando el script `project_code_db.sql` en MySQL (por ejemplo, desde MySQL Workbench: `File > Open SQL Script` y luego el rayo para ejecutar).

3. Crea tu archivo de entorno a partir del ejemplo y completa los valores (credenciales de tu MySQL local):

   ```bash
   cp .env.example .env
   ```

   En Windows (PowerShell): `copy .env.example .env`

4. Inicia el servidor:

   ```bash
   npm start
   ```

   Debe aparecer `Server running in http://localhost:5000`.

## Documentación (Swagger)

Con el servidor corriendo, abre **http://localhost:5000/docs**. Desde ahí puedes ver todos los endpoints, sus ejemplos y probarlos.

La especificación está en [`docs/openapi.yaml`](docs/openapi.yaml). También puede abrirse en el [editor de Swagger](https://editor.swagger.io/) importando ese archivo.

## Crear el primer administrador

El registro público siempre crea usuarios normales. Para tener un administrador:

1. Registra al usuario con `POST /users` (desde Swagger o Postman).
2. Ascéndelo directamente en la base de datos:

   ```sql
   UPDATE app_user SET is_admin = TRUE WHERE id_user = 1;
   ```

3. Inicia sesión de nuevo con `POST /sessions` para obtener un token con ese rol.

## Autenticación

`POST /sessions` verifica las credenciales y devuelve un token. Las rutas protegidas lo reciben en la cabecera:

```
Authorization: Bearer <token>
```

En Swagger, pulsa **Authorize** y pega el token. Si el token falta o expiró, la API responde `401`; si el usuario no tiene permiso para la operación, responde `403`.

## Endpoints

| Recurso | Operaciones |
|---|---|
| Sesiones | `POST /sessions` (iniciar sesión), `DELETE /sessions` (cerrar sesión) |
| Usuarios | `POST /users`, `GET /users`, `GET /users/{id}`, `PATCH /users/{id}`, `DELETE /users/{id}` |
| Lugares | `GET /venues`, `GET /venues/{id}`, `POST /venues`, `PUT /venues/{id}`, `DELETE /venues/{id}` |
| Eventos | `GET /events`, `GET /events/{id}`, `POST /events`, `PATCH /events/{id}`, `DELETE /events/{id}`, `GET /events/{id}/info`, `PUT /events/{id}/info` |
| Compras | `POST /purchases`, `GET /purchases`, `GET /purchases/{id}`, `GET /purchases/{id}/tickets` |
| Reseñas | `POST /reviews`, `GET /reviews`, `GET /reviews/{id}`, `PATCH /reviews/{id}`, `DELETE /reviews/{id}` |

Reglas principales:

- Solo un administrador puede listar usuarios, cambiar roles y crear, modificar o eliminar lugares y eventos.
- Un usuario solo puede ver y modificar sus propios recursos (compras, reseñas, perfil).
- La compra se registra en una transacción y descuenta las entradas disponibles; el precio de cada entrada debe estar entre `price_min` y `price_max` del evento.
- Solo se puede reseñar una compra cuando el evento ya finalizó, y una compra tiene una sola reseña.
- No se puede eliminar un recurso con registros asociados (responde `409`).

## Estructura del proyecto

```
.
├── controllers/     # Reciben la petición y devuelven la respuesta
├── dao/             # Acceso a la base de datos
├── middlewares/     # Autenticación, permisos y manejo de errores
├── routes/          # Definición de rutas por recurso
├── services/        # Lógica de negocio
├── utils/           # Utilidades y constantes
├── validators/      # Validación de los datos de entrada
├── docs/
│   ├── openapi.yaml
│   ├── Donde-es-la-Vaina_API_postman_collection.json
│   └── evidence/    # Reporte de pruebas
├── .env.example     # Plantilla de variables de entorno
├── project_code_db.sql
├── package.json
└── server.js
```

## Pruebas

Las pruebas están en la colección de Postman [`docs/Donde-es-la-Vaina_API_postman_collection.json`](docs/Donde-es-la-Vaina_API_postman_collection.json): 66 peticiones, que cubren cada endpoint con su caso de éxito y su caso de error (400, 401, 403, 404 y 409). Cada petición verifica su código de respuesta esperado.

### Ejecutar con Postman

1. Importa el archivo en Postman (`Import`).
2. Verifica que la variable de colección `baseUrl` sea `http://localhost:5000`.
3. Abre la colección y pulsa **Run**.

### Ejecutar con Newman

```bash
npm install -g newman newman-reporter-htmlextra
cd docs
newman run Donde-es-la-Vaina_API_postman_collection.json -r cli,htmlextra --reporter-htmlextra-export evidence/report.html
```

### Importante

La colección crea y elimina sus propios datos, y asume una base **recién creada**: el usuario `admin@email.com` (contraseña `admin12345`) registrado y ascendido a administrador con el `UPDATE` de arriba, y un lugar con capacidad suficiente creado como `id` 1. Solo funciona una vez por base limpia; para repetirla, vuelve a ejecutar `project_code_db.sql` y repite esa preparación.

### Evidencia

El resultado de la última ejecución (66 peticiones, 66 aserciones, 0 fallidas) está en [`docs/evidence/report.html`](docs/evidence/report.html).

## Seguridad

- El archivo `.env` no se sube al repositorio (está en `.gitignore`); usa `.env.example` como plantilla.
- Las credenciales que aparecen en la colección de Postman y en el reporte son datos de prueba locales.
