# SOA Partners API

API REST para la gestión de partners con autenticación y tokens únicos autogenerados.

## 🚀 Características

- **Gestión de Partners**: CRUD completo para partners
- **Tokens Únicos**: Generación automática de tokens únicos para cada partner
- **Autenticación**: Sistema de login con email y contraseña
- **Validaciones**: Verificación de tokens y emails únicos
- **Documentación**: Swagger UI integrado
- **Arquitectura en Capas**: Repository, Service, Controller, Routes
- **TypeScript**: Código tipado y robusto
- **TypeORM**: ORM para gestión de base de datos

## 📋 Prerrequisitos

- Node.js (versión 16 o superior)
- MySQL/MariaDB
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd SOA-PARTNERS
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

⚠️ **IMPORTANTE**: El archivo `.env` no está incluido en el repositorio por seguridad. Debes crearlo manualmente.

Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_DATABASE=soa

# Configuración del servidor
PORT=2224

# Configuración de Swagger
SWAGGER_SERVER_URL=http://localhost:2224/api

# Configuración de JWT (si se implementa en el futuro)
JWT_SECRET=tu_jwt_secret
```

4. **Configurar la base de datos**

Ejecuta el siguiente SQL para crear la tabla de partners:

```sql
CREATE TABLE `tbl_partners` (
  `partner_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `token` text NOT NULL,
  `password` text NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint DEFAULT '1',
  `deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`partner_id`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

5. **Compilar TypeScript**
```bash
npm run build
```

6. **Ejecutar la aplicación**
```bash
npm start
```

## 🌐 Endpoints de la API

### Base URL
```
http://localhost:2224/api
```

### Partners

#### Crear Partner
```http
POST /partners
```
**Body:**
```json
{
  "name": "Juan",
  "lastname": "Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```
**Respuesta:**
```json
{
  "id": 1,
  "name": "Juan",
  "lastname": "Pérez",
  "email": "juan@example.com",
  "token": "abc123token456",
  "isActive": true,
  "deleted": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Obtener Partner por ID
```http
GET /partners/{id}
```

#### Obtener Partner por Token
```http
GET /partners/token/{token}
```

#### Obtener Partners Paginados
```http
GET /partners?page=1&items=10
```

#### Actualizar Partner
```http
PUT /partners
```
**Body:**
```json
{
  "id": 1,
  "name": "Juan Actualizado",
  "lastname": "Pérez",
  "email": "juan_new@example.com",
  "token": "nuevo_token_opcional"
}
```

#### Login
```http
POST /partners/login
```
**Body:**
```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

#### Actualizar Contraseña
```http
POST /partners/update-password
```
**Body:**
```json
{
  "id": 1,
  "password": "nueva_password"
}
```

## 📚 Documentación Swagger

La documentación interactiva está disponible en:
```
http://localhost:2224/api-docs
```

## 🏗️ Arquitectura del Proyecto

```
src/
├── config/
│   └── swagger.ts          # Configuración de Swagger
├── infrastructure/
│   ├── controller/
│   │   └── partner.controller.ts
│   ├── database/
│   │   └── database.ts
│   ├── dto/
│   │   └── partners.dto.ts
│   └── entity/
│       └── partners.entity.ts
├── repository/
│   ├── base-repository.interface.ts
│   └── partners.repository.ts
├── routes/
│   └── partner.routes.ts
├── service/
│   └── partner.service.ts
├── utils/
│   ├── bcrip.util.ts
│   ├── getPaginated.ts
│   └── token.util.ts
└── server.ts
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Compilar TypeScript
npm start           # Ejecutar en producción

# Testing
npm test            # Ejecutar tests
npm run test:watch  # Ejecutar tests en modo watch
```

## 🔒 Validaciones y Seguridad

### Tokens Únicos
- Los tokens se generan automáticamente al crear un partner
- Cada token es único en toda la base de datos
- Se valida que no haya duplicados al crear o actualizar

### Emails Únicos
- Cada email debe ser único en la base de datos
- Se valida al crear y actualizar partners

### Contraseñas
- Las contraseñas se hashean usando bcrypt
- Se valida que la nueva contraseña sea diferente a la actual

### Estados
- Partners pueden estar activos/inactivos
- Soporte para soft delete (no se eliminan físicamente)

## 🚨 Códigos de Error

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado exitosamente |
| 400 | Error de validación o datos incorrectos |
| 404 | Recurso no encontrado |
| 409 | Conflicto (email o token ya en uso) |
| 500 | Error interno del servidor |

## 🔧 Configuración del Puerto

El puerto sugerido es **2224**. Puedes cambiarlo en el archivo `.env`:

```env
PORT=2224
```

## 📝 Notas Importantes

1. **Archivo .env**: No está incluido en el repositorio. Debes crearlo manualmente.
2. **Base de datos**: Asegúrate de que MySQL esté ejecutándose y la base de datos esté creada.
3. **Tokens**: Se generan automáticamente y son únicos.
4. **Contraseñas**: Se hashean automáticamente antes de guardar.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio. 