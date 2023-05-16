package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
)

//Estructura que tendremos en lo que vamos a registrar
type Votos struct {
	Sede         int    `json:"sede"`
	Municipio    string `json:"municipio"`
	Departamento string `json:"departamento"`
	Papeleta     string `json:"papeleta"`
	Partido      string `json:"partido"`
}

func (u Votos) MarshalBinary() ([]byte, error) {
	return json.Marshal(u)
}

func (u *Votos) UnmarshalBinary(data []byte) error {
	if err := json.Unmarshal(data, &u); err != nil {
		return err
	}
	return nil
}
func handleIndex(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode("{message:Hello World}")
}

func gentENV(s string) string {
	v := os.Getenv(s)
	if v == "" {
		log.Fatalf("Fatal Error en redis pub: %s variable de entorno no seteada.\n", s)
	}
	return v
}

func main() {

	//Aca configuro la API
	enrutador := mux.NewRouter()
	enrutador.HandleFunc("/", handleIndex).Methods(http.MethodGet)
	enrutador.HandleFunc("/voto", ingresarvotos).Methods(http.MethodPost)
	srv := &http.Server{
		Addr:    ":4001",
		Handler: enrutador,
	}

	fmt.Println("Listening...")
	srv.ListenAndServe()

}

//Funcion que nos va a publicar los votos.
func ingresarvotos(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Headers", "authentication,content-type")

	redisClient := redis.NewClient(&redis.Options{
		Addr:     "redis:6379", //Host de redis
		Password: "admin",      //Password que guardé en redis.conf
		DB:       0,
	})
	//Hago ping al server Redis y reviso si no ha pasado algún error
	err := redisClient.Ping(context.Background()).Err()
	if err != nil {
		//Espero 3 segundos y espero para que redis se inicie
		time.Sleep(3 * time.Second)
		err := redisClient.Ping(context.Background()).Err()
		if err != nil {
			panic(err)
		}
	}

	var voto Votos //Creo mi objeto voto
	err = json.NewDecoder(r.Body).Decode(&voto)
	if err != nil {
		json.NewEncoder(w).Encode("Cuerpo de peticiòn no valido")
		return
	}

	data, err := voto.MarshalBinary()
	if err != nil {
		panic(err)
	}

	//Genero un nuevo contexto de background que usaremos
	ctx := context.Background()
	//publico el voto generado en el canal "new_vote"
	err = redisClient.Publish(ctx, "new_vote", data).Err()
	if err != nil {
		panic(err)
	}

	_, err = redisClient.LPush(ctx, "new_vote_messages", data).Result()
	if err != nil {
		panic(err)
	}

	if err := redisClient.HIncrBy(ctx, "sedeCount", strconv.Itoa(voto.Sede), 1).Err(); err != nil {
		panic(err)
	}
	json.NewEncoder(w).Encode(voto)

}
