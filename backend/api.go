package main

import (
	"database/sql"
	"net/http"

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

	//allow API access to all addresses
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	//list of api endpoints
	router.GET("/shows", getShows)
	router.GET("/shows/:id", getShow)
	router.GET("/shows/count", getShowCount)
	router.GET("/ratings/best", getBestRating)

	//port to run backend from
	router.Run(":8080")
}

// api callback func that queries database for first 10 shows
func getShows(c *gin.Context) {
	rows, err := db.Query("SELECT tconst, primaryTitle, startYear FROM series LIMIT 10")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	//create payload to return to client
	var shows []gin.H
	for rows.Next() {
		var tconst string
		var primaryTitle string
		var startYear int
		if err := rows.Scan(&tconst, &primaryTitle, &startYear); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		shows = append(shows, gin.H{"tconst": tconst, "title": primaryTitle, "startYear": startYear})
	}

	c.JSON(http.StatusOK, shows)
}

// api callback func that queries database for show that matches 1 string param
func getShow(c *gin.Context) {
	tconst := c.Param("id")
	var primaryTitle string
	err := db.QueryRow("SELECT primaryTitle FROM series WHERE tconst = ?", tconst).Scan(&primaryTitle)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Show not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"tconst": tconst, "title": primaryTitle})
}

// api callback func that queries database for total count of shows
func getShowCount(c *gin.Context) {
	rows, err := db.Query("SELECT COUNT(*) FROM series")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var count int
	rows.Next()
	rows.Scan(&count)
	c.JSON(http.StatusOK, gin.H{"COUNT": count})
}

// api callback func that queries database for highest rated show
func getBestRating(c *gin.Context) {
	rows, err := db.Query("SELECT * FROM ratings ORDER BY avgRating ASC LIMIT 1")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var tconst string
	var avgRating float32
	var votes int
	rows.Next()
	rows.Scan(&tconst, &avgRating, &votes)
	c.JSON(http.StatusOK, gin.H{"tconst": tconst, "avgRating": avgRating, "votes": votes})
}
