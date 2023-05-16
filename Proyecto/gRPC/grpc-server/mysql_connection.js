var mysql = require("mysql");
var mysqlConnection = mysql.createConnection({
  host: "mysqldb",
  user: "root",
  password: "root",
  database: "pruebaDB",
});

mysqlConnection.connect(function (err) {
  if (err) {
    console.log("Error al conectarse a la base de datos.", err);
  } else {
    console.log("Conexión a la base de datos exitosa.");
  }
});

module.exports = mysqlConnection;
