describe('creation of a protected data with a valid email', () => {
  it('as user i want to create a protected data', () => {
    cy.contains('Login').click();
    cy.viewport(1000, 660);
    cy.get('@body').click(350, 600);
    // as user i want to go to "My protected Data" and see the list of my protected data (represented by Cards)
    cy.contains('Add new').click();
    //as user i want to choose Email the data type i want with a submenu
    cy.get('div[role="button"]').click();
    //as user i want to choose "Email address" type
    cy.contains('Email Address').click();
    //as user i want to enter my mail address in a placeholder
    cy.get('input[id="email"]').type(emailAddress()).type('@gmail.com');
    function emailAddress() {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

      for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }
    //as user, i want to Name my protected data in a placeholder
    cy.get('input[id="Name of your Protected Data"]').type(
      protectedDataNameMock()
    );
    function protectedDataNameMock() {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

      for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }
    //as user i want to create my protected data with a button
    cy.contains('Create Protected Data').click();
    //as user i want a phrase that tells me to wait a bit
    cy.contains(
      'Your protected data is currently being created. Please wait a few moments.'
    ).should('be.visible');
    //as user i want a hyperlink for my protected data (directing to iExec)
    cy.contains('See Detail').should('be.visible');
    //as user i want to verify the creation of the protected data on iExec Explorer
    cy.contains('See Details').click();
  });
});
