package endpoints

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// insert new status or update existing status in db
func addStatus(c *gin.Context) {
	type WatchStatus struct {
		// json tag to de-serialize json body
		UserID int     `json:"userID"`
		ShowID string  `json:"showID"`
		Status float32 `json:"status"`
	}

	var newStatus WatchStatus

	// Call BindJSON to bind the received JSON to struct
	if err := c.BindJSON(&newStatus); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// modify table to add/replace status
	statement := `
		INSERT OR REPLACE INTO WatchingStatus (userID, showID, status)
		VALUES(?, ?, ?)
	`
	_, err := db.Exec(statement, newStatus.UserID, newStatus.ShowID, newStatus.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}

func deleteStatus(c *gin.Context) {
	userID := c.Query("userID")
	showID := c.Query("showID")

	query := `
		SELECT status
		FROM WatchingStatus
		WHERE userID == ?
		AND showID == ?
	`
	statement := `
		DELETE
		FROM WatchingStatus
		WHERE userID == ?
		AND showID == ?
	`
	//query row data to be deleted
	rows, err := db.Query(query, userID, showID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//store data to be deleted
	var status int
	rows.Next()
	if err = rows.Scan(&status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	rows.Close()

	//delete row
	_, err = db.Exec(statement, userID, showID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"userID": userID, "showID": showID, "status": status})
}

func getWatchlist(c *gin.Context) {
	userID := c.Query("userID")
	showID := c.Query("showID")

	if userID != "" {
		//conv string userID to int
		userIDInt, err := strconv.Atoi(userID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		if showID != "" {
			//if both defined, get single rating
			getWatchingStatus(c, userIDInt, showID)
		} else {
			//just get all ratings for that user
			getWatchlistFromUser(c, userIDInt)
		}
	} else if showID != "" {
		//if only showID defined, get all ratings of that show
		getWatchingStatusesForShow(c, showID)
	} else {
		getAllWatchlists(c)
	}
}

func getAllWatchlists(c *gin.Context) {
	query := `
	SELECT userID, showID, status
	FROM WatchingStatus
	ORDER BY userID
`

	//query row data to be deleted
	rows, err := db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	//store data to be returned in single obj
	var watchingStatuses []gin.H

	for rows.Next() {
		var (
			userID int
			showID string
			status int
		)

		if err = rows.Scan(&userID, &showID, &status); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		watchingStatuses = append(watchingStatuses, gin.H{
			"userID": userID,
			"showID": showID,
			"status": status,
		})
	}

	c.JSON(http.StatusOK, watchingStatuses)
}

func getWatchingStatus(c *gin.Context, userID int, showID string) {
	query := `
		SELECT status
		FROM WatchingStatus
		WHERE userID == ?
		AND showID == ?
	`

	//query row data to be deleted
	rows, err := db.Query(query, userID, showID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var status int

	rows.Next()
	if err = rows.Scan(&status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	watchingStatus := gin.H{
		"userID": userID,
		"showID": showID,
		"status": status,
	}

	c.JSON(http.StatusOK, watchingStatus)
}

func getWatchlistFromUser(c *gin.Context, userID int) {
	query := `
		SELECT showID, status
		FROM WatchingStatus
		WHERE userID == ?
	`

	//query row data to be deleted
	rows, err := db.Query(query, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	//store data to be returned in single obj
	var watchlist []gin.H
	for rows.Next() {
		var showID string
		var status int

		if err = rows.Scan(&showID, &status); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		watchlist = append(watchlist, gin.H{
			"showID": showID,
			"status": status,
		})
	}

	c.JSON(http.StatusOK, watchlist)
}

func getWatchingStatusesForShow(c *gin.Context, showID string) {
	query := `
		SELECT userID, status
		FROM WatchingStatus
		WHERE showID == ?
	`

	//query row data to be deleted
	rows, err := db.Query(query, showID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	//store data to be returned in single obj
	var statuses []gin.H
	for rows.Next() {
		var userID int
		var status int

		if err = rows.Scan(&userID, &status); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		statuses = append(statuses, gin.H{
			"userID": userID,
			"status": status,
		})
	}

	c.JSON(http.StatusOK, statuses)
}
