describe('grant and remove access to a protected data plus verify the property of a card', () => {
  it('as user i want to verify the property of a protected data card, grant and revoke access to an ETH address', () => {
    cy.contains('Login').click();
    cy.viewport(1000, 660);
    cy.get('@body').click(350, 600);
    //as user i want to click on a wild card containing a protected data and information about
    cy.get('[data-cy="protectedDataCard"]').eq(0).should('be.visible').click();
    //as user i want to check who owns this card
    cy.get('li').eq(0).should('contain', 'Owned by ');
    //as user i want to check the Data protected address
    cy.get('li').eq(1).should('contain', 'Data Protected Address');
    //as user i want to check the IPFS link
    cy.get('li').eq(2).should('contain', 'IPFS link');
    //as user i want to grant access
    cy.get('button[type="button"]').eq(4).click();
    //as user i want to enter an ETH address on a placeholder
    cy.get('input[id=ethAddress').type(
      '0x78cf11ee2e3cd7bc2677157da24229e3c98c5cae'
    );
    //as user i want to enter the number of usage for the protected data
    cy.get('input[id="age"]').type('00');
    //as user i want to click on a button to validate the action
    cy.contains('Validate').click();
    cy.contains('New access granted!').should('be.visible');
    //as user i want to remove access to my protected data
    cy.get('button[aria-label="delete"]').click();
    cy.contains('The granted access has been successfully revoked!');
    //as user i want to click on a  button to disconnect
    cy.get('button[type="button"]').eq(3).click();
  });
});
