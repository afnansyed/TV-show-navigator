package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"backend/endpoints"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

// TestGetRatings tests the ratings retrieval endpoints
func TestGetRatings(t *testing.T) {
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
	testUserID := 888
	testShowID := "tt8888888"
	testRating := float32(4.5)
	
	// Insert test data
	insertStmt := `
		INSERT INTO newRatings (userID, showID, rating)
		VALUES(?, ?, ?)
	`
	_, err = db.Exec(insertStmt, testUserID, testShowID, testRating)
	assert.NoError(t, err)
	t.Logf("Created test rating for userID: %d, showID: %s", testUserID, testShowID)

	// Test cases for different parameter combinations
	testCases := []struct {
		name       string
		url        string
		checkFunc  func(t *testing.T, resp *httptest.ResponseRecorder)
	}{
		{
			name: "Get specific rating by userID and showID",
			url:  fmt.Sprintf("/ratings?userID=%d&showID=%s", testUserID, testShowID),
			checkFunc: func(t *testing.T, resp *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusOK, resp.Code)
				
				var responseBody map[string]interface{}
				err := json.Unmarshal(resp.Body.Bytes(), &responseBody)
				assert.NoError(t, err)
				
				assert.Equal(t, float64(testUserID), responseBody["userID"])
				assert.Equal(t, testShowID, responseBody["showID"])
				assert.Equal(t, float64(testRating), responseBody["rating"])
			},
		},
		{
			name: "Get all ratings for a user",
			url:  fmt.Sprintf("/ratings?userID=%d", testUserID),
			checkFunc: func(t *testing.T, resp *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusOK, resp.Code)
				
				var responseBody []map[string]interface{}
				err := json.Unmarshal(resp.Body.Bytes(), &responseBody)
				assert.NoError(t, err)
				
				assert.GreaterOrEqual(t, len(responseBody), 1)
				found := false
				for _, item := range responseBody {
					if item["showID"] == testShowID {
						assert.Equal(t, float64(testRating), item["rating"])
						found = true
						break
					}
				}
				assert.True(t, found, "Test show ID not found in response")
			},
		},
		{
			name: "Get all ratings for a show",
			url:  fmt.Sprintf("/ratings?showID=%s", testShowID),
			checkFunc: func(t *testing.T, resp *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusOK, resp.Code)
				
				var responseBody []map[string]interface{}
				err := json.Unmarshal(resp.Body.Bytes(), &responseBody)
				assert.NoError(t, err)
				
				assert.GreaterOrEqual(t, len(responseBody), 1)
				found := false
				for _, item := range responseBody {
					if item["userID"] == float64(testUserID) {
						assert.Equal(t, float64(testRating), item["rating"])
						found = true
						break
					}
				}
				assert.True(t, found, "Test user ID not found in response")
			},
		},
		{
			name: "Error when no parameters provided",
			url:  "/ratings",
			checkFunc: func(t *testing.T, resp *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusInternalServerError, resp.Code)
				
				var responseBody map[string]interface{}
				err := json.Unmarshal(resp.Body.Bytes(), &responseBody)
				assert.NoError(t, err)
				
				assert.Contains(t, responseBody, "error")
				assert.Equal(t, "neither userID nor showID provided", responseBody["error"])
			},
		},
	}

	// Run the test cases
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			req, _ := http.NewRequest("GET", tc.url, nil)
			resp := httptest.NewRecorder()
			router.ServeHTTP(resp, req)
			
			tc.checkFunc(t, resp)
		})
	}

	// Clean up test data
	_, err = db.Exec("DELETE FROM newRatings WHERE userID = ? AND showID = ?", 
		testUserID, testShowID)
	assert.NoError(t, err)
}