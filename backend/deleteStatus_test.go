package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"backend/endpoints"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

// TestDeleteStatus tests the watch status deletion endpoint
func TestDeleteStatus(t *testing.T) {
	// Initialize the database connection
	var err error
	db, err = sql.Open("sqlite3", "shows.db") 
	if err != nil {
		t.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Initialize Gin in test mode
	gin.SetMode(gin.TestMode)

	// Set up the router with endpoints registered
	router := gin.Default()
	endpoints.RegisterEndpoints(router)

	// First, insert a test status that we'll delete
	testUserID := 999
	testShowID := "tt9999999"
	testStatus := float32(2.0)
	
	insertStmt := `
		INSERT INTO WatchingStatus (userID, showID, status)
		VALUES(?, ?, ?)
	`
	_, err = db.Exec(insertStmt, testUserID, testShowID, testStatus)
	assert.NoError(t, err)
	t.Logf("Created test status for userID: %d, showID: %s", testUserID, testShowID)

	// Create a test request to delete the status
	req, _ := http.NewRequest("DELETE", fmt.Sprintf("/watchlist?userID=%d&showID=%s", testUserID, testShowID), nil)
	resp := httptest.NewRecorder()

	// Serve the request
	router.ServeHTTP(resp, req)

	// Check response status code
	assert.Equal(t, http.StatusOK, resp.Code)
	t.Logf("PASS: Response status code is %d", resp.Code)

	// Verify the response contains the deleted status data
	var responseBody map[string]interface{}
	err = json.Unmarshal(resp.Body.Bytes(), &responseBody)
	assert.NoError(t, err)
	
	// Check if the response contains expected data
	assert.Equal(t, float64(testUserID), responseBody["userID"])
	assert.Equal(t, testShowID, responseBody["showID"])
	assert.Equal(t, float64(testStatus), responseBody["status"])
	t.Logf("PASS: Response body contains correct status data")

	// Verify the status was deleted from the database
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM WatchingStatus WHERE userID = ? AND showID = ?", 
		testUserID, testShowID).Scan(&count)
	assert.NoError(t, err)
	assert.Equal(t, 0, count)
	t.Logf("PASS: Status was successfully deleted from the database")
}