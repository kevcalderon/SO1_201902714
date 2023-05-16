FROM golang:alpine

RUN mkdir /app
WORKDIR /app
COPY . .
RUN go mod init subscriber
RUN go get github.com/go-redis/redis/v8
RUN go get -u github.com/go-sql-driver/mysql
RUN go build -o subscriber
CMD ["/app/subscriber"]