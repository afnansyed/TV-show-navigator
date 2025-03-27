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

// TestGetAllComments tests the /comments endpoint
func TestGetAllComments(t *testing.T) {
	// Initialize the database connection
	var err error
	db, err = sql.Open("sqlite3", "shows.db") // Using latest db file
	if err != nil {
		t.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Initialize Gin in test mode
	gin.SetMode(gin.TestMode)

	// Set up the router
	router := gin.Default()
	router.GET("/comments", getAllComments)

	// Create a test request
	req, _ := http.NewRequest("GET", "/comments", nil)
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

	// Check if the response contains expected data (simplified check)
	assert.NotEmpty(t, responseBody)
	t.Logf("PASS: Response body contains comments")
}
