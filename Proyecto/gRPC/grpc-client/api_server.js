const express = require("express");
const app = express();
var morgan = require("morgan");
var cors = require("cors");

//Settings
const port = 4000;

//Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//Routes
//app.use('/',require('./routes/index'))
app.use("/voto", require("./routes/votos.js"));

app.listen(port, () => {
  console.log("Servidor en el puerto", port);
});
