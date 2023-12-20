import { METAMASK_MOCK_NAME } from '../support/ethereum.ts';
import { getRandomString } from '../support/utils.ts';

describe('creation of a protected data as an upload file', () => {
  it('as user i want to create a protected data', () => {
    cy.login(METAMASK_MOCK_NAME);
    // as user i want to go to "My protected Data" and see the list of my protected data (represented by Cards)
    cy.contains('Add new').click();
    //as user i want to choose Email the data type i want with a submenu
    cy.contains('Select your data type').parent().click();
    //as user i want to choose "File" type
    cy.contains('File').click();
    //as user i want to select a file to upload
    cy.get('input[type=file][multiple]').selectFile(
      {
        contents: 'cypress/inputs/uploadfile',
      },
      { force: true }
    );
    //as user i want to name my protect data
    cy.get('input[id="Name of your Protected Data"]').type(getRandomString());
    //as user i want to create my protected data with a button
    cy.contains('Create Protected Data').click();
    //as user i want a hyperlink for my protected data (directing to iExec)
    cy.contains('See Detail').should('be.visible');
  });
});
