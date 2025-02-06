# API Structure
List of APIs implemented in `api.go`, their parameters and outputs

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
## /shows/:id
## /shows/count
## /ratings/best