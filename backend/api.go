package main

import (
	"database/sql"
	"fmt"
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

	//trust all proxies
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

// api callback func that queries database for show information
func getShows(c *gin.Context) {
	//filter params
	titleContains := c.DefaultQuery("titleContains", "'*'")
	isAdult := c.DefaultQuery("isAdult", "(TRUE,FALSE)")
	genre := c.DefaultQuery("genre", "'*'")                    // types: Comedy, Mystery, Talk-Show, Reality-TV, Musical, Music, Biography, Animation, News, Horror, Western, History, Family, Action, Sci-Fi, Crime, Adventure, Adult, Drama, Sport, Thriller, Game-Show, War, Documentary, Short, Fansary
	startYearStart := c.DefaultQuery("startYearStart", "1927") // lower bound in dataset
	startYearEnd := c.DefaultQuery("startYearEnd", "2029")     // upper bound in dataset
	limit := c.DefaultQuery("limit", "NULL")                   // "LIMIT NULL" means no limit on rows returned

	query := fmt.Sprintf(`
		SELECT series.tconst, primaryTitle, originalTitle, isAdult, genres, startYear, endYear, runtimeMinues, avgRating, votes
		FROM series
		LEFT JOIN ratings
		ON series.tconst = ratings.tconst
		WHERE
		  (Contains(primaryTitle, %s)
		OR Contains(originalTitle, %s))
		AND isAdult IN %s
		AND Contains(genres, %s)
		AND startYear BETWEEN %s AND %s
		LIMIT %s
	`, titleContains, titleContains, isAdult, genre, startYearStart, startYearEnd, limit)

	rows, err := db.Query(query)
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
		var originalTitle string
		var isAdult string
		var genres string
		var startYear int
		var endYear int
		var runtimeMinutes int
		var avgRating float32
		var votes int

		if err := rows.Scan(&tconst, &primaryTitle, &originalTitle, &isAdult, &genres, &startYear, &endYear, &runtimeMinutes, &avgRating, &votes); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		shows = append(shows, gin.H{
			"tconst":         tconst,
			"title":          primaryTitle,
			"originalTitle":  originalTitle,
			"isAdult":        isAdult,
			"genres":         genres,
			"startYear":      startYear,
			"endYear":        endYear,
			"runtimeMinutes": runtimeMinutes,
			"avgRating":      avgRating,
			"votes":          votes,
		})
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
