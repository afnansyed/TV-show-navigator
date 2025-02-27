// getShows_test.go
package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"strings"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

// TestGetShows tests the getShows function
func TestGetShows(t *testing.T) {
	// Set up test database connection
	var err error
	db, err = sql.Open("sqlite3", "shows.db")
	if err != nil {
		t.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Setting up the Gin router
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/shows", getShows)

	// Test case 1: Default parameters
	t.Run("Default Parameters", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/shows", nil)
		resp := httptest.NewRecorder()
		router.ServeHTTP(resp, req)

		assert.Equal(t, http.StatusOK, resp.Code)
		t.Logf("PASS: Response status code is %d", resp.Code)

		var shows []map[string]interface{}
		err = json.Unmarshal(resp.Body.Bytes(), &shows)
		assert.NoError(t, err)
		t.Logf("PASS: No error unmarshaling response")

		// Verify we got shows and they have the expected structure
		assert.LessOrEqual(t, len(shows), 20, "Should return at most 20 shows by default")
		t.Logf("PASS: Response contains %d shows", len(shows))

		if len(shows) > 0 {
			// Check structure of first show
			firstShow := shows[0]
			_, tconstExists := firstShow["tconst"]
			assert.True(t, tconstExists, "Show should contain a tconst field")
			t.Logf("PASS: Show contains tconst field")

			_, titleExists := firstShow["title"]
			assert.True(t, titleExists, "Show should contain a title field")
			t.Logf("PASS: Show contains title field")
		}
	})

	// Test case 2: Filter by title
	t.Run("Filter by Title", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/shows?titleContains=star", nil)
		resp := httptest.NewRecorder()
		router.ServeHTTP(resp, req)

		assert.Equal(t, http.StatusOK, resp.Code)
		t.Logf("PASS: Response status code is %d", resp.Code)

		var shows []map[string]interface{}
		err = json.Unmarshal(resp.Body.Bytes(), &shows)
		assert.NoError(t, err)
		t.Logf("PASS: No error unmarshaling response")

		// Check if we have shows and they contain "star" in the title
		if len(shows) > 0 {
			for _, show := range shows {
				title, _ := show["title"].(string)
				originalTitle, _ := show["originalTitle"].(string)
				
				// Title should contain "star" case-insensitive
				titleMatch := false
				if len(title) > 0 {
					titleLower := strings.ToLower(title)
					titleMatch = strings.Contains(titleLower, "star")
				}
				
				originalTitleMatch := false
				if len(originalTitle) > 0 {
					originalTitleLower := strings.ToLower(originalTitle)
					originalTitleMatch = strings.Contains(originalTitleLower, "star")
				}
				
				assert.True(t, titleMatch || originalTitleMatch, 
					"Show title or originalTitle should contain 'star': %s / %s", title, originalTitle)
			}
			t.Logf("PASS: All shows contain 'star' in title or originalTitle")
		}
	})

	// Test case 3: Limit parameter
	t.Run("Limit Parameter", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/shows?limit=5", nil)
		resp := httptest.NewRecorder()
		router.ServeHTTP(resp, req)

		assert.Equal(t, http.StatusOK, resp.Code)
		t.Logf("PASS: Response status code is %d", resp.Code)

		var shows []map[string]interface{}
		err = json.Unmarshal(resp.Body.Bytes(), &shows)
		assert.NoError(t, err)
		t.Logf("PASS: No error unmarshaling response")

		// Verify we got at most 5 shows
		assert.LessOrEqual(t, len(shows), 5, "Should return at most 5 shows")
		t.Logf("PASS: Response contains %d shows (limit=5)", len(shows))
	})
}
