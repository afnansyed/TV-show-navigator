# Sprint 1 Report
Team: Afnan Syed, Joshua Yang, Nathan Harris, Rohan Madiratta
## User stories
- As a user, I want to search for tv shows by looking up the title, so that I can find the show that I am interested in.
  - **Acceptance criteria**: filter in show list
- As a user, I want to search for tv shows by genre, so that I can find and discover more shows through my preferences.
  - **Acceptance criteria**: page for tv show listing with filter
- As a user, I want the website to remember me, so that the website can remember my settings (watchlist) and preferences.
  - **Acceptance criteria**: page for watchlist
- As a user, I want to add shows to my watchlist, so that I can better track the shows I’m interested in.
  - **Acceptance criteria**: page for sign up and sign in
## What issues your team planned to address
### Backend
- Create SQLite Database
- Document Database Structure
- Write useful queries of database
- Create API using Gin
- Write GET endpoints for useful queries
- Test endpoints using Postman
- Document API endpoints
- Create code pipeline for quickly adding new queries/APIs
### Frontend
- Website prototype
- Integrate with backend (allowing frontend to send queries through API)
- Creating web page components and associated functionalities:
- Home
- TV show list
- Watchlist
- Sign up
- Sign in
- Routing each page created from homepage and testing the buttons
## Which ones were successfully completed
**Backend**:
API Behavior, SQL Queries, and Documentation of systems were successfully completed.
**Frontend**:
All issues were successfully completed: Creating web pages, routing, and integrating with backend 
## Which ones didn't and why?
**Backend**: 
We did not implement a pipeline for quickly adding new API endpoints and DB queries. Due to the shared objects and varied behavior between backend functions, finding commonality that could be separated and encapsulated into helper functions to reduce redundant code proved challenging. And what abstraction could be applied was not meaningful enough to reduce the complexity or improve the legibility. As the project develops, we will continue to look for ways to improve the modularity and nimbleness of the backend.


