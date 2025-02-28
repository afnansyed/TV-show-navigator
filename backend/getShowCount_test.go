
package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// TestGetShowCount tests the getShowCount function
func TestGetShowCount(t *testing.T) {
	// Set up test database connection
	var err error
	db, err = sql.Open("sqlite3", "shows.db")
	if err != nil {
		t.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// setting up the Gin router
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/shows/count", getShowCount)

	// Creating a test request
	req, _ := http.NewRequest("GET", "/shows/count", nil)
	resp := httptest.NewRecorder()
	
	// serving the request
	router.ServeHTTP(resp, req)

	// Checking the response status code
	assert.Equal(t, http.StatusOK, resp.Code)
	t.Logf("PASS: Response status code is %d", resp.Code)
	// Parsing the response body
	var response map[string]int
	err = json.Unmarshal(resp.Body.Bytes(), &response)
	assert.NoError(t, err)
	t.Logf("PASS: No error unmarshaling response")

	// Verifying that the COUNT field exists and is a positive number
	count, exists := response["COUNT"]
	assert.True(t, exists, "Response should contain a COUNT field")
	t.Logf("PASS: Response contains COUNT field")
	assert.GreaterOrEqual(t, count, 0, "COUNT should be a non-negative number")
	t.Logf("PASS: COUNT is a non-negative number (actual: %d)", count)
	
	
}
