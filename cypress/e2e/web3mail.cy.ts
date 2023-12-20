import { WALLET_MAP } from '../support/ethereum.ts';
import { getRandomString } from '../support/utils.ts';

describe('send an email using web3mail', () => {
  before(() => {
    // create a contact
    cy.visit('/', { injectWallets: true });
    cy.login(WALLET_MAP.RANDOM.name);
    cy.contains('Add new').click();
    cy.contains('Select your data type').parent().click();
    cy.contains('Email Address').click();
    cy.get('input[id="email"]').type(
      getRandomString() + '@' + getRandomString(4) + getRandomString(3)
    );
    cy.get('input[id="Name of your Protected Data"]').type(getRandomString());
    cy.contains('Create Protected Data').click();
    cy.contains(
      'Your protected data is currently being created. Please wait a few moments.'
    ).should('be.visible');
    cy.contains('See Detail').should('be.visible');

    // authorize the TEST wallet to send an email
    cy.contains('My Protected Data').click();
    cy.get('[data-cy="protected-data-card"]')
      .eq(0)
      .should('be.visible')
      .click();
    cy.contains('Authorize a new user').click();
    cy.contains('Ethereum Address')
      .parent()
      .type(WALLET_MAP.TEST.wallet.address);
    cy.contains('Validate').click();
    cy.contains('New access granted!').should('be.visible');
  });
  it('as user i want to send a mail with web3mail', () => {
    cy.login();
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
    //as user i want to see how man y characters it remains in the message subject
    cy.contains('65').should('be.visible');
    //as user i want to select the content type (plain text/html)
    cy.get('div[id="content-type-select"]').click();
    //as user i want to choose text/html type
    cy.contains('text/html').click({ force: true });
    //as user i want to type my email in a placeholder
    cy.get('textarea[id="textArea"]').type('Hello, this is a test email :)');
    //as user i want to see how man y caracters it remains in mailbox
    cy.contains('511970').should('be.visible');
    //as user i want to click on a button in order to send my email
    cy.get('[data-cy="send-email-button"]').click();
    //as user i want a pop up that inform me the mail is send
    cy.contains('The email has been sent!').should('be.visible');
  });
});
