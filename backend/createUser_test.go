// createUser_test.go
package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

// TestCreateUser tests the createUser function
func TestCreateUser(t *testing.T) {
	// Set up test database connection
	var err error
	db, err = sql.Open("sqlite3", "shows.db")
	if err != nil {
		t.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Setting up the Gin router
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/users", createUser)

	// Create test user data
	testUser := map[string]string{
		"username": "testuser123",
		"password": "testpassword123",
	}
	
	// Convert test data to JSON
	jsonData, err := json.Marshal(testUser)
	assert.NoError(t, err)
	
	// Create a test request with JSON body
	req, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	
	// Serve the request
	router.ServeHTTP(resp, req)
	
	// Check response status code
	assert.Equal(t, http.StatusOK, resp.Code)
	t.Logf("PASS: Response status code is %d", resp.Code)
	
	// Verify the user was created in the database
	var username, password string
	err = db.QueryRow("SELECT Username, Password FROM Users WHERE Username = ?", testUser["username"]).Scan(&username, &password)
	assert.NoError(t, err)
	assert.Equal(t, testUser["username"], username)
	assert.Equal(t, testUser["password"], password)
	t.Logf("PASS: User was successfully created in database")
	
	// Clean up - delete the test user
	_, err = db.Exec("DELETE FROM Users WHERE Username = ?", testUser["username"])
	if err != nil {
		t.Logf("Warning: Failed to delete test user: %v", err)
	}
}
