package endpoints

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

var db *sql.DB

// register all endpoints for api
func RegisterEndpoints(router *gin.Engine) {
	var err error
	db, err = sql.Open("sqlite3", "../shows.db")
	if err != nil {
		panic(err)
	}

	router.GET("/shows", getShows)
	router.GET("/shows/:id", getShow)
	router.GET("/shows/count", getShowCount)
	router.GET("/ratings/best", getBestRating)
	router.GET("/episodes/:parentTconst", getShowEpisodes)
	router.POST("/users", createUser)
	router.GET("/users/:id", getUser)
	router.GET("/users/all", getAllUsers)
	router.DELETE("/users/:id", deleteUser)
	router.GET("/validateUser", validateUser)
}

func CloseDB() {
	db.Close()
}
