package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"backend/endpoints"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

// TestAddRating tests the rating creation endpoint
func TestAddRating(t *testing.T) {
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

	// Create test rating data
	testUserID := 888
	testShowID := "tt8888888"
	testRating := float32(4.5) // Assuming rating is a float

	testRatingData := map[string]interface{}{
		"userID": testUserID,
		"showID": testShowID,
		"rating": testRating,
	}
	jsonData, err := json.Marshal(testRatingData)
	assert.NoError(t, err)

	// Create a test request with the JSON data
	req, _ := http.NewRequest("POST", "/ratings", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()

	// Serve the request
	router.ServeHTTP(resp, req)

	// Check response status code
	assert.Equal(t, http.StatusOK, resp.Code)
	t.Logf("PASS: Response status code is %d", resp.Code)

	// Verify the rating was added to the database
	var dbRating float32
	err = db.QueryRow("SELECT rating FROM newRatings WHERE userID = ? AND showID = ?", 
		testUserID, testShowID).Scan(&dbRating)
	assert.NoError(t, err)
	assert.Equal(t, testRating, dbRating)
	t.Logf("PASS: Rating was successfully added to the database")

	// Clean up test data
	_, err = db.Exec("DELETE FROM newRatings WHERE userID = ? AND showID = ?", 
		testUserID, testShowID)
	assert.NoError(t, err)
}