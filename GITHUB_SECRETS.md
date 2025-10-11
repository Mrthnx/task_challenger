# GitHub Secrets Configuration

Para que el proyecto funcione correctamente en GitHub Actions y en el despliegue, debes configurar los siguientes **Secrets** en tu repositorio de GitHub.

## Cómo configurar los Secrets

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, selecciona **Secrets and variables** → **Actions**
4. Haz clic en **New repository secret**
5. Agrega cada uno de los siguientes secrets:

## Secrets Requeridos

### Aplicación

| Nombre | Descripción | Ejemplo |
|--------|-------------|---------|
| `NODE_ENV` | Ambiente de ejecución | `production` |
| `APP_PORT` | Puerto de la aplicación | `3000` |
| `JWT_SECRET` | Clave secreta para JWT | `mi_clave_super_secreta_123456` |

### Base de Datos

| Nombre | Descripción | Ejemplo |
|--------|-------------|---------|
| `DATABASE_TYPE` | Tipo de base de datos | `postgres` |
| `DATABASE_HOST` | Host de la base de datos | `localhost` o IP del servidor |
| `DATABASE_PORT` | Puerto de la base de datos | `5432` |
| `DATABASE_USERNAME` | Usuario de la base de datos | `postgres` |
| `DATABASE_PASSWORD` | Contraseña de la base de datos | `tu_contraseña_segura` |
| `DATABASE_NAME` | Nombre de la base de datos | `task_challenger` |
| `DATABASE_MAX_POOL_SIZE` | Tamaño máximo del pool | `10` |
| `DATABASE_LOGGING` | Habilitar logging de queries | `false` (producción) o `true` (desarrollo) |

### Despliegue (Ya configurados)

| Nombre | Descripción |
|--------|-------------|
| `SSH_KEY` | Clave SSH privada para acceder al servidor EC2 |
| `IP_REMOTE` | Dirección IP del servidor EC2 |

## Notas Importantes

- **JWT_SECRET**: Debe ser una cadena larga y aleatoria. Puedes generarla con:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

- **DATABASE_LOGGING**: En producción se recomienda usar `false` para mejor rendimiento.

- **Valores de ejemplo**: Los valores en la tabla son solo ejemplos. Usa tus propios valores según tu configuración.

## Verificación

Después de configurar todos los secrets:

1. Los tests se ejecutarán automáticamente al hacer push a `master`
2. Si los tests pasan, el despliegue se ejecutará automáticamente
3. Las variables de entorno se inyectarán en el servidor EC2 durante el despliegue

## Desarrollo Local

Para desarrollo local, copia `.env.example` a `.env` y configura tus valores locales:

```bash
cp .env.example .env
```

Luego edita `.env` con tus valores de desarrollo.
