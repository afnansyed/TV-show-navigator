package main

import (
	"fmt" //i/o module

	"database/sql" //sql module

	_ "github.com/mattn/go-sqlite3" //sql driver to sql module can interact with sqlite db
)

func main() {
	//sets shows.db as current working db
	db, err := sql.Open("sqlite3", "shows.db")
	if err != nil {
		fmt.Print(err)
	}
	defer db.Close() // defers the execution of rows.Close until the main finishes

	query := "select count(*) from series;"
	rows, err := db.Query(query)
	if err != nil {
		fmt.Printf("%q: %s\n", err, query)
		return
	}
	defer rows.Close()

	fmt.Println(rows.Columns()) //print all columns from query

	//print 1st row from rows i.e. the count of * from table 'series'
	rows.Next()
	var count int
	rows.Scan(&count)
	fmt.Println(count)
}
