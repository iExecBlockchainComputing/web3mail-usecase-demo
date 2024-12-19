import { getRandomString } from '../support/utils.ts';

describe('Creation of a protected data: invalid email', () => {
  it('As a user I want to create a protected data type="email"', () => {
    // --- WHEN

    cy.login();

    cy.contains('Add new').click();

    cy.contains('Select your data type').parent().click();

    // Choose "Email address" type
    cy.get('[data-cy="email-address-select-item"]').click();

    // Type an INVALID email address
    cy.get('input[data-cy="email-address-input"]').type('notanemail.blublu');

    // Type a random protected data name
    cy.get('input[data-cy="protected-data-name-input"]').type(
      getRandomString()
    );

    cy.get('[data-cy="create-button"]').click();

    // --- THEN

    // See email error
    cy.contains('Please enter a valid email address').should('be.visible');
  });
});
