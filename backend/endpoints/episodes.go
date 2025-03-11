package endpoints

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// api callback func that queries database for all episodes of a specific show
func getShowEpisodes(c *gin.Context) {
	parentTconst := c.Param("parentTconst")

	// Query to get all episodes for a specific show
	query := `
        SELECT * 
        FROM episodes 
        WHERE parentTconst = ?
        ORDER BY seasonNumber, episodeNumber
	`
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

		//convert value to int datatype
		seasonNumberInt, err := strconv.Atoi(seasonNumber)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		//convert value to int datatype
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
