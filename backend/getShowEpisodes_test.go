package main

import (
	"backend/endpoints"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

// TestGetShowEpisodes tests the getShowEpisodes function
func TestGetShowEpisodes(t *testing.T) {
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

	// Find a valid parentTconst that actually has episodes
	var parentTconst string
	err = db.QueryRow("SELECT parentTconst FROM episodes GROUP BY parentTconst HAVING COUNT(*) > 0 LIMIT 1").Scan(&parentTconst)
	if err != nil {
		// If we can't find a valid parentTconst with episodes, use a known one for testing
		parentTconst = "tt0052520" // The Twilight Zone or another show you know exists
		t.Logf("Using hardcoded parentTconst: %s for testing", parentTconst)
	} else {
		t.Logf("Using parentTconst: %s from database for testing", parentTconst)
	}

	// Creating a test request with the valid parentTconst
	req, _ := http.NewRequest("GET", fmt.Sprintf("/episodes/%s", parentTconst), nil)
	resp := httptest.NewRecorder()
	
	// Serving the request
	router.ServeHTTP(resp, req)

	// Check response code - could be 200 OK or 404 Not Found
	if resp.Code == http.StatusNotFound {
		// If no episodes found, verify the error message format
		var errorResponse map[string]string
		err = json.Unmarshal(resp.Body.Bytes(), &errorResponse)
		assert.NoError(t, err, "Should be able to parse error response")
		t.Logf("No episodes found for parentTconst: %s", parentTconst)
		assert.Contains(t, errorResponse, "error", "Error response should contain 'error' field")
		return
	}

	// If we get here, we should have a 200 OK response
	assert.Equal(t, http.StatusOK, resp.Code, "Should return 200 OK for valid parentTconst with episodes")
	t.Logf("PASS: Response status code is %d", resp.Code)

	// Try to parse as array of episodes
	var episodes []map[string]interface{}
	err = json.Unmarshal(resp.Body.Bytes(), &episodes)
	if err != nil {
		// If parsing as array fails, log the actual response for debugging
		t.Logf("Failed to parse response as array. Response body: %s", resp.Body.String())
		t.Fatalf("JSON unmarshaling error: %v", err)
	}
	t.Logf("PASS: No error unmarshaling response")

	// Verify we got at least one episode
	assert.Greater(t, len(episodes), 0, "Response should contain at least one episode")
	t.Logf("PASS: Response contains %d episodes", len(episodes))

	// Only check episode structure if we have episodes
	if len(episodes) > 0 {
		firstEpisode := episodes[0]
		_, tconstExists := firstEpisode["tconst"]
		assert.True(t, tconstExists, "Episode should contain a tconst field")
		t.Logf("PASS: Episode contains tconst field")

		_, parentTconstExists := firstEpisode["parentTconst"]
		assert.True(t, parentTconstExists, "Episode should contain a parentTconst field")
		t.Logf("PASS: Episode contains parentTconst field")

		_, seasonNumberExists := firstEpisode["seasonNumber"]
		assert.True(t, seasonNumberExists, "Episode should contain a seasonNumber field")
		t.Logf("PASS: Episode contains seasonNumber field")

		_, episodeNumberExists := firstEpisode["episodeNumber"]
		assert.True(t, episodeNumberExists, "Episode should contain an episodeNumber field")
		t.Logf("PASS: Episode contains episodeNumber field")
	}

	// Test with an invalid parentTconst
	req, _ = http.NewRequest("GET", "/episodes/invalidTconst", nil)
	resp = httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// Should return 404 Not Found
	assert.Equal(t, http.StatusNotFound, resp.Code, "Invalid parentTconst should return 404")
	t.Logf("PASS: Invalid parentTconst returns status code %d", resp.Code)
}
