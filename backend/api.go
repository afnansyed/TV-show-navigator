package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

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
	router.GET("/episodes/:parentTconst", getShowEpisodes)

	//port to run backend from
	router.Run(":8080")
}

// api callback func that queries database for show information
func getShows(c *gin.Context) {
	//filter params
	titleContains := c.DefaultQuery("titleContains", "_")
	isAdult := c.DefaultQuery("isAdult", "TRUE,FALSE")
	genre := c.DefaultQuery("genre", "_")                      // types: Comedy, Mystery, Talk-Show, Reality-TV, Musical, Music, Biography, Animation, News, Horror, Western, History, Family, Action, Sci-Fi, Crime, Adventure, Adult, Drama, Sport, Thriller, Game-Show, War, Documentary, Short, Fantasy
	startYearStart := c.DefaultQuery("startYearStart", "1927") // lower bound in dataset
	startYearEnd := c.DefaultQuery("startYearEnd", "2029")     // upper bound in dataset
	limit := c.DefaultQuery("limit", "20")                     // LIMIT must have numerical bound on it

	//assemble query
	query := fmt.Sprintf(`
		SELECT series.tconst, primaryTitle, originalTitle, isAdult, genres, startYear, endYear, runtimeMinutes, avgRating, votes
		FROM series
		LEFT JOIN ratings
		ON series.tconst = ratings.tconst
		WHERE
		  (primaryTitle LIKE '%%%s%%'
		OR originalTitle LIKE '%%%s%%')
		AND isAdult IN (%s)
		AND genres LIKE '%%%s%%'
		AND startYear BETWEEN %s AND %s
		LIMIT %s;
	`, titleContains, titleContains, isAdult, genre, startYearStart, startYearEnd, limit)

	//query db
	rows, err := db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	//create payload to return to client
	var shows []gin.H
	for rows.Next() {
		var (
			tconst         string
			primaryTitle   string
			originalTitle  string
			isAdult        string
			genres         string
			startYear      int
			endYear        int
			runtimeMinutes int
			avgRating      sql.NullFloat64
			votes          sql.NullInt32
		)

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

// api callback func that queries database for all episodes of a specific show
func getShowEpisodes(c *gin.Context) {
	parentTconst := c.Param("parentTconst")

	// Query to get all episodes for a specific show
	query := `
        SELECT tconst, parentTconst, seasonNumber, episodeNumber 
        FROM episodes 
        WHERE parentTconst = ?
        ORDER BY seasonNumber, episodeNumber`

	rows, err := db.Query(query, parentTconst)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	// Create payload to return to client
	var episodes []gin.H
	for rows.Next() {
		var (
			tconst        string
			parentTconst  string
			seasonNumber  string
			episodeNumber string
		)

		if err := rows.Scan(&tconst, &parentTconst, &seasonNumber, &episodeNumber); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		seasonNumberInt, err := strconv.Atoi(seasonNumber)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		episodeNumberInt, err := strconv.Atoi(episodeNumber)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		episodes = append(episodes, gin.H{
			"tconst":        tconst,
			"parentTconst":  parentTconst,
			"seasonNumber":  seasonNumberInt,
			"episodeNumber": episodeNumberInt,
		})
	}

	if len(episodes) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No episodes found for this show"})
		return
	}

	c.JSON(http.StatusOK, episodes)
}
