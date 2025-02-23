describe(' Get Started Button Navigation Test', () => {
  it('should route to the "shows" page when the button is clicked', () => {
    // Visit the homepage 
    cy.visit('http://localhost:4200'); 

    // Check the 'Get Started' button exists
    cy.get('button')
      .contains('Get Started')  
      .should('be.visible');

    // Click the 'Get Started' button
    cy.get('button')
      .contains('Get Started')  // Adjust if necessary
      .click();

    // Check if the URL changes to the "shows" page
    cy.url().should('include', '/shows');  

    // Check if "shows" page content is visible
    cy.get('h1').contains('Show')  
      .should('be.visible');
  });
});
