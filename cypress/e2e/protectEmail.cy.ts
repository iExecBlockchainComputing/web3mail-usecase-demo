import { getRandomString } from '../support/utils.ts';

describe('Creation of a protected data: valid email', () => {
  it('As a user I want to create a protected data type="email"', () => {
    // --- WHEN

    cy.login();

    cy.contains('Add new').click();

    cy.contains('Select your data type').parent().click();

    // Choose "Email address" type
    cy.get('[data-cy="email-address-select-item"]').click();

    // Type a random (but valid) email address
    cy.get('input[data-cy="email-address-input"]').type(
      getRandomString() + '@gmail.com'
    );

    // Type a random protected data name
    cy.get('input[data-cy="protected-data-name-input"]').type(
      getRandomString()
    );

    cy.get('[data-cy="create-button"]').click();

    // --- THEN

    cy.contains(
      'Your protected data is currently being created. Please wait a few moments.'
    ).should('be.visible');

    cy.contains('See Detail').should('be.visible');
  });
});
