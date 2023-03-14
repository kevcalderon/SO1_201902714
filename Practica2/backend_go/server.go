package main

import (
	"encoding/json"
	"fmt"
	"os/exec"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type RAM struct {
	TotalRam string `json:"totalram"`
	FreeRam  string `json:"freeram"`
}

/*
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

}*/

func main() {
	/*db, err := connectionDatabase()
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
	}*/

	i := 0
	for i < 10 {
		// MODULO DE RAM
		cmd := exec.Command("sh", "-c", "cat /proc/ram_201902714")
		out, err := cmd.CombinedOutput()
		if err != nil {
			fmt.Println(err)
		}
		output := string(out[:])
		var ram RAM
		json.Unmarshal([]byte(output), &ram)
		fmt.Println(output)

		time.Sleep(1 * time.Second)

		/*
			select Datos
				ram = output1
				cpu = output2
				detalle = ouput3

			actualizar siempre al where id=1
		*/
	}

}
