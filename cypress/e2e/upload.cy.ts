describe('creation of a protected data as an upload file', () => {
  it('as user i want to create a protected data', () => {
    cy.visit('/', { selectedWallet: 'metamask' });
    cy.get('body').as('body');
    cy.on('uncaught:exception', (e, runnable) => {
      console.log('uncaught:exception', e);
      return false;
    });
    cy.contains('Login').click();
    cy.viewport(1000, 660);
    cy.get('@body').click(350, 600);
    // as user i want to go to "My protected Data" and see the list of my protected data (represented by Cards)
    cy.contains('Protect your data').click();
    //as user i want to choose Email the data type i want with a submenu
    cy.get('div[role="button"]').click();
    //as user i want to choose "File" type
    cy.contains('File').click();
    //as user i want to select a file to upload
    cy.get('input[type=file][multiple]').selectFile(
      {
        contents: 'cypress/support/uploadfile',
      },
      { force: true }
    );
    //as user i want to name my protect data
    cy.get('input[id="Name of your Protected Data"]').type('Uploadfile');
    //as user i want to create my protected data with a button
    cy.contains('Protect the data').click();
    //as user i want a hyperlink for my protected data (directing to iExec)
    cy.contains('See Detail').should('be.visible');
    //as user i want to verify the creation of the protected data on iExec Explorer
    cy.contains('See Details').click();
  });
});
