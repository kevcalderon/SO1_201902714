create database pruebaDB;
use pruebaDB;


create table Voto(
    idVoto INT AUTO_INCREMENT PRIMARY KEY,
    sede VARCHAR (100) NOT NULL,
    municipio VARCHAR (100) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    papeleta VARCHAR(50) NOT NULL,
    partido VARCHAR(50) NOT NULL
)



select * from Voto;
