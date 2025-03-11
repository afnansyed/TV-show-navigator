package main

import (
	"database/sql"
	"net/http"
	"strconv"

	"backend/endpoints"

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
	endpoints.RegisterShowEndpoints(db, router)
	router.GET("/ratings/best", getBestRating)
	router.GET("/episodes/:parentTconst", getShowEpisodes)
	router.POST("/users", createUser)
	router.GET("/users/:id", getUser)
	router.GET("/users/all", getAllUsers)
	router.DELETE("/users/:id", deleteUser)
	router.GET("/validateUser", validateUser)

	//port to run backend from
	router.Run(":8080")
}

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

func createUser(c *gin.Context) {
	type User struct {
		// json tag to de-serialize json body
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var newUser User

	// Call BindJSON to bind the received JSON to struct
	if err := c.BindJSON(&newUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// modify table to add new user
	statement := `
		INSERT INTO Users (Username, Password)
		VALUES(?, ?)
	`
	_, err := db.Exec(statement, newUser.Username, newUser.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	c.JSON(http.StatusOK, gin.H{})
}

func deleteUser(c *gin.Context) {
	userID := c.Param("id")

	query := `
		SELECT *
		FROM Users
		WHERE rowid == ?
	`
	statement := `
		DELETE
		FROM Users
		WHERE rowid == ?
	`
	//query row data to be deleted
	rows, err := db.Query(query, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	//store data to be deleted
	var username, password string
	rows.Next()
	if err = rows.Scan(&username, &password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	rows.Close()

	//delete row
	_, err = db.Exec(statement, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"username": username, "password": password})
}

func getUser(c *gin.Context) {
	userID := c.Param("id")

	query := `
		SELECT *
		FROM Users
		WHERE rowid == ?
	`

	//query row data to be deleted
	rows, err := db.Query(query, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()
	//store data to be deleted
	var username, password string
	rows.Next()
	if err = rows.Scan(&username, &password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"username": username, "password": password})
}

func validateUser(c *gin.Context) {
	username := c.Query("username")
	password := c.Query("password")

	if len(username) == 0 || len(password) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "username or password variables in api call is missing"})
		return
	}

	query := `
		SELECT rowid
		FROM Users
		WHERE
			Username LIKE ? AND
			Password LIKE ?
	`
	rows, err := db.Query(query, username, password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	//if query returns something, return rowid of first row (should only be 1)
	if rows.Next() {
		var rowid int
		if err := rows.Scan(&rowid); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"rowid": rowid})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "That user does not exist in the database"})
	}
}

func getAllUsers(c *gin.Context) {
	query := `
		SELECT rowid, *
		FROM Users
	`
	rows, err := db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var users []gin.H
	for rows.Next() {
		var (
			rowid    int
			username string
			password string
		)
		if err := rows.Scan(&rowid, &username, &password); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		users = append(users, gin.H{
			"rowid":    rowid,
			"username": username,
			"password": password,
		})
	}

	c.JSON(http.StatusOK, users)
}
