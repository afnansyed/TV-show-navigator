package main

import (
	"database/sql"

	"backend/endpoints"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func main() {
	var err error
	db, err = sql.Open("sqlite3", "shows.db")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	router := gin.Default()

	//trust all proxies
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	//list of api endpoints
	endpoints.RegisterEndpoints(router)

	defer endpoints.CloseDB()

	//port to run backend from
	router.Run(":8080")
}
