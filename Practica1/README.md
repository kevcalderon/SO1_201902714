# Manual Técnico :boom:

La aplicación es un sistema que contará con tres componentes principales:  **un frontend, un backend y una base de datos.** El frontend se encargará de una interfaz gráfica de usuario para interactuar con el usuario y presentar la información de la aplicación de manera clara y atractiva.
El backend, por su parte, se encargará de la lógica de negocio y de la comunicación con la base de datos. Este componente será responsable de procesar y almacenar la información que recibe desde el frontend y devolver la información necesaria para su visualización en el frontend.
La base de datos, finalmente, será el repositorio de datos de la aplicación. Este componente almacenará toda la información necesaria para el funcionamiento de la aplicación, y será accedido por el backend para procesar y almacenar la información.
Y un contenedor extra para realizar las practicas de shell de Ubuntu.
Todos estos componentes serán desplegados mediante el uso de contenedores, utilizando una tecnología como **Docker**.

# Dockerfile - backend :whale:
```

FROM golang:alpine

WORKDIR /app

COPY . .

COPY history.log /app/shared/

RUN go mod init backend
RUN go get -u github.com/go-sql-driver/mysql
RUN go get -u github.com/gorilla/mux

CMD ["go","run","server.go"]

EXPOSE 8080
```

Este Dockerfile es un archivo que permite crear una imagen de Docker que incluirá una aplicación de backend escrita en Golang. La imagen se basará en la imagen oficial de Golang:Alpine.
El directorio de trabajo se establece en "/app" y se copian todos los archivos actuales a esa carpeta. También se copia un archivo "history.log" a una carpeta compartida.
Se ejecutan los comandos "go mod init backend" y "go get" para inicializar un módulo de Go y descargar las dependencias necesarias.
Y por ultimo, se establece el comando "CMD" para ejecutar el archivo "server.go" al iniciar el contenedor. Se establece también que la aplicación esté disponible en el puerto 8080 y se expone ese puerto.

## ENDPOINTS :anger:
```
GET -> /logs
POST -> /calculate
```
* La petición get, se utiliza para obtener la información de los logs generados en cada operacion
* La petición post, se utiliza para guardar la información del objeto "operacion" y guardarlo en la base de datos.


# Dockerfile - frontend :whale:

```
FROM node:alpine as build

WORKDIR /app
COPY . /app

ENV PATH /app/node_modules/.bin:$PATH

RUN yarn
RUN yarn build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```
Este `Dockerfile` permite crear una imagen completa y lista para usar que contiene una aplicación React y un servidor Nginx configurado para servirla. Al ejecutar el contenedor a partir de esta imagen, se puede acceder a la aplicación React en el puerto 80.

# Docker-compose.yml  :octopus:

```
version: "3"
services:
	mysqldb:
		container_name: mysqldb
		image: mysql
		restart: always
		environment:
			- MYSQL_ROOT_PASSWORD=root
			- MYSQL_DATABASE=sopes1practica1db
		ports:
			- 3306:33060
		networks:
			- app_net
		volumes:
			- mysql-vol:/var/lib/mysql

	backend:
		depends_on:
			- mysqldb
		container_name: backend
		restart: always
		image: kevcalderon/backend_practica1_201902714
		ports:
			- "8080:8080"
		networks:
			- app_net
		links:
			- mysqldb
		volumes:
			- shared:/app/shared

	frontend:
		depends_on:
			- backend
		container_name: frontend
		restart: always
		image: kevcalderon/frontend_practica1_201902714
		ports:
			- "3000:80"
		links:
			- backend
		networks:
			- app_net

	pcubuntu:
		container_name: pcubuntu
		image: ubuntu
		restart: on-failure
		command: ["sleep","infinity"]
		networks:
			- app_net
		volumes:
			- shared:/app/shared

networks:
	app_net:
		driver: bridge

volumes:
	mysql-vol:
	shared:
```


* :point_right: `version: "3"`: Especifica la versión de la sintaxis utilizada en el archivo `docker-compose.yml`. En este caso, se está utilizando la versión 3.
    
*  :point_right:  `services`: Es una sección que define los diferentes servicios que se ejecutarán como contenedores en el sistema. Cada servicio tendrá su propia configuración, como su imagen, puertos, volúmenes, etc.
    
*  :point_right: `mysqldb`: Este servicio representa una base de datos MySQL que se ejecutará como un contenedor. La imagen utilizada es `mysql`. La opción `restart: always` hace que el contenedor se reinicie automáticamente en caso de fallo. En la sección `environment`, se establece la contraseña root y el nombre de la base de datos. Los puertos 3306 y 33060 están enlazados para permitir el acceso a la base de datos desde el host. El servicio `mysqldb` está en el network `app_net` y se monta el volumen `mysql-vol` en el directorio `/var/lib/mysql` en el contenedor.
    
*  :point_right: `backend`: Este servicio representa la aplicación de backend. La opción `depends_on` especifica que el servicio `mysqldb` debe estar disponible antes de que el servicio `backend` se inicie. La imagen utilizada es `kevcalderon/backend_practica1_201902714`. Los puertos 8080 y 80 están enlazados para permitir el acceso a la aplicación de backend desde el host. El servicio `backend` está en el network `app_net`, está enlazado con el servicio `mysqldb` y se monta el volumen `shared` en el directorio `/app/shared` en el contenedor.
    
* :point_right:  `frontend`: Este servicio representa la aplicación de frontend. La opción `depends_on` especifica que el servicio `backend` debe estar disponible antes de que el servicio `frontend` se inicie. La imagen utilizada es `kevcalderon/frontend_practica1_201902714`. Los puertos 3000 y 80 están enlazados para permitir el acceso a la aplicación de frontend desde el host. El servicio `frontend` está en el network `app_net` y está enlazado con el servicio `backend`.
    
* :point_right: `pcubuntu`: Este servicio representa una máquina virtual de Ubuntu que se ejecutará como un contenedor. La imagen utilizada es `ubuntu`. Y ejecuta el comando `["sleep","infinity"]`. Este servicio tiene una restricción de reinicio en caso de fallas y se conecta a la red `app_net` y al volumen `shared`.

* :point_right: La red `app_net` utiliza el controlador `bridge` y es utilizada por los servicios `mysqldb`, `backend`, `frontend` y `pcubuntu`.

* :point_right: El volumen `mysql-vol` se utiliza para almacenar los datos persistentes de la base de datos MySQL. El volumen `shared` se utiliza para compartir datos entre los contenedores de los servicios `backend` y `pcubuntu`.


![image](https://jhymer.dev/content/images/2020/05/docker-compose-1.png)
