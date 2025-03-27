package main

import (
	"database/sql"
	"net/http"
	"net/http/httptest"
	"testing"
    "encoding/json"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

// TestValidateUser tests the validateUser function
func TestValidateUser(t *testing.T) {
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
	router.GET("/validateUser", validateUser)

	// Create a test user in the database
	testUser := map[string]string{
		"username": "testuser123",
		"password": "testpassword123",
	}
	_, err = db.Exec("INSERT INTO Users (Username, Password) VALUES (?, ?)", testUser["username"], testUser["password"])
	assert.NoError(t, err)

	// Create a test request with valid credentials
	req, _ := http.NewRequest("GET", "/validateUser?username=testuser123&password=testpassword123", nil)
	resp := httptest.NewRecorder()

	// Serve the request
	router.ServeHTTP(resp, req)

	// Check response status code
	assert.Equal(t, http.StatusOK, resp.Code)
	t.Logf("PASS: Response status code is %d", resp.Code)

	// Verify the response body
	var responseBody map[string]interface{}
	err = json.Unmarshal(resp.Body.Bytes(), &responseBody)
	assert.NoError(t, err)
	assert.Contains(t, responseBody, "rowid")
	t.Logf("PASS: Response body matches expected data")

	// Create a test request with invalid credentials
	req, _ = http.NewRequest("GET", "/validateUser?username=wronguser&password=wrongpassword", nil)
	resp = httptest.NewRecorder()

	// Serve the request
	router.ServeHTTP(resp, req)

	// Check response status code for invalid credentials
	assert.Equal(t, http.StatusInternalServerError, resp.Code)
	t.Logf("PASS: Response status code for invalid credentials is %d", resp.Code)

	// Verify the error message
	errMsg := resp.Body.String()
	assert.Contains(t, errMsg, "That user does not exist in the database")
	t.Logf("PASS: Error message for invalid credentials is correct")

	// Clean up - delete the test user
	_, err = db.Exec("DELETE FROM Users WHERE Username = ?", testUser["username"])
	if err != nil {
		t.Logf("Warning: Failed to delete test user: %v", err)
	}
}
