# Sprint 4 Report

## Submission Details
Git Repo: `https://github.com/afnansyed/TV-show-navigator`
- Due to the size of the sqlite database file, it is excluded from the git repo, but is included in this submission (`./backend/shows.db`) for your convenience.

Frontend readme: [`/frontend/homepage/README.md`](/frontend/homepage/README.md)

Links to Demo Video:

Instructions to run the project locally, see `README.md` in the root directory

## Features Added this Sprint
### Frontend:
- Revamped the UI
    - On sign up page:
        - The top navigation bar is removed. Only wesite title is displayed in the center.
        - The website title routes back to home page if clicked.
        - Sign up box changes:
           - Color
           - Box heading text
           - Added prompt that navigates user to the sign in page if they already have an account.
           - Made the box hover when mouse moves on top of it.
        - Background image
    - On sign in page:
        - The top navigation bar is removed. Only wesite title is displayed in the center.
        - The website title routes back to home page if clicked.
        - Sign in box changes:
           - Color
           - Box heading text
           - Added prompt that navigates user to the sign up page if they don't have an account yet.
           - Made the box hover when mouse moves on top of it.
        - Background image

      
### Backend:
- Add Comments functionality
  - Api endpoints
  - Database table
  - Documentation
- Add Watchlist functionality
  - Api endpoints
  - Database table
  - Documentation
- Fix bug in data typing for reponse JSON
- Fix bug where new records to database were ignored rather than replacing existing records
- Fix `/ratings DELETE` endpoint

## Testing
### Frontend:

- New unit tests:
  - sign up component:
      - Displays the correct prompt to sign in, if user does not have an account
      - Displays the 'Your TV Shows Navigator' logo
      - Navigates to sign-in page when "Sign in" link is clicked
  - sign in component:
      - Displays the correct prompt to sign up, if user does not have an account
      - Displays the 'Your TV Shows Navigator' logo
      - Navigates to sign-up page when "Sign up" link is clicked

- All Unit Tests
   ![Screenshot 2025-04-21 125509](https://github.com/user-attachments/assets/58be2952-95c5-43c2-bc20-73b21f7f4b1e)

   
- Cypress Tests:
    - (test 1) (Updated from previous cypress test due to changes in UI): Shows Button Navigation Test
        - Testing the fuctionality of the 'Shows' button on homepage in the navigation bar
          - Visit the homepage 
          - Check the 'Shows' button exists
          - Click the 'Shows' button
          - Check if the URL changes to the "shows" page
          - Check if "Shows" page content is visible

            ![Image](https://github.com/user-attachments/assets/3495ced0-009f-4893-bdff-061c0fce6e79)

    - (test 2): Watchlist Button Navigation Test
        - Testing the fuctionality of the 'Watchlist' button on homepage in the navigation bar
          - Visit the homepage 
          - Check the 'Watchlist' button exists
          - Click the 'Watchlist' button
          - Check if the URL changes to the "watchlist" page
          - Check if "Watchlist" page content is visible

            ![Image](https://github.com/user-attachments/assets/e3ef4fba-0bbf-4a24-8352-6ad82e7f4155)

    
### Backend:

- Unit Tests:
  
  - addComment endpoint:
    - Tests creating a new comment.
    - Verifies that the comment is successfully added to the database with correct data (userID, showID, comment).
    - Checks the response status code is 200 OK.
      
  - deleteComment endpoint:
    - Tests deleting a comment by ID.
    - Verifies that the comment is successfully removed from the database.
    - Confirms the response contains the deleted comment's data.
      
  - addStatus endpoint:
    - Tests adding a new watch status to a show.
    - Verifies that the status is successfully added to the database with correct values.
    - Checks the response status code is 200 OK.
      
  - deleteStatus endpoint:
    - Tests deleting a watch status by userID and showID.
    - Verifies that the status is successfully removed from the database.
    - Confirms the response contains the deleted status data.
      
  - getWatchlist endpoint:
    - Tests all 4 scenarios: getting a specific status, all statuses for a user, all statuses for a show, and all watchlists.
    - Verifies that response contains the expected data structure in each scenario.
    - Confirms proper data retrieval across multiple functions.
      
  - addRating endpoint:
    - Tests adding a new rating to a show.
    - Verifies that the rating is successfully added to the database with correct values.
    - Checks the response status code is 200 OK.
      
  - deleteRating endpoint:
    - Tests deleting a rating by userID and showID.
    - Verifies that the rating is successfully removed from the database.
    - Confirms the response contains the deleted rating data.
      
  - getRatings endpoint:
    - Tests all scenarios: getting a specific rating, all ratings for a user, all ratings for a show.
    - Verifies that responses contain the expected data structure for each scenario.
    - Confirms error handling when neither userID nor showID is provided.

## API Documentation

The path to the API documentation is [`backend/api-structure.md`](backend/api-structure.md)

