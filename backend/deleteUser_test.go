package main

import (
	"backend/endpoints"
	"database/sql"
	"net/http"
	"net/http/httptest"
	"testing"
	"fmt"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

func TestDeleteUser(t *testing.T) {
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

	// Create a test user in the database
	testUser := map[string]string{
		"username": "testuser123",
		"password": "testpassword123",
	}
	_, err = db.Exec("INSERT INTO Users (Username, Password) VALUES (?, ?)", testUser["username"], testUser["password"])
	assert.NoError(t, err)

	// Get the rowid of the test user
	var rowid int
	err = db.QueryRow("SELECT rowid FROM Users WHERE Username = ?", testUser["username"]).Scan(&rowid)
	assert.NoError(t, err)

	// Create a test request
	req, _ := http.NewRequest("DELETE", fmt.Sprintf("/users/%d", rowid), nil)
	resp := httptest.NewRecorder()

	// Serve the request
	router.ServeHTTP(resp, req)

	// Check response status code
	assert.Equal(t, http.StatusOK, resp.Code)
	t.Logf("PASS: Response status code is %d", resp.Code)

	// Verify the user was deleted from the database
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM Users WHERE rowid = ?", rowid).Scan(&count)
	assert.NoError(t, err)
	assert.Equal(t, 0, count)
	t.Logf("PASS: User was successfully deleted from database")
}
