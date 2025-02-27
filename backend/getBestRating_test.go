// getBestRating_test.go
package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

// TestGetBestRating tests the getBestRating function
func TestGetBestRating(t *testing.T) {
	// setting up test database connection
	var err error
	db, err = sql.Open("sqlite3", "shows.db")
	if err != nil {
		t.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// setting up the Gin router
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/ratings/best", getBestRating)

	
	req, _ := http.NewRequest("GET", "/ratings/best", nil)
	resp := httptest.NewRecorder()
	
	// Serving the request
	router.ServeHTTP(resp, req)

	// checking the response status code
	assert.Equal(t, http.StatusOK, resp.Code)
	t.Logf("PASS: Response status code is %d", resp.Code)

	// parsing the response body
	var response map[string]interface{}
	err = json.Unmarshal(resp.Body.Bytes(), &response)
	assert.NoError(t, err)
	t.Logf("PASS: No error unmarshaling response")

	// Verifying that the required fields exist
	_, tconstExists := response["tconst"]
	assert.True(t, tconstExists, "Response should contain a tconst field")
	t.Logf("PASS: Response contains tconst field")

	_, ratingExists := response["avgRating"]
	assert.True(t, ratingExists, "Response should contain an avgRating field")
	t.Logf("PASS: Response contains avgRating field")

	_, votesExists := response["votes"]
	assert.True(t, votesExists, "Response should contain a votes field")
	t.Logf("PASS: Response contains votes field")
	
	
	t.Logf("Best rated show: tconst=%v, avgRating=%v, votes=%v", 
		response["tconst"], response["avgRating"], response["votes"])
}
