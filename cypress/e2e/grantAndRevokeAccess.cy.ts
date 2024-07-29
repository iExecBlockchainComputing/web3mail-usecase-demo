import { getRandomAddress } from '../support/utils.ts';

describe('Grant and revoke access to a protected data plus verify the property of a card', () => {
  it('As a user I want to verify the property of a protected data, grant and revoke access to an ETH address', () => {
    cy.login();

    cy.get('[data-cy="protected-data-card"]')
      .eq(0)
      .should('be.visible')
      .click();

    // Check the protected data address
    cy.get('[data-cy="protected-data-address"]').should(
      'contain',
      'Protected Data Address:'
    );

    // Check the owner
    cy.get('[data-cy="protected-data-owner"]').should('contain', 'Owned by:');

    // Check the IPFS link
    // Commented as this piece of info is not available at the moment
    // cy.get('li').eq(2).should('contain', 'IPFS link: ');

    // --- Grant access to some Ethereum wallet
    cy.get('[data-cy="authorize-new-user-button"]').click();

    //as user i want to enter an ETH address on a placeholder
    cy.contains('Ethereum Address').parent().type(getRandomAddress());

    //as user i want to enter the number of usage for the protected data
    cy.contains('Number of Access').parent().type('00');

    //as user i want to click on a button to validate the action
    cy.contains('Validate').click();

    cy.contains('New access granted!').should('be.visible');

    // Give queryClient.invalidateQueries a bit of time
    // TODO Handle this differently
    cy.wait(500);

    // --- Revoke access to my protected data
    cy.contains('Revoke access').click();

    cy.contains('The granted access has been successfully revoked!');
  });
});
