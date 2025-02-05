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

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	router.GET("/shows", getShows)
	router.GET("/shows/:id", getShow)
	router.GET("/shows/count", getShowCount)
	router.Run(":8080")
}

func getShows(c *gin.Context) {
	rows, err := db.Query("SELECT tconst, primaryTitle FROM series LIMIT 10")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var shows []gin.H
	for rows.Next() {
		var tconst string
		var primaryTitle string
		if err := rows.Scan(&tconst, &primaryTitle); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		shows = append(shows, gin.H{"tconst": tconst, "title": primaryTitle})
	}

	c.JSON(http.StatusOK, shows)
}

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
