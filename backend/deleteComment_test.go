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

// TestDeleteComment tests the comment deletion endpoint
func TestDeleteComment(t *testing.T) {
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

	// First, insert a test comment that we'll delete
	testUserID := 999
	testShowID := "tt9999999"
	testComment := "This is a test comment for deletion"
	
	insertStmt := `
		INSERT INTO Comments (userID, showID, comment)
		VALUES(?, ?, ?)
	`
	result, err := db.Exec(insertStmt, testUserID, testShowID, testComment)
	assert.NoError(t, err)
	
	// Get the ID of the inserted comment
	commentID, err := result.LastInsertId()
	assert.NoError(t, err)
	t.Logf("Created test comment with ID: %d", commentID)

	// Create a test request to delete the comment
	req, _ := http.NewRequest("DELETE", fmt.Sprintf("/comments?id=%d", commentID), nil)
	resp := httptest.NewRecorder()

	// Serve the request
	router.ServeHTTP(resp, req)

	// Check response status code
	assert.Equal(t, http.StatusOK, resp.Code)
	t.Logf("PASS: Response status code is %d", resp.Code)

	// Verify the response contains the deleted comment data
	var responseBody map[string]interface{}
	err = json.Unmarshal(resp.Body.Bytes(), &responseBody)
	assert.NoError(t, err)
	
	// Check if the response contains expected data
	assert.Equal(t, fmt.Sprintf("%d", commentID), responseBody["commentID"]) // Compare as string
	assert.Equal(t, float64(testUserID), responseBody["userID"])
	assert.Equal(t, testShowID, responseBody["showID"])
	assert.Equal(t, testComment, responseBody["comment"])
	t.Logf("PASS: Response body contains correct comment data")

	// Verify the comment was deleted from the database
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM Comments WHERE commentID = ?", commentID).Scan(&count)
	assert.NoError(t, err)
	assert.Equal(t, 0, count)
	t.Logf("PASS: Comment was successfully deleted from the database")
}