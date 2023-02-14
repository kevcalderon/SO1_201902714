package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"

	"github.com/gorilla/mux"
)

type operation struct {
	Numero1 float64 `json:"numero1,omitempty"`
	Numero2 float64 `json:"numero2,omitempty"`
	Simbolo string  `json:"simbolo,omitempty"`
}

type Response struct {
	Valor string `json:"valor"`
}

type Result struct {
	ID        string `json:"id"`
	Numero1   string `json:"numero1"`
	Numero2   string `json:"numero2"`
	Simbolo   string `json:"simbolo"`
	Resultado string `json:"resultado"`
	Fecha     string `json:"fecha"`
}

func connectionDatabase() (db *sql.DB, e error) {
	usuario := "root"
	pass := "root"
	host := "tcp(mysqldb:3306)"
	nombreBaseDeDatos := "sopes1practica1db"

	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@%s/%s", usuario, pass, host, nombreBaseDeDatos))
	if err != nil {
		return nil, err
	}
	return db, nil

}

func enableCORS(router *mux.Router) {
	router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	}).Methods(http.MethodOptions)
	router.Use(middlewareCors)
}

func middlewareCors(next http.Handler) http.Handler {
	return http.HandlerFunc(
		func(w http.ResponseWriter, req *http.Request) {
			// Just put some headers to allow CORS...
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
			// and call next handler!
			next.ServeHTTP(w, req)
		})
}

func writeFile(file *os.File, numero1 string, numero2 string, operacion string, result string) {
	file.WriteString(numero1 + "," + numero2 + "," + operacion + "," + result + "," + time.Now().Format("02/01/2006") + "\n")
}

func main() {

	db, err := connectionDatabase()
	if err != nil {
		fmt.Println("Error obteniendo base de datos: %v", err)
		return
	}

	// Terminar conexión al terminar función
	defer db.Close()

	// Ahora vemos si tenemos conexión
	err = db.Ping()
	if err != nil {
		fmt.Println("Error conectando: %v", err)
		return
	}

	router := mux.NewRouter()
	enableCORS(router)

	/*PETICION GET INIT*/
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Hola, bienvenido a mi API REST en Go!")
	}).Methods("GET")

	/*PETICION PARA LOGS*/
	router.HandleFunc("/logs", func(w http.ResponseWriter, r *http.Request) {
		var arrayResult []*Result
		sql := "SELECT * FROM Log"
		results, err := db.Query(sql)
		if err != nil {
			fmt.Println("Error a hacer query")
			return
		}

		for results.Next() {
			res := &Result{}

			err = results.Scan(&res.ID, &res.Numero1, &res.Numero2, &res.Simbolo, &res.Resultado, &res.Fecha)
			arrayResult = append(arrayResult, res)
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(arrayResult)

	}).Methods("GET")

	/*PETICION POST PARA CALCULAR OPERACIONES*/
	router.HandleFunc("/calculate", func(w http.ResponseWriter, r *http.Request) {

		var op operation
		var resultado float64
		var strResultado string
		// Decodifica los datos recibidos en el cuerpo de la petición como JSON
		err := json.NewDecoder(r.Body).Decode(&op)

		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Opera los numeros y devuelve un resultado.
		switch op.Simbolo {
		case "+":
			resultado = float64(op.Numero1) + float64(op.Numero2)
			strResultado = strconv.FormatFloat(resultado, 'f', -1, 64)

		case "-":
			resultado = float64(op.Numero1) - float64(op.Numero2)
			strResultado = strconv.FormatFloat(resultado, 'f', -1, 64)
		case "/":
			resultado = float64(op.Numero1) / float64(op.Numero2)
			strResultado = strconv.FormatFloat(resultado, 'f', -1, 64)
			if op.Numero2 == 0 {
				strResultado = "Math Error!"
			}
		case "*":
			resultado = float64(op.Numero1) * float64(op.Numero2)
			strResultado = strconv.FormatFloat(resultado, 'f', -1, 64)

		}

		//Realiza el insert a base de datos.
		stmt, err := db.Prepare("INSERT INTO Log(numero1,numero2,operacion,resultado) values(?,?,?,?);")
		res, err := stmt.Exec(op.Numero1, op.Numero2, op.Simbolo, strResultado)
		fmt.Println(res)

		if err != nil {
			fmt.Println(err)
			return
		}

		//Crear el archivo
		filename := "shared/history.log"
		//verificar si el archivo existe
		if _, err := os.Stat(filename); os.IsNotExist(err) {
			file, err := os.Create(filename)
			if err != nil {
				fmt.Println("Error al crear el archivo: ", err)
				return
			}
			defer file.Close()
			writeFile(file, strconv.FormatFloat(op.Numero1, 'f', -1, 64), strconv.FormatFloat(op.Numero2, 'f', -1, 64), op.Simbolo, strResultado)
			fmt.Println("Archivo creado con exito.")
		} else {
			file, err := os.OpenFile(filename, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
			if err != nil {
				fmt.Println("Error al abrir el archivo: ", err)
				return
			}
			defer file.Close()
			writeFile(file, strconv.FormatFloat(op.Numero1, 'f', -1, 64), strconv.FormatFloat(op.Numero2, 'f', -1, 64), op.Simbolo, strResultado)
			fmt.Println("Se escribio en el archivo correctamente.")

		}

		response := Response{Valor: strResultado}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(response)
	}).Methods("POST")

	fmt.Println("API iniciado en el puerto 8080")
	fmt.Println("Connection database succesfull!")
	err1 := http.ListenAndServe(":8080", router)
	if err1 != nil {
		fmt.Println(err1)
	}

}
