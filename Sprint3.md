# Sprint 3 Report

## Submission Details
Git Repo: `https://github.com/afnansyed/TV-show-navigator`
- Due to the size of the sqlite database file, it is excluded from the git repo, but is included in this submission (`./backend/shows.db`) for your convenience.

Links to Demo Video, first half is frontend and the second half is backend - https://www.youtube.com/watch?v=D7JqHaF_gx8

Instructions to run the project locally, see `README.md` in the root directory

## Features Added this Sprint
### Frontend:

- Revamped the UI
    - on homepage:
        - The navigation bar moved to the left side and is a hover bar. When the mouse is moved on top of it, it expands.
           - The navigation bar includes a home button, a tv show list button, a watchlist button, a search button, a profile button, a sign up button, and a sign in button. These buttons lead to their respective pages.
        - Background image
        - Comments on TV shows (this is a mockup for now)
        - Popular Tv show posters
    - on watchlist page:
        - Added comment festure that allows users to leave and edit comments on shows.
        - Adjusted the rating feature
    - on showlist page:
        - Reorginized the layout
        - Cleanup the logic
- Mock-up backend
    - Added a mock-up backend to allow the front-end to experiment with features and interactions, this also allows better communication with the back-end regarding the requirements.


### Backend:
- Added tables for ratings, comments, and watchlist to database
- Added endpoints to GET/POST/DELETE ratings data
- Added endpoint to read comments table
- Refactored backend file structure to be more GO-like and less cluttered
- Added encryption to user passwords
- Added filter to avoid duplicate usernames
- Added tests for comments and user endpoints
- Removed unused api endpoint `/ratings/best`

## Testing
### Frontend:
- Unit tests:
  - features component:
      - Displays the correct paragraph text under heading
      - Displays the 'Your TV Shows Navigator' logo
      - Has a language selector to choose from options: English or Spanish
      - Tests scrolling through the reviews section
      - Displays the images of the TV Show posters

  - navbar component:
      - Has a Home button
      - Has a Search button
      - Has a TV Shows button
      - Routes to TV Shows page when Shows button is clicked
      - Has a Watchlist button
      - Routes to Watchlist page when Watchlist button is clicked
      - Has a Profile button
      - Shows labels next to their respective icons when the navigation bar expands



    
### Backend:
- Unit Tests:

  - getUser endpoint:

    - Tests retrieving user information by ID.

    - Verifies that the response contains the expected user data (username, password).

    - Checks error handling for non-existent user IDs.

  - getAllUsers endpoint:

    - Tests retrieving all users from the database.

    - Verifies that the response contains a list of user data (username, password).

    - Checks for proper handling of an empty user list.

  - deleteUser endpoint:

    - Tests deleting a user by ID.

    - Verifies that the user is successfully removed from the database.

    - Checks error handling for deleting a non-existent user.

  - getAllComments endpoint:

    - Tests retrieving all comments from the database.

    - Verifies that the response contains a list of comments with the correct structure (commentID, userID, showID, timestamp, comment).

    - Checks filtering functionality by user ID or show ID.

  - validateUser endpoint:
 
    - Tests validating user credentials.

    - Verifies that valid credentials return the correct user ID.

    - Checks error handling for invalid credentials.


## API Documentation

The path to the API documentation is [`backend/api-structure.md`](backend/api-structure.md)

