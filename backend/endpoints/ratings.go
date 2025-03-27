package endpoints

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// insert new rating or update existing rating in db
func addRating(c *gin.Context) {
	type Rating struct {
		// json tag to de-serialize json body
		UserID int     `json:"userID"`
		ShowID string  `json:"showID"`
		Rating float32 `json:"rating"`
	}

	var newRating Rating

	// Call BindJSON to bind the received JSON to struct
	if err := c.BindJSON(&newRating); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// modify table to add new user
	statement := `
		INSERT INTO newRatings (userID, showID, rating)
		VALUES(?, ?, ?)
	`
	_, err := db.Exec(statement, newRating.UserID, newRating.ShowID, newRating.Rating)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}

func deleteRating(c *gin.Context) {
	type UserShow struct {
		// json tag to de-serialize json body
		UserID int    `json:"userID"`
		ShowID string `json:"showID"`
	}

	var userShow UserShow

	// Call BindJSON to bind the received JSON to struct
	if err := c.BindJSON(&userShow); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	query := `
		SELECT rating
		FROM newRatings
		WHERE userID == ?
		AND showID == ?
	`
	statement := `
		DELETE *
		FROM newRatings
		WHERE userID == ?
		AND showID == ?
	`
	//query row data to be deleted
	rows, err := db.Query(query, userShow.UserID, userShow.ShowID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//store data to be deleted
	var rating float32
	rows.Next()
	if err = rows.Scan(&rating); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	rows.Close()

	//delete row
	_, err = db.Exec(statement, userShow.UserID, userShow.ShowID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"userID": userShow.UserID, "showID": userShow.ShowID, "rating": rating})
}

func getRatings(c *gin.Context) {
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
			getRating(c, userIDInt, showID)
		} else {
			//just get all ratings for that user
			getRatingsFromUser(c, userIDInt)
		}
	} else if showID != "" {
		//if only showID defined, get all ratings of that show
		getRatingsFromShow(c, showID)
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "neither userID nor showID provided"})
		return
	}
}

func getRating(c *gin.Context, userID int, showID string) {
	query := `
		SELECT rating
		FROM newRatings
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

	//store data to be returned in single obj
	var ratingVal float32

	rows.Next()
	if err = rows.Scan(&ratingVal); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rating := gin.H{
		"userID": userID,
		"showID": showID,
		"rating": ratingVal,
	}

	c.JSON(http.StatusOK, rating)
}

func getRatingsFromUser(c *gin.Context, userID int) {
	query := `
		SELECT showID, rating
		FROM newRatings
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
	var ratings []gin.H
	for rows.Next() {
		var showID string
		var rating float32

		if err = rows.Scan(&showID, &rating); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		ratings = append(ratings, gin.H{
			"showID": showID,
			"rating": rating,
		})
	}

	c.JSON(http.StatusOK, ratings)
}

func getRatingsFromShow(c *gin.Context, showID string) {
	query := `
		SELECT userID, rating
		FROM newRatings
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
	var ratings []gin.H
	for rows.Next() {
		var userID string
		var rating float32

		if err = rows.Scan(&userID, &rating); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		ratings = append(ratings, gin.H{
			"userID": userID,
			"rating": rating,
		})
	}

	c.JSON(http.StatusOK, ratings)
}
