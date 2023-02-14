FROM golang:alpine

WORKDIR /app

COPY . .
COPY history.log /app/shared/

RUN go mod init backend
RUN go get -u github.com/go-sql-driver/mysql
RUN go get -u github.com/gorilla/mux


CMD ["go","run","server.go"]

EXPOSE 8080