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
- Cypress test:
  - (1 test) Testing the fuctionality of the 'Get Started' button on homepage:
    - Vist homepage
    - Check the 'Get Started' button exists
    - Click the 'Get Started' button
    - Check if the URL changes to the "shows" page
    - Check if "shows" page content is visible
    
### Backend:
## API Documentation
