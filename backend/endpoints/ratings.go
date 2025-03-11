package endpoints

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// api callback func that queries database for highest rated show
func getBestRating(c *gin.Context) {
	rows, err := db.Query("SELECT * FROM oldRatings ORDER BY avgRating ASC LIMIT 1")
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
