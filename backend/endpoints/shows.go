package endpoints

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

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
		LEFT JOIN oldRatings
		ON series.tconst = oldRatings.tconst
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
