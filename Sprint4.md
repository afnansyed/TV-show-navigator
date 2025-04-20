# Sprint 4 Report

## Submission Details
Git Repo: `https://github.com/afnansyed/TV-show-navigator`
- Due to the size of the sqlite database file, it is excluded from the git repo, but is included in this submission (`./backend/shows.db`) for your convenience.

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
        - Background image
    - On sign in page:
        - The top navigation bar is removed. Only wesite title is displayed in the center.
        - The website title routes back to home page if clicked.
        - Sign in box changes:
           - Color
           - Box heading text
           - Added prompt that navigates user to the sign up page if they don't have an account yet.
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

- Unit tests:
  - sign up component:
      - Displays the correct prompt to sign in, if user does not have an account
      - Displays the 'Your TV Shows Navigator' logo
      - Navigates to sign-in page when "Sign in" link is clicked
  - sign in component:
      - Displays the correct prompt to sign up, if user does not have an account
      - Displays the 'Your TV Shows Navigator' logo
      - Navigates to sign-up page when "Sign up" link is clicked
    
### Backend:

## API Documentation

The path to the API documentation is [`backend/api-structure.md`](backend/api-structure.md)

