# API Structure
List of APIs implemented in `api.go`, their parameters and outputs

## List of Endpoints
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

## /shows
### Example
`http://localhost:8080/shows?limit=20&titleContains=fire&isAdult=TRUE&genre=romance`
### Input
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
### Output
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
## /shows/?id?
Returns the title matching the ID input
### Example
`http://localhost:8080/shows/tt0035599`
### Input
- ID : TEXT : tconst id for a given tvshow in table `series`
### Output
Single JSON of show matching ID, error if no match found.
- tconst : TEXT : the input ID
- title : TEXT : the primaryTitle property that matches the ID
## /shows/count
Returns the count of all shows in the database
### Example
`http://localhost:8080/shows/count`
### Input
N/A
### Output
JSON:
- COUNT : NUMBER : count of all rows in table `series`
## /ratings/best
Fetches data on the best rated show in table `ratings`
### Example
`http://localhost:8080/ratings/best`
### Input
N/A
### Output
JSON:
- tconst : NUMBER : ID of best-rated show
- avgRating : NUMBER : rating of best-rated show (value between 0-10)
- votes : NUMBER : quantity of votes the best-rated show received
## /episodes/?parentTconst?
Returns list of episodes belonging to the show matching the input ID
### Example
`http://localhost:8080/episodes/tt0303461`
### Input
- tconst: TEXT : ID for tv show
### Output
List of JSON for each episode, error reported if no shows found
- episodeNumber : NUMBER : enumeration of that episode
- seasonNumber : NUMBER : enumeration of the season that the episode belongs to
- tconst : TEXT : ID for that episode
- parentTconst : TEXT : ID for tv show the episode belongs to