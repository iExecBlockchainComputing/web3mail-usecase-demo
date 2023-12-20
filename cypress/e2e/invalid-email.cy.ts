import { METAMASK_MOCK_NAME } from '../support/ethereum.ts';

describe('creation of a protected data with an invalid email', () => {
  it('as user i want to create a protected data', () => {
    cy.login(METAMASK_MOCK_NAME);
    // as user i want to go to "My protected Data" and see the list of my protected data (represented by Cards)
    cy.contains('Add new').click();
    //as user i want to choose Email the data type i want with a submenu
    cy.contains('Select your data type').parent().click();
    //as user i want to choose "Email address" type
    cy.contains('Email Address').click();
    //as user i want to enter my mail address in a placeholder
    cy.get('input[id="email"]').type('notanemail.blublu');
    //as user, if i enter a invalid email, i want to be warn
    cy.contains('Please enter a valid email address').should('be.visible');
  });
});
