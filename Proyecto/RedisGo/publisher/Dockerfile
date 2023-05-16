FROM golang:alpine

RUN mkdir /app
WORKDIR /app
COPY . .
RUN go mod init publisher
RUN go get github.com/go-redis/redis/v8
RUN go get github.com/gorilla/mux
RUN go build -o publisher
CMD ["/app/publisher"]

# EXPOSE 8080