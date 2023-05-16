const express = require("express");
const app = express();
const morgan = require("morgan");
const mysqlConnection = require("./mysql_connection");
const cors = require("cors");
const redis = require("redis");

// Crea un cliente de Redis
let redisClient;

redisClient = redis.createClient({
  socket: { host: "redis", port: "6379" },
  password: "admin",
});
redisClient.connect();
console.log("COnectado a Redis");

app.use(cors());

//Configuraciones
app.set("port", process.env.PORT || 3001);
app.set("json spaces", 2);

//Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    Title: "Hola mundo",
  });
});

// Recopilación de datos almacenados en MySQL.
app.get("/all", (req, res) => {
  mysqlConnection.query("SELECT * FROM Voto", (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error al obtener datos de la base de datos");
    } else {
      res.send(results);
    }
  });
});

//Top 3 de departamentos con mayores votos para presidente, en MySQL.
app.get("/top3", (req, res) => {
  mysqlConnection.query(
    `SELECT departamento, COUNT(*) AS total_votos_presidente
    FROM Voto
    WHERE papeleta = 'blanca'
    GROUP BY departamento
    ORDER BY total_votos_presidente DESC
    LIMIT 3;`,
    (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error al obtener datos de la base de datos");
      } else {
        res.send(results);
      }
    }
  );
});

//Porcentaje de votos por partido, según municipio y departamento.
app.get("/porcentaje/:departamento/:municipio", (req, res) => {
  const depto = req.params.departamento;
  const muni = req.params.municipio;

  mysqlConnection.query(
    `SELECT departamento, municipio, partido, COUNT(*) AS total_votos, 
    (COUNT(*) / (SELECT COUNT(*) FROM Voto WHERE departamento = '${depto}' AND municipio = '${muni}')) * 100 AS porcentaje_votos
FROM Voto
WHERE departamento = '${depto}' AND municipio = '${muni}'
GROUP BY departamento, municipio, partido;`,
    (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error al obtener datos de la base de datos");
      } else {
        res.send(results);
      }
    }
  );
});

//5 sedes con mayores votos almacenados en Redis.
app.get("/sedes", (req, res) => {
  redisClient
    .HGETALL("sedeCount", function (err, reply) {
      if (err) console.error(err);
    })
    .then((reply) => {
      allPlaces = [];
      for (let key in reply) {
        allPlaces.push({ id: key, count: reply[key] });
      }
      const sortedList = allPlaces
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      res.send(sortedList);
    })
    .catch((err) => {
      console.error(err);
      res.send(err);
    });
});

//Últimos 5 votos almacenados en Redis.
app.get("/ultimosVotos", (req, res) => {
  redisClient
    .LRANGE("new_vote_messages", 0, 4, function (err, reply) {
      if (err) console.error(err);
    })
    .then((reply) => {
      let lastFive = [];
      for (let entry of reply) {
        lastFive.push(JSON.parse(entry));
      }
      res.send(lastFive);
    })
    .catch((err) => {
      console.error(err);
      res.send(err);
    });
});

//Iniciando el servidor
app.listen(app.get("port"), () => {
  console.log(`Server listening on port ${app.get("port")}`);
});
