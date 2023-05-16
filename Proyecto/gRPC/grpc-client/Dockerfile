# Utiliza una imagen de Node.js como base
FROM node:16.13.1

# Crea un directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del proyecto al directorio de trabajo
COPY . .

# Instala las dependencias del proyecto
RUN npm install

# Expone el puerto
EXPOSE 4000

# Define el comando para iniciar el servidor de la API
CMD ["node", "api_server.js"]