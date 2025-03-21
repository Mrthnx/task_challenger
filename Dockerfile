FROM public.ecr.aws/docker/library/node:23.7.0-alpine

#Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./
COPY package-lock.json ./

# Copia el resto de la aplicación
COPY . .

# Instala las dependencias del proyecto
RUN npm ci

# Compila la aplicación
RUN npm run build

# Expone el puerto que usa la aplicación (ajusta si usas un puerto diferente)
EXPOSE 3000

# Define el comando para iniciar la aplicación
CMD ["npm", "run", "start"]
