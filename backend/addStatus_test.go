package main

import (
	"bytes"
	"backend/endpoints"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

// TestAddStatus tests the watch status creation endpoint
func TestAddStatus(t *testing.T) {
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

	// Create test status data
	testUserID := 999
	testShowID := "tt9999999"
	testStatus := float32(2.0) // Assuming status is a float like 1.0, 2.0, etc.

	testStatusData := map[string]interface{}{
		"userID": testUserID,
		"showID": testShowID,
		"status": testStatus,
	}
	jsonData, err := json.Marshal(testStatusData)
	assert.NoError(t, err)

	// Create a test request with the JSON data
	req, _ := http.NewRequest("POST", "/watchlist", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()

	// Serve the request
	router.ServeHTTP(resp, req)

	// Check response status code
	assert.Equal(t, http.StatusOK, resp.Code)
	t.Logf("PASS: Response status code is %d", resp.Code)

	// Verify the status was added to the database
	var dbStatus float32
	err = db.QueryRow("SELECT status FROM WatchingStatus WHERE userID = ? AND showID = ?", 
		testUserID, testShowID).Scan(&dbStatus)
	assert.NoError(t, err)
	assert.Equal(t, testStatus, dbStatus)
	t.Logf("PASS: Status was successfully added to the database")

	// Clean up test data
	_, err = db.Exec("DELETE FROM WatchingStatus WHERE userID = ? AND showID = ?", 
		testUserID, testShowID)
	assert.NoError(t, err)
}