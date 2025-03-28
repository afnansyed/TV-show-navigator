package endpoints

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// getAllComments retrieves all comments from the database.
func getAllComments(c *gin.Context) {
	userIDStr := c.Query("userID")
	showID := c.Query("showID")

	var query string
	var args []interface{}

	if userIDStr != "" {
		userID, err := strconv.Atoi(userIDStr)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		if showID != "" {
			// Get comments for a specific user and show
			query = `
				SELECT commentID, userID, showID, timestamp, comment
				FROM Comments
				WHERE userID == ? AND showID == ?
			`
			args = []interface{}{userID, showID}
		} else {
			// Get all comments for a specific user
			query = `
				SELECT commentID, userID, showID, timestamp, comment
				FROM Comments
				WHERE userID == ?
			`
			args = []interface{}{userID}
		}
	} else if showID != "" {
		// Get all comments for a specific show
		query = `
			SELECT commentID, userID, showID, timestamp, comment
			FROM Comments
			WHERE showID == ?
		`
		args = []interface{}{showID}
	} else {
		// Get all comments
		query = `
			SELECT commentID, userID, showID, timestamp, comment
			FROM Comments
		`
		args = []interface{}{}
	}

	// Query the database
	rows, err := db.Query(query, args...)
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
