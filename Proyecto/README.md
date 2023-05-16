**<h1 align="center">Proyecto 1</h1>**

**<h3 align="center">Visualizador en tiempo real del porcentaje de votos en elecciones</h3>**

### Datos de los estudiantes

<div align="center">

| Nombre                      | Carné     |
| --------------------------- | --------- |
| Osmar Abdel Peña Santizo    | 201801619 |
| Kevin Josué Calderón Peraza | 201902714 |

</div>

# MANUAL TECNICO

## Descripción

Se creó un sistema distribuido que muestre estadísticas en tiempo real
mediante Kubernetes y tecnologías en la nube. También se debe proporcionar un
despliegue blue/green, es decir, una división de tráfico de entrada. Este proyecto
se hizó para llevar el control sobre el porcentaje de votos emitidos en las
elecciones.

## Arquitectura y lenguajes del proyecto

- K8
- Docker
- Reactjs
- Javascript
- Redis
- Mysql

<p align="center">
  <img src="https://github.com/kevcalderon/SO1_201902714/blob/master/Practica2/img/vms.png" width="600">
</p>

## GRPC

gRPC significa Google Remote Procedure Call. gRPC es un marco RPC de código abierto que se utiliza para crear APIs escalables y rápidas. Permite el desarrollo de sistemas en red y la comunicación abierta entre las aplicaciones cliente y servidor de gRPC. gRPC ha sido adoptado por varias empresas tecnológicas de primer nivel, como Google, IBM y Netflix, entre otras. El marco de trabajo de gRPC depende de pilas de tecnología de vanguardia como HTTP/2, búferes de protocolo y más para una óptima protección de la API, llamadas a procedimientos remotos de alto rendimiento y escalabilidad.

## PUB SUB

Redis Pub/Sub es un protocolo de mensajería extremadamente ligero diseñado para transmitir notificaciones en vivo dentro de un sistema. Es ideal para propagar mensajes de corta duración cuando la baja latencia y el gran rendimiento son fundamentales.

Las listas de Redis y los conjuntos ordenados de Redis son la base para implementar colas de mensajes. Puedes utilizarlas directamente para crear soluciones a medida, o a través de un marco de trabajo que hace que el procesamiento de mensajes sea más idiomático para el lenguaje de programación de su elección.

## K8 DEL PROYECTO (archivos .yaml)

### Namespace

```
apiVersion: v1
kind: Namespace
metadata:
  name: sopes
```

### GRPC

Se utilizó un deployment, que contiene dos contenedores y dos servicios (uno de tipo clusterIP, y otro LoadBalancer).

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grpc
  namespace: sopes
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grpc
  template:
    metadata:
      labels:
        app: grpc
    spec:
      containers:
        - name: grpc-client
          image: kevcalderon/grpc-client
          ports:
            - containerPort: 4000
        - name: grpc-server
          image: kevcalderon/grpc-server
          ports:
            - containerPort: 50051

---
apiVersion: v1
kind: Service
metadata:
  name: grpc-server
  namespace: sopes
spec:
  selector:
    app: grpc
  ports:
    - name: grpc
      port: 50051
      targetPort: 50051

---
apiVersion: v1
kind: Service
metadata:
  name: grpc-client
  namespace: sopes
spec:
  selector:
    app: grpc
  ports:
    - name: grpc-client
      port: 4000
      targetPort: 4000
  type: LoadBalancer
```

### Pub/Sub go

Se utilizó un deployment, que contiene dos contenedores y dos servicios (uno de tipo clusterIP, y otro LoadBalancer).

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gopubsub
  namespace: sopes
spec:
  replicas: 1
  selector:
    matchLabels:
      app: gopubsub
  template:
    metadata:
      labels:
        app: gopubsub
    spec:
      containers:
        - name: gopub-client
          image: osmarsantizo/redisgo-publisher
          ports:
            - containerPort: 4001
        - name: gosub-server
          image: osmarsantizo/redisgo-subscriber
          ports:
            - containerPort: 50052
---
apiVersion: v1
kind: Service
metadata:
  name: gosub-server
  namespace: sopes
spec:
  selector:
    app: gopubsub
  ports:
    - name: gopubsub
      port: 50052
      targetPort: 50052
---
apiVersion: v1
kind: Service
metadata:
  name: gopub-client
  namespace: sopes
spec:
  selector:
    app: gopubsub
  ports:
    - name: gopub-client
      port: 4001
      targetPort: 4001
  type: LoadBalancer

```

### API

Se utilizó un deployment para levantar la imagen de la api y respectivo servicio (loadBalancer) para que se pueda conectar al frontend.

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: sopes
spec:
  selector:
    matchLabels:
      app: api
  replicas: 1
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api-node
          image: osmarsantizo/apifront
          ports:
            - containerPort: 3001

---
apiVersion: v1
kind: Service
metadata:
  name: api-node
  namespace: sopes
spec:
  selector:
    app: api
  ports:
    - name: api-node
      port: 3001
      targetPort: 3001
  type: LoadBalancer
```
