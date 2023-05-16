
const redis = require('redis')

let redisClient;

redisClient = redis.createClient({socket:{host:"localhost", port:"6379", password:"admin"}})
redisClient.connect()
console.log("CONectado")

redisClient.LRANGE("lastFive", 0, -1, function(err, reply) {
    if (err) console.error(err);
}).then((reply) => {
    let lastFive = []
    
    for (let entry of reply) {
        lastFive.push(JSON.parse(entry))

    }
    console.log(lastFive)
    })
    .catch((err) => {
        console.error(err);
        
    });