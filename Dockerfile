FROM oven/bun@sha256:6ebf306367da43ad75c4d5119563e24de9b66372929ad4fa31546be053a16f74

#Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Copia solo los archivos necesarios de la aplicación
COPY tsconfig.json ./
COPY src ./src

# Copia el archivo .env si existe (para desarrollo local con Docker)
COPY .env* ./

# Instala las dependencias del proyecto usando bun
RUN bun install

# Compila la aplicación
RUN bun run build

# Crea un usuario no-root para ejecutar la aplicación
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup appuser && \
    chown -R appuser:appgroup /app

# Cambia al usuario no-root
USER appuser

# Expone el puerto que usa la aplicación (ajusta si usas un puerto diferente)
EXPOSE 3000

# Define el comando para iniciar la aplicación
CMD ["bun", "run", "start"]

