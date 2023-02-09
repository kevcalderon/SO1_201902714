package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	_ "github.com/go-sql-driver/mysql"

	"github.com/gorilla/mux"
)

type operation struct {
	Numero1 float64 `json:"numero1,omitempty"`
	Numero2 float64 `json:"numero2,omitempty"`
	Simbolo string  `json:"simbolo,omitempty"`
}

type Response struct {
	Valor float64 `json:"valor"`
}

/*
func connectionDatabase() (db *sql.DB, e error) {
	usuario := "root"
	pass := "root"
	host := "tcp(localhost:3306)"
	nombreBaseDeDatos := "sopes1practica1db"

	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@%s/%s", usuario, pass, host, nombreBaseDeDatos))
	if err != nil {
		return nil, err
	}
	return db, nil

}*/

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

func main() {
	/*db, err := connectionDatabase()
	if err != nil {
		fmt.Printf("Error obteniendo base de datos: %v", err)
		return
	}
	// Terminar conexión al terminar función
	defer db.Close()

	// Ahora vemos si tenemos conexión
	err = db.Ping()
	if err != nil {
		fmt.Printf("Error conectando: %v", err)
		return
	}*/

	router := mux.NewRouter()
	enableCORS(router)

	/*PETICION GET INIT*/
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Hola, bienvenido a mi API REST en Go!")
	}).Methods("GET")

	/*PETICION POST PARA CALCULAR OPERACIONES*/
	router.HandleFunc("/calculate", func(w http.ResponseWriter, r *http.Request) {

		var op operation
		var resultado float64

		// Decodifica los datos recibidos en el cuerpo de la petición como JSON
		err := json.NewDecoder(r.Body).Decode(&op)

		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		switch op.Simbolo {
		case "+":
			resultado = float64(op.Numero1) + float64(op.Numero2)
		case "-":
			resultado = float64(op.Numero1) - float64(op.Numero2)
		case "/":
			resultado = float64(op.Numero1) / float64(op.Numero2)
			if op.Numero2 == 0 {
				resultado = 0
			}
		case "*":
			resultado = float64(op.Numero1) * float64(op.Numero2)

		}

		response := Response{Valor: resultado}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(response)
	}).Methods("POST")

	fmt.Println("API iniciado en el puerto 8080")
	err := http.ListenAndServe(":8080", router)
	if err != nil {
		fmt.Println(err)
	}

}
