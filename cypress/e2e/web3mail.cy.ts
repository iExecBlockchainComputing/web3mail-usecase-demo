describe('send an email using web3mail', () => {
  it('as user i want to send a mail with web3mail', () => {
    cy.contains('Login').click();
    cy.viewport(1000, 660);
    cy.get('@body').click(350, 600);
    //as user i want to go to "Send mail" section
    cy.contains('Send Email').click();
    //as user i want to click on a button in order to send a email
    cy.contains('Send web3 email').click();
    //as user i want to enter a sender name in a placeholder
    cy.get('input[id="sender-name"]').type('David');
    //as user i want to see how man y caracters it remains in the placeholder
    cy.contains('15').should('be.visible');
    //as user i want to type a message subject in a placeholder
    cy.get('input[id="Message subject"]').type('email testing');
    //as user i want to see how man y caracters it remains in the message subject
    cy.contains('65').should('be.visible');
    //as user i want to select the content type (plain text/html)
    cy.get('div[id="content-type-select"]').click();
    //as user i want to choose text/html type
    cy.contains('text/html').click({ force: true });
    //as user i want to type my email in a placeholder
    cy.get('textarea[id="textArea"]').type('Hello, this is an email test :)', {
      force: true,
    });
    //as user i want to see how man y caracters it remains in mailbox
    cy.contains('511969').should('be.visible');
    //as user i want to click on a button in order to send my email
    cy.get('.sendEmailButton').click();
    //as user i want a pop up that inform me the mail is send
    cy.contains('The email has been sent!').should('be.visible');
  });
});
