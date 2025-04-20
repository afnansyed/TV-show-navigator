/*describe(' Get Started Button Navigation Test', () => {
  it('should route to the "shows" page when the button is clicked', () => {
    // Visit the homepage 
    cy.visit('http://localhost:4200'); 

    // Check the 'Get Started' button exists
    cy.get('button')
      .contains('Get Started')  
      .should('be.visible');

    // Click the 'Get Started' button
    cy.get('button')
      .contains('Get Started')  
      .click();

    // Check if the URL changes to the "shows" page
    cy.url().should('include', '/shows');  

    // Check if "shows" page content is visible
    cy.get('h1').contains('Show')  
      .should('be.visible');
  });
});*/

//Updated cypress test
describe('Shows Button Navigation Test', () => {

  it('should route to the "shows" page when the button is clicked', () => {
    // Visit the homepage 
    cy.visit('http://localhost:4200'); 

    // Check the 'Shows' button exists
    cy.get('button[aria-label="Shows"]').should('exist');

    // Click the 'Shows' button
    cy.get('button[aria-label="Shows"]').click();

    // Check if the URL changes to the "Shows" page
    cy.url().should('include', '/shows');

    // Check if "shows" page content is visible
    cy.contains('Shows').should('exist'); 
  });
});
