package endpoints

import (
	
	"net/http"
	"github.com/gin-gonic/gin"
)

// getAllComments retrieves all comments from the database.
func getAllComments(c *gin.Context) {
	query := `
		SELECT commentID, userID, showID, timestamp, comment
		FROM Comments
	`

	// Query the database
	rows, err := db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	// Create a slice to hold all comments
	var comments []gin.H
	for rows.Next() {
		var (
			commentID int
			userID    int
			showID    string
			timestamp string
			comment   string
		)

		// Scan each row into variables
		if err := rows.Scan(&commentID, &userID, &showID, &timestamp, &comment); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Append each comment to the slice
		comments = append(comments, gin.H{
			"commentID": commentID,
			"userID":    userID,
			"showID":    showID,
			"timestamp": timestamp,
			"comment":   comment,
		})
	}

	c.JSON(http.StatusOK, comments)
}
