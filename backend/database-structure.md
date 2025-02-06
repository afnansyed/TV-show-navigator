# `shows.db`
contains all records for tv shows and series. Convention for null text data to be labeled as '\N'
## Tables
- series
  - "tconst" : TEXT : unique id for each tv series
  - "titleType" : TEXT : type of tv entry (all "tvSeries")
  - "primaryTitle" : TEXT : Advertised Title
  - "originalTitle" : TEXT : Original Title, original title
  - "isAdult" : TEXT : 1 if adult title, 0 if not
  - "runtimeMinutes" : INT : approx runtime of each show, in minutes
  - "startYear" : INT : year the show started airing
  - "endYear" : INT : year the show finished airing
  - "genres" : TEXT : genre of show. Up to 3 genres, separated by commes (e.g. `Action,Adventure,Romance`)
- ratings
  - "tconst" : TEXT : unique id for each tv series
  - "avgRating" : FLOAT : average rating of show, out of 10
  - "votes" : INT : quantity of votes received on IMDB
- crew
  - "tconst" : TEXT : unique id for each tv series
  - "directors" : TEXT : comma-delimited list of IDs of directors on that show
- episodes
  - "tconst" : TEXT: unique id for each episode
  - "parentTconst" : TEXT : ID for tv series that the episode belongs to
  - "seasonNumber" : TEXT : season number for that episode
  - "episodeNumber" : TEXT : episode number for the episode