describe('Watchlist Button Navigation Test', () => {

    it('should route to the "watclist" page when the button is clicked', () => {
      // Visit the homepage 
      cy.visit('http://localhost:4200'); 
  
      // Check the 'Watchlist' button exists
      cy.get('button[aria-label="Watchlist"]').should('exist');
  
      // Click the 'Watchlist' button
      cy.get('button[aria-label="Watchlist"]').click();
  
      // Check if the URL changes to the "watchlist" page
      cy.url().should('include', '/watchlist');
  
      // Check if "Watchlist" page content is visible
      cy.contains('Watchlist').should('exist'); 
    });
  });
  