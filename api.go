package main

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"net/http"
)

var db *sql.DB

func main() {
	var err error
	db, err = sql.Open("sqlite3", "./backend/shows.db")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	router := gin.Default()
	router.GET("/shows", getShows)
	router.GET("/shows/:id", getShow)
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
