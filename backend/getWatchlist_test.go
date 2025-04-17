package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"backend/endpoints"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

// TestGetWatchlist tests the watchlist retrieval endpoint
func TestGetWatchlist(t *testing.T) {
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

	// Test data
	testUserID := 999
	testShowID := "tt9999999"
	testStatus := float32(2.0)
	
	// Insert test data
	insertStmt := `
		INSERT INTO WatchingStatus (userID, showID, status)
		VALUES(?, ?, ?)
	`
	_, err = db.Exec(insertStmt, testUserID, testShowID, testStatus)
	assert.NoError(t, err)
	t.Logf("Created test status for userID: %d, showID: %s", testUserID, testShowID)

	// Test cases for different parameter combinations
	testCases := []struct {
		name       string
		url        string
		checkFunc  func(t *testing.T, resp *httptest.ResponseRecorder)
	}{
		{
			name: "Get specific status by userID and showID",
			url:  fmt.Sprintf("/watchlist?userID=%d&showID=%s", testUserID, testShowID),
			checkFunc: func(t *testing.T, resp *httptest.ResponseRecorder) {
				var responseBody map[string]interface{}
				err := json.Unmarshal(resp.Body.Bytes(), &responseBody)
				assert.NoError(t, err)
				
				assert.Equal(t, float64(testUserID), responseBody["userID"])
				assert.Equal(t, testShowID, responseBody["showID"])
				assert.Equal(t, float64(testStatus), responseBody["status"])
			},
		},
		{
			name: "Get all statuses for a user",
			url:  fmt.Sprintf("/watchlist?userID=%d", testUserID),
			checkFunc: func(t *testing.T, resp *httptest.ResponseRecorder) {
				var responseBody []map[string]interface{}
				err := json.Unmarshal(resp.Body.Bytes(), &responseBody)
				assert.NoError(t, err)
				
				assert.GreaterOrEqual(t, len(responseBody), 1)
				found := false
				for _, item := range responseBody {
					if item["showID"] == testShowID {
						assert.Equal(t, float64(testStatus), item["status"])
						found = true
						break
					}
				}
				assert.True(t, found, "Test show ID not found in response")
			},
		},
		{
			name: "Get all statuses for a show",
			url:  fmt.Sprintf("/watchlist?showID=%s", testShowID),
			checkFunc: func(t *testing.T, resp *httptest.ResponseRecorder) {
				var responseBody []map[string]interface{}
				err := json.Unmarshal(resp.Body.Bytes(), &responseBody)
				assert.NoError(t, err)
				
				assert.GreaterOrEqual(t, len(responseBody), 1)
				found := false
				for _, item := range responseBody {
					if item["userID"] == float64(testUserID) {
						assert.Equal(t, float64(testStatus), item["status"])
						found = true
						break
					}
				}
				assert.True(t, found, "Test user ID not found in response")
			},
		},
		{
			name: "Get all watchlists",
			url:  "/watchlist",
			checkFunc: func(t *testing.T, resp *httptest.ResponseRecorder) {
				var responseBody []map[string]interface{}
				err := json.Unmarshal(resp.Body.Bytes(), &responseBody)
				assert.NoError(t, err)
				
				assert.GreaterOrEqual(t, len(responseBody), 1)
				found := false
				for _, item := range responseBody {
					if item["userID"] == float64(testUserID) && item["showID"] == testShowID {
						assert.Equal(t, float64(testStatus), item["status"])
						found = true
						break
					}
				}
				assert.True(t, found, "Test entry not found in response")
			},
		},
	}

	// Run the test cases
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			req, _ := http.NewRequest("GET", tc.url, nil)
			resp := httptest.NewRecorder()
			router.ServeHTTP(resp, req)
			
			assert.Equal(t, http.StatusOK, resp.Code)
			tc.checkFunc(t, resp)
		})
	}

	// Clean up test data
	_, err = db.Exec("DELETE FROM WatchingStatus WHERE userID = ? AND showID = ?", 
		testUserID, testShowID)
	assert.NoError(t, err)
}