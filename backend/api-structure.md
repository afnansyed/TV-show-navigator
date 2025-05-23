# API Structure
List of APIs implemented in `api.go`, their parameters and outputs

# List of Endpoints
- [API Structure](#api-structure)
- [List of Endpoints](#list-of-endpoints)
- [/shows](#shows)
  - [Example](#example)
  - [Input](#input)
  - [Output](#output)
- [/shows/?id?](#showsid)
  - [Example](#example-1)
  - [Input](#input-1)
  - [Output](#output-1)
- [/shows/count](#showscount)
  - [Example](#example-2)
  - [Input](#input-2)
  - [Output](#output-2)
- [/ratings/best](#ratingsbest)
  - [Example](#example-3)
  - [Input](#input-3)
  - [Output](#output-3)
- [/episodes/?parentTconst?](#episodesparenttconst)
  - [Example](#example-4)
  - [Input](#input-4)
  - [Output](#output-4)
- [/users](#users)
  - [Example](#example-5)
  - [Input](#input-5)
  - [Output](#output-5)
- [/users/:id GET](#usersid-get)
  - [Example](#example-6)
  - [Input](#input-6)
  - [Output](#output-6)
- [/users/:id DELETE](#usersid-delete)
  - [Example](#example-7)
  - [Input](#input-7)
  - [Output](#output-7)
- [/users/all](#usersall)
  - [Example](#example-8)
  - [Input](#input-8)
  - [Output](#output-8)
- [/validateUsers](#validateusers)
  - [Examples](#examples)
  - [Input](#input-9)
  - [Output](#output-9)
- [/ratings GET](#ratings-get)
  - [Example](#example-9)
  - [Input](#input-10)
  - [Output](#output-10)
- [/ratings POST](#ratings-post)
  - [Example](#example-10)
  - [Input](#input-11)
  - [Output](#output-11)
- [/ratings DELETE](#ratings-delete)
  - [Example](#example-11)
  - [Input](#input-12)
  - [Output](#output-12)
- [/comments GET](#comments-get)
  - [Example](#example-12)
  - [Input](#input-13)
  - [Output](#output-13)
- [/comments POST](#comments-post)
  - [Example](#example-13)
  - [Input](#input-14)
  - [Output](#output-14)
- [/comments DELETE](#comments-delete)
  - [Example](#example-14)
  - [Input](#input-15)
  - [Output](#output-15)
- [/watchlist GET](#watchlist-get)
  - [Example](#example-15)
  - [Input](#input-16)
  - [Output](#output-16)
- [/watchlist POST](#watchlist-post)
  - [Example](#example-16)
  - [Input](#input-17)
  - [Output](#output-17)
- [/watchlist DELETE](#watchlist-delete)
  - [Input](#input-18)
  - [Output](#output-18)

# /shows
## Example
`http://localhost:8080/shows?limit=20&titleContains=fire&isAdult=TRUE&genre=romance`
## Input
- titleContains : TEXT : OPTIONAL : will filter results to only those that contain the parameter text in either primary- or originalTitle fields
- isAdult : Boolean : OPTIONAL : Accepts only TRUE or FALSE (in any capitalization)
- Genre: TEXT : OPTIONAL : filters results containing text. Supported Genres are:
  - Action
  - Adult
  - Adventure
  - Animation
  - Biography
  - Comedy
  - Crime
  - Documentary
  - Drama
  - Family
  - Fantasy
  - Game-Show
  - History
  - Horror
  - Mystery
  - Musical
  - Music
  - News
  - Reality-TV
  - Sci-Fi
  - Short
  - Sport
  - Talk-Show
  - Thriller
  - War
  - Western
- startYearEnd : NUMBER : Optional : Range:Any number in range 1927-2029. Filters shows that that started at or before this year. There are ~22k shows that have 0 for this field
- startYearStart : NUMBER : Optional : See startYearEnd
- limit : NUMBER : Optional : Limits number of rows returned from database. DEFAULT is 20
## Output
An array of JSONs for each row returned. JSONs contain:
- avgRating: JSON
  - Float64: NUMBER (0 if NULL)
  - Valid: BOOL (false if NULL, true otherwise)
- endYear: INT
- genres: STRING
- isAdult: INT (1 is yes, 0 if no)
- originalTitle: STRING (identical to "title" in most cases)
- primaryTitle: STRING
- runtimeMinutes: INT
- startYear: INT
- tconst: STRING (unique identifier for show)
- title: STRING
- votes: JSON
  - Int32: INT (0 if NULL)
  - Valid: BOOL (false if NULL, true otherwise)
# /shows/?id?
Returns the title matching the ID input
## Example
`http://localhost:8080/shows/tt0035599`
## Input
- ID : TEXT : tconst id for a given tvshow in table `series`
## Output
Single JSON of show matching ID, error if no match found.
- tconst : TEXT : the input ID
- title : TEXT : the primaryTitle property that matches the ID
# /shows/count
Returns the count of all shows in the database
## Example
`http://localhost:8080/shows/count`
## Input
N/A
## Output
JSON:
- COUNT : NUMBER : count of all rows in table `series`
# /ratings/best
Fetches data on the best rated show in table `ratings`
## Example
`http://localhost:8080/ratings/best`
## Input
N/A
## Output
JSON:
- tconst : NUMBER : ID of best-rated show
- avgRating : NUMBER : rating of best-rated show (value between 0-10)
- votes : NUMBER : quantity of votes the best-rated show received
# /episodes/?parentTconst?
Returns list of episodes belonging to the show matching the input ID
## Example
`http://localhost:8080/episodes/tt0303461`
## Input
- tconst: TEXT : ID for tv show
## Output
List of JSON for each episode, error reported if no shows found
- episodeNumber : NUMBER : enumeration of that episode
- seasonNumber : NUMBER : enumeration of the season that the episode belongs to
- tconst : TEXT : ID for that episode
- parentTconst : TEXT : ID for tv show the episode belongs to
# /users
A POST api that creates a new user in the database
## Example
`http://localhost:8080/users`
## Input
A JSON in the form of:
```json
{ 
  username: "name",
  password: "pass"
}
```
property names are important. These values will be added to the db and there can be duplicates of these fields in the db.
## Output
200 code for successful addition to db, 500 otherwise
# /users/:id GET
GET request for user info (currently just username and password)
## Example
`http://localhost:8080/users/10`
## Input
- id : INTEGER : id value of user
## Output
JSON like:
```json
{ 
  username: "name",
  password: "pass"
}
```
# /users/:id DELETE
a DELETE api to delete a user by id
## Example
`http://localhost:8080/users/10`
## Input
- id : INTEGER : id value of user
## Output
200 code and JSON of user data (see GET) if successful, 500 otherwise
# /users/all
retrieves all users data from database
## Example
`/users/all`
## Input
NONE
## Output
JSON of the following form
```json
[
  {
    rowid: 1,
    username: "name",
    password: "pass"
  },
  {
    rowid: 2,
    username: "name",
    password: "pass"
  }
]
```
# /validateUsers
Validates if user credentials are in the database or not
## Examples
`/validateUser?username=name&password=pass`
## Input
Both input variables are required
- username: the username string to check
- password: the password string to check
## Output
The ROWID of the user if found, 500 error if not. JSON in the form:
```json
{
  rowid: 1
}
```
# /ratings GET
gets ratings following filter lenses
## Example
`http://localhost:8080/ratings?userID=18&showID=tt0035599`
## Input
Only one of the following input variables is required
- userID: id value of user
- showID: tconst value of show from series table
## Output
IF both userID and showID provided:
- JSON in form
```json
{
  "userID": 18,
  "showID": "tt0035599",
  "rating": 9.5,
}
```
- ERROR if no rating found for that user-show pair
IF only 1 param passed
- JSON list if filtered by userID
```json
[
  {
    {
			"showID": "tt0035599",
			"rating": 9.5,
		}
  }
]
```
- JSON list if filtered by showID
```json
[
  {
    {
			"userID": "4",
			"rating": 9.5,
		}
  }
]
```
# /ratings POST
adds new rating per parameters
## Example
`http://localhost:8080/ratings`
## Input
A JSON in the form of:
```json
{
  "userID": 18, 
  "showID": "tt0035599",
  "ratings": 9.0
}
```
## Output
200 code, 500 if error

# /ratings DELETE
deletes existing rating per parameters
## Example
`http://localhost:8080/ratings?userID=18&showID=tt0035599`
## Input
userID : INTEGER : id of user who made the rating
showID : TEXT : id of show that was rated
## Output
200 code with JSON of removed rating, 500 otherwise
```json
{
  "userID": 18,
  "showID": "tt0035599",
  "rating": 9.5
}
```
# /comments GET
displays entires in the comments table
## Example
`http://localhost:8080/comments?showID=ttfakeShow&userID=100`
## Input
- **userID**: INTEGER : OPTIONAL : Filter comments by user ID.
- **showID**: TEXT : OPTIONAL : Filter comments by show ID.
## Output
A JSON list of comments. Each comment contains
```json
{
  "commentID": 1,
  "userID": 123,
  "showID": "tt0035599",
  "timestamp": "2023-01-01 12:00:00",
  "comment": "This is a great show!"
}
```
# /comments POST
adds a comment to the db table
## Example
`http://localhost:8080/comments`
## Input
```json
{
  "userID": 1,
  "showID": "ttfakeShow",
  "comment": "this is what I want to say"
}
```
## Output
200 on success, 500 for error
# /comments DELETE
removes a comment from database
## Example
`http://localhost:8080/comments?id=1234`
## Input
id : INTEGER : number that corresponds to the unique commentID field in the database
## Output
the deleted row in JSON form
```json
{
  "commentID": 1234,
  "userID": 123,
  "showID": "tt0035599",
  "timestamp": "2023-01-01 12:00:00",
  "comment": "This is a great show!"
}
```
# /watchlist GET
get watchlists and watchingstatuses for users and/or shows
## Example
`http://localhost:8080/watchlist`
`http://localhost:8080/watchlist?userID=1234`
`http://localhost:8080/watchlistshowID=ttfakeShow`
`http://localhost:8080/watchlist?userID=1234&showID=ttfakeShow`
## Input
userID : INTEGER : OPTIONAL : id of user who owns the status
showID : string : OPTIONAL : id of show belonging to the status
## Output
output JSON depends on input parameters:
[see database docs for status codes](database-structure.md#watchingstatus)
```json
//no input params -> returns all watching statuses, ordered by userID
[
  {
    "userID":1,
    "showID":"ttfakeShow",
    "status":1
  }
]

//only userID provided -> returns watchlist for that userID
[
  {
    "showID":"ttfakeShow",
    "status":1
  }
]

//only showID provided -> returns users with watchstatus for that show
[
  {
    "userID":1,
    "status":1
  }
]

//both input params -> returns the status (if it exists) between that user and show
[
  {
    "userID":1,
    "showID":"ttfakeShow",
    "status":1
  }
]
```
# /watchlist POST
adds or updates watchlist status
## Example
`http://localhost:8080/watchlist`
## Input
```json
{
  "userID":1,
  "showID":"ttfakeShow",
  "status":2
}
```
## Output
200 code if success, 500 otherwise
# /watchlist DELETE
removes status from db, for a given show and user ID
## Input
```json
{
  "userID":1,
  "showID":"ttfakeShow"
}
```
## Output
the row of data removed from the db
```json
{
  "userID":1,
  "showID":"ttfakeShow",
  "status":2
}
```