import { getRandomString } from '../support/utils.ts';

describe('Creation of a protected data: file', () => {
  it('As a user I want to create a protected data type="file"', () => {
    // --- WHEN

    cy.login();

    cy.contains('Add new').click();

    cy.contains('Select your data type').parent().click();

    // Choose "File" type
    cy.get('[data-cy="file-select-item"]').click();

    cy.get('input[type=file][multiple]').selectFile(
      {
        contents: 'cypress/inputs/uploadfile',
      },
      { force: true }
    );

    // Type a random protected data name
    cy.get('input[data-cy="protected-data-name-input"]').type(
      getRandomString()
    );

    cy.get('[data-cy="create-button"]').click();

    // --- THEN

    cy.contains('See Detail').should('be.visible');
  });
});
