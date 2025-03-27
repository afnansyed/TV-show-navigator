package main

import (
	"database/sql"
	"net/http"
	"net/http/httptest"
	"testing"
	"encoding/json"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

// TestGetAllUsers tests the getAllUsers function
func TestGetAllUsers(t *testing.T) {
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
	router.GET("/users/all", getAllUsers)

	// Create test users in the database
	testUsers := []map[string]string{
		{"username": "testuser1", "password": "testpassword1"},
		{"username": "testuser2", "password": "testpassword2"},
	}
	for _, user := range testUsers {
		_, err = db.Exec("INSERT INTO Users (Username, Password) VALUES (?, ?)", user["username"], user["password"])
		assert.NoError(t, err)
	}

	// Create a test request
	req, _ := http.NewRequest("GET", "/users/all", nil)
	resp := httptest.NewRecorder()

	// Serve the request
	router.ServeHTTP(resp, req)

	// Check response status code
	assert.Equal(t, http.StatusOK, resp.Code)
	t.Logf("PASS: Response status code is %d", resp.Code)

	// Verify the response body
	var responseBody []map[string]interface{}
	err = json.Unmarshal(resp.Body.Bytes(), &responseBody)
	assert.NoError(t, err)
	assert.Len(t, responseBody, len(testUsers))
	for _, user := range responseBody {
		assert.Contains(t, user, "rowid")
		assert.Contains(t, user, "username")
		assert.Contains(t, user, "password")
	}
	t.Logf("PASS: Response body matches expected data")

	// Clean up - delete the test users
	for _, user := range testUsers {
		_, err = db.Exec("DELETE FROM Users WHERE Username = ?", user["username"])
		if err != nil {
			t.Logf("Warning: Failed to delete test user: %v", err)
		}
	}
}
