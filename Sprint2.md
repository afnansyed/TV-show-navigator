# Sprint 2 Report

## Submission Details
Git Repo: `https://github.com/afnansyed/TV-show-navigator`
- Due to the size of the sqlite database file, it is excluded from the git repo, but is included in this submission (`./backend/shows.db`) for your convenience.

Links to Demo Video, first half is frontend and the second half is backend - https://www.youtube.com/watch?v=D7JqHaF_gx8

Instructions to run the project locally, see `README.md` in the root directory

## Features Added this Sprint
### Frontend:
- Implemented user Sign Up (integration with backend)
- Implemented rating bar that allows user to rate each show in their watchlist from 1-10
- Minor changes with UI design:
  - Able to route from tv show list page to home page
  - Able to route from watch list page to home page
  - Centered the filter list on tv show list page
  - Edited the header on tv show list page and watchlist page
  - Removed email from sign up option

### Backend:
- Added tables to database schema to store user activity
  - Follows, Ratings, User Accounts
- Added API endpoints to create, validate, list, and remove User accounts from database
  - used POST and DELETE REST requests for first time

## Testing
### Frontend:
- Unit tests:
  - Hero component:
    - should create
    - Displays the correct paragraph text
    - Has a Get Started button that has shows page router link
    - Routes to the Shows page when the Get Started button is clicked
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

![unittests](https://github.com/user-attachments/assets/b899d004-6fbb-4959-bc18-e6926433361d)

- Cypress test:
  - (1 test) Testing the fuctionality of the 'Get Started' button on homepage:
    - Vist homepage
    - Check the 'Get Started' button exists
    - Click the 'Get Started' button
    - Check if the URL changes to the "shows" page
    - Check if "shows" page content is visible

![cypress test](https://github.com/user-attachments/assets/499b74a7-8312-42bd-8e01-7f9083c2c2a0)

    
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

The path to the API documentation is [`backend/api-structure.md`](backend/api-structure.md)

