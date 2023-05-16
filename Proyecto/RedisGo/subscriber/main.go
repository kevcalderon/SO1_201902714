package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/go-redis/redis/v8"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	db, err := getDataBase()
	if err != nil {
		fmt.Printf("Error obteniendo base de datos: %v", err)
		return
	}

	// Termino la conexión al terminar función
	defer db.Close()

	err = db.Ping()
	if err != nil {
		fmt.Println("Error conectando :", err)
		return
	}
	fmt.Println("Conectado correctamente")

	redisClient := redis.NewClient(&redis.Options{
		Addr:     "redis:6379", //Host de redis
		Password: "admin",      //Password que guardé en redis.conf
		DB:       0,
	})

	err = redisClient.Ping(context.Background()).Err()
	if err != nil {
		time.Sleep(3 * time.Second)
		err := redisClient.Ping(context.Background()).Err()
		if err != nil {
			panic(err)
		}
	}

	ctx := context.Background()
	topic := redisClient.Subscribe(ctx, "new_vote")

	channel := topic.Channel()

	for msg := range channel {
		u := &User{}

		err := u.UnmarshalBinary([]byte(msg.Payload))
		if err != nil {
			panic(err)
		}

		_, err = db.Exec("INSERT INTO Voto (sede,municipio,departamento,papeleta,partido) VALUES('" + strconv.Itoa(u.Sede) + "','" + u.Municipio + "', '" + u.Departamento + "', '" + u.Papeleta + "', '" + u.Partido + "')")
		if err != nil {
			fmt.Println("Error al guardar mensaje en MySQL", err)
			continue
		}
		fmt.Println(u)

	}
}

type User struct {
	Sede         int
	Municipio    string
	Departamento string
	Papeleta     string
	Partido      string
}

func (u User) MarshalBinary() ([]byte, error) {
	return json.Marshal(u)
}

func (u *User) UnmarshalBinary(data []byte) error {
	if err := json.Unmarshal(data, u); err != nil {
		return err
	}
	return nil
}

func (u *User) String() string {
	return "Municipio: " + u.Municipio + " Departamento: " + u.Departamento + " Papeleta: " + u.Papeleta + " Partido: " + u.Partido
}

func getDataBase() (db *sql.DB, e error) {
	usuario := "root"
	pass := "root"
	host := "tcp(mysqldb:3306)"
	namedb := "pruebaDB"
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@%s/%s", usuario, pass, host, namedb))
	if err != nil {
		return nil, err
	}
	return db, nil
}
