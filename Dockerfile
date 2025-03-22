FROM bun:latest

#Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Copia el resto de la aplicación
COPY . .

# Instala las dependencias del proyecto usando bun
RUN bun install

# Compila la aplicación
RUN bun run build

# Expone el puerto que usa la aplicación (ajusta si usas un puerto diferente)
EXPOSE 3000

# Define el comando para iniciar la aplicación
CMD ["bun", "run", "start"]

