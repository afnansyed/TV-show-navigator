package main

import (
	"backend/endpoints"
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

	// Setting up the Gin router with endpoints registered
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	endpoints.RegisterEndpoints(router)

	// Create test users in the database
	testUsers := []map[string]string{
		{"username": "testuser1", "password": "testpassword1"},
		{"username": "testuser2", "password": "testpassword2"},
	}
	var insertedUserIDs []int
	for _, user := range testUsers {
		_, err = db.Exec("INSERT INTO Users (Username, Password) VALUES (?, ?)", user["username"], user["password"])
		assert.NoError(t, err)

		// Get the rowid of the inserted user
		var rowid int
		err = db.QueryRow("SELECT rowid FROM Users WHERE Username = ?", user["username"]).Scan(&rowid)
		assert.NoError(t, err)
		insertedUserIDs = append(insertedUserIDs, rowid)
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

	// Check for each test user in the response
	for _, testUser := range testUsers {
		found := false
		for _, user := range responseBody {
			if user["username"].(string) == testUser["username"] {
				found = true
				break
			}
		}
		assert.True(t, found, "Test user %s not found in response", testUser["username"])
	}
	t.Logf("PASS: All test users found in response")

	// Clean up - delete the test users
	for _, rowid := range insertedUserIDs {
		_, err = db.Exec("DELETE FROM Users WHERE rowid = ?", rowid)
		assert.NoError(t, err)
	}
}
