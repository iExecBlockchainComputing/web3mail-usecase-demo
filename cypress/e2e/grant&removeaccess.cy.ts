import { METAMASK_MOCK_NAME } from '../support/ethereum.ts';
import { getRandomAddress } from '../support/utils.ts';

describe('grant and remove access to a protected data plus verify the property of a card', () => {
  it('as user i want to verify the property of a protected data card, grant and revoke access to an ETH address', () => {
    cy.login(METAMASK_MOCK_NAME);
    //as user i want to click on a wild card containing a protected data and information about
    cy.get('[data-cy="protected-data-card"]')
      .eq(0)
      .should('be.visible')
      .click();
    //as user i want to check who owns this card
    cy.get('li').eq(0).should('contain', 'Owned by: ');
    //as user i want to check the Data protected address
    cy.get('li').eq(1).should('contain', 'Data Protected Address: ');
    //as user i want to check the IPFS link
    cy.get('li').eq(2).should('contain', 'IPFS link: ');
    //as user i want to grant access
    cy.contains('Authorize a new user').click();
    //as user i want to enter an ETH address on a placeholder
    cy.contains('Ethereum Address').parent().type(getRandomAddress());
    //as user i want to enter the number of usage for the protected data
    cy.contains('Number of Access').parent().type('00');
    //as user i want to click on a button to validate the action
    cy.contains('Validate').click();
    cy.contains('New access granted!').should('be.visible');
    //as user i want to remove access to my protected data
    cy.contains('Revoke access').click();
    cy.contains('The granted access has been successfully revoked!');
  });
});
