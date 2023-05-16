/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var PROTO_PATH = "./proto/Voto.proto";

var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var demo_proto = grpc.loadPackageDefinition(packageDefinition).Voto;
const mysqlConnection = require("./mysql_connection");

function AddVoto(call, callback) {
  const query = `INSERT INTO Voto (sede, municipio,departamento,papeleta,partido) VALUES('${call.request.sede}', '${call.request.municipio}', '${call.request.departamento}', '${call.request.papeleta}', '${call.request.partido}');`;
  mysqlConnection.query(query, function (err, rows, fields) {
    if (err) throw err;
    callback(null, { message: "Voto insertado en la base de datos." });
  });
}

function main() {
  var server = new grpc.Server();
  server.addService(demo_proto.Votos.service, { AddVoto: AddVoto });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.log("GRPC Server on port 50051");
    }
  );
}

main();
