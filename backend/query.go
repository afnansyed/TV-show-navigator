package main

import (
	"fmt"

	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", "shows.db")
	if err != nil {
		fmt.Print(err)
	}
	defer db.Close()

	query := "select count(*) from series;"
	rows, err := db.Query(query)
	if err != nil {
		fmt.Printf("%q: %s\n", err, query)
		return
	}
	defer rows.Close()

	fmt.Println(rows.Columns())

	rows.Next()
	var count int
	rows.Scan(&count)
	fmt.Println(count)
}
