# Sprint 2 Report
## Features Added this Spring
### Frontend:
- Implemented user Sign Up 
- Minor changes with UI design:
  - Able to route from tv show list page to home page
  - Able to route from watch list page to home page
  - Centered the filter list on tv show list page
  - Edited the header on tv show list page and watchlist page
  - Removed email from sign up option

### Backend:

## Testing
### Frontend:
- Unit tests:
  - Hero component:
    - should create
    - Displays the correct paragraph text
    - Has a Get Started button that has shows page router link
  - Navbar component:
    - should create
    - Displays the Your Navigator for TV Shows logo
    - Has a search bar
    - Has a language selector to choose from options: English or Spanish
    - Has a Sign Up button that has sign-up page router link
    - Routes to sign-up page when Sign Up button is clicked
    - Has a Sign In button that has sign-in page router link
    - Routes to sign-in page when Sign In button is clicked
  - Services:
    - query-shows service
      - Testing http parameters with different parameters 
    - watchlist service
      - Testing adding and deleting shows to the list
      - Testing adding large numbers of shows to the list 
- Cypress test:
  - (1 test) Testing the fuctionality of the 'Get Started' button on homepage:
    - Vist homepage
    - Check the 'Get Started' button exists
    - Click the 'Get Started' button
    - Check if the URL changes to the "shows" page
    - Check if "shows" page content is visible
    
### Backend:

- Unit tests:
  
  - getShowCount endpoint:

    - Verifies correct HTTP status code (200)

    - Confirms response contains COUNT field

    - Validates COUNT is a non-negative number

  - getBestRating endpoint:

    - Verifies correct HTTP status code (200)

    - Confirms response contains tconst, avgRating, and votes fields

    - Validates data structure integrity

  - getShowEpisodes endpoint:

    - Tests with valid parentTconst parameter

    - Verifies correct episode structure (tconst, parentTconst, seasonNumber, episodeNumber)

    - Tests with invalid parentTconst to ensure proper error handling (404)

  - getShows endpoint:

    - Tests default parameters behavior

    - Verifies title filtering functionality

    - Confirms limit parameter works correctly

  - createUser endpoint:

    - Verifies user creation with valid data

    - Confirms database persistence of user information


## API Documentation
