var express = require("express");
var router = express.Router();
const client = require("../grpc_client");

router.post("/agregarVoto", function (req, res) {
  const data = {
    sede: req.body.sede,
    municipio: req.body.municipio,
    departamento: req.body.departamento,
    papeleta: req.body.papeleta,
    partido: req.body.partido,
  };
  client.AddVoto(data, function (err, response) {
    res.status(200).json({ mensaje: response.message });
  });
});

module.exports = router;
