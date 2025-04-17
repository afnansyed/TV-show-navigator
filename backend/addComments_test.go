package main

import (
	"backend/endpoints"
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

// TestAddComment tests the comment creation endpoint
func TestAddComment(t *testing.T) {
	// Initialize the database connection
	var err error
	db, err = sql.Open("sqlite3", "shows.db") // Use your actual database file
	if err != nil {
		t.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Initialize Gin in test mode
	gin.SetMode(gin.TestMode)

	// Set up the router with endpoints registered
	router := gin.Default()
	endpoints.RegisterEndpoints(router)

	// Create test comment data
	testComment := map[string]interface{}{
		"userID":  1,
		"showID":  "tt1234567",
		"comment": "This is a test comment",
	}
	jsonData, err := json.Marshal(testComment)
	assert.NoError(t, err)

	// Create a test request with the JSON data
	req, _ := http.NewRequest("POST", "/comments", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()

	// Serve the request
	router.ServeHTTP(resp, req)

	// Check response status code
	assert.Equal(t, http.StatusOK, resp.Code)
	t.Logf("PASS: Response status code is %d", resp.Code)

	// Verify the comment was added to the database
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM Comments WHERE userID = ? AND showID = ? AND comment = ?",
		testComment["userID"], testComment["showID"], testComment["comment"]).Scan(&count)
	assert.NoError(t, err)
	assert.Equal(t, 1, count)
	t.Logf("PASS: Comment was successfully added to the database")

	// Clean up the test data
	_, err = db.Exec("DELETE FROM Comments WHERE userID = ? AND showID = ? AND comment = ?",
		testComment["userID"], testComment["showID"], testComment["comment"])
	assert.NoError(t, err)
}