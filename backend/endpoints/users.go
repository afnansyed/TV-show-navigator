package endpoints

import (
	"backend/encryption"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

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

	//ping database to see if username or password match
	query := `
		SELECT Username
		FROM Users
		WHERE
			Username = ?
	`
	rows, err := db.Query(query, newUser.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	//if rows are returned, then match exists
	if rows.Next() {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Username already exists. Change your username to make it unique."})
		return
	}

	// encrypt password
	hash, err := encryption.HashPassword(newUser.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	fmt.Println("hash", hash)

	// modify table to add new user
	statement := `
		INSERT INTO Users (Username, Password)
		VALUES(?, ?)
	`
	_, err = db.Exec(statement, newUser.Username, hash)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
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

	//query row data
	rows, err := db.Query(query, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	//cache db results
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
		SELECT rowid, Password
		FROM Users
		WHERE
			Username LIKE ?
	`
	rows, err := db.Query(query, username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	// if query returns something, return rowid of first row (should only be 1)
	if !rows.Next() {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "That user does not exist in the database"})
		return
	}

	var rowid int
	var passHash string
	if err := rows.Scan(&rowid, &passHash); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// verify password matches hash
	if !encryption.VerifyPassword(password, passHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "password is incorrect"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"rowid": rowid})
}

// returns all users in db as JSON
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
