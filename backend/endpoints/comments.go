package endpoints

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// getAllComments retrieves all comments from the database.
func getComments(c *gin.Context) {
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

// insert new comment to db
func addComment(c *gin.Context) {
	type Comment struct {
		// json tag to de-serialize json body
		UserID  int    `json:"userID"`
		ShowID  string `json:"showID"`
		Message string `json:"comment"`
	}

	var newComment Comment

	// Call BindJSON to bind the received JSON to struct
	if err := c.BindJSON(&newComment); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// modify table to add new user
	statement := `
		INSERT INTO Comments (userID, showID, comment)
		VALUES(?, ?, ?)
	`
	_, err := db.Exec(statement, newComment.UserID, newComment.ShowID, newComment.Message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}

func deleteComment(c *gin.Context) {
	commentID := c.Query("id")

	query := `
		SELECT userID, showID, timestamp, comment
				FROM Comments
				WHERE commentID = ?
	`
	statement := `
		DELETE FROM Comments
			WHERE commentID = ?
	`
	//query row data to be deleted
	rows, err := db.Query(query, commentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//cache data before deletion
	var (
		userID    int
		showID    string
		timestamp string
		comment   string
	)
	rows.Next()
	if err = rows.Scan(&userID, &showID, &timestamp, &comment); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	rows.Close()

	//delete row
	_, err = db.Exec(statement, commentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"commentID": commentID, "userID": userID, "showID": showID, "timestamp": timestamp, "comment": comment})
}
