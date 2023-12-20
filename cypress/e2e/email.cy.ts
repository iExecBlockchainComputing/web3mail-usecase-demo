import { METAMASK_MOCK_NAME } from '../support/ethereum.ts';
import { getRandomString } from '../support/utils.ts';

describe('creation of a protected data with a valid email', () => {
  it('as user i want to create a protected data', () => {
    cy.login(METAMASK_MOCK_NAME);
    // as user i want to go to "My protected Data" and see the list of my protected data (represented by Cards)
    cy.contains('Add new').click();
    //as user i want to choose Email the data type i want with a submenu
    cy.contains('Select your data type').parent().click();
    //as user i want to choose "Email address" type
    cy.contains('Email Address').click();
    //as user i want to enter my mail address in a placeholder
    cy.get('input[id="email"]').type(getRandomString() + '@gmail.com');
    //as user, i want to Name my protected data in a placeholder
    cy.get('input[id="Name of your Protected Data"]').type(getRandomString());
    //as user i want to create my protected data with a button
    cy.contains('Create Protected Data').click();
    //as user i want a phrase that tells me to wait a bit
    cy.contains(
      'Your protected data is currently being created. Please wait a few moments.'
    ).should('be.visible');
    //as user i want a hyperlink for my protected data (directing to iExec)
    cy.contains('See Detail').should('be.visible');
  });
});
