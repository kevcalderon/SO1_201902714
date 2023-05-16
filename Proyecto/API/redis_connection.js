const redis = require("redis");

// Crea una instancia del cliente Redis
const clientredis = redis.createClient({
  host: 'localhost', //Host de redis
  port: "6379", //Puerto de redis
  password: 'admin', //Password que guardé en redis.conf
  db: 0,
});

clientredis.on("connect", function () {
  console.log("Conexión a Redis exitosa");
});

module.exports = clientredis;
