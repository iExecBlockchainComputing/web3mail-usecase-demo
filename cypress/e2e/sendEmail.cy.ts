import { WALLET_MAP } from '../support/ethereum.ts';
import { getRandomString } from '../support/utils.ts';

describe('Send an email using web3mail', () => {
  before(() => {
    // create a contact
    cy.visit('/', { injectWallets: true });
    cy.login(WALLET_MAP.RANDOM.name);
    cy.contains('Add new').click();
    cy.contains('Select your data type').parent().click();
    cy.get('[data-cy="email-address-select-item"]').click();
    cy.get('input[data-cy="email-address-input"]').type(
      getRandomString() + '@' + getRandomString(4) + getRandomString(3)
    );
    cy.get('input[data-cy="protected-data-name-input"]').type(
      getRandomString()
    );
    cy.contains('Create Protected Data').click();
    cy.contains(
      'Your protected data is currently being created. Please wait a few moments.'
    ).should('be.visible');
    cy.contains('See Detail').should('be.visible');

    // Give queryClient.invalidateQueries a bit of time
    // TODO Handle this differently
    cy.wait(500);

    // authorize the TEST wallet to send an email
    cy.contains('My Protected Data').click();
    cy.get('[data-cy="protected-data-card"]')
      .eq(0)
      .should('be.visible')
      .click();
    cy.get('[data-cy="authorize-new-user-button"]').click();
    cy.contains('Ethereum Address')
      .parent()
      .type(WALLET_MAP.TEST.wallet.address);
    cy.contains('Validate').click();
    cy.contains('New access granted!').should('be.visible');
  });

  it('As a user I want to send an email with web3mail', () => {
    cy.login();

    cy.contains('Send Email').click();

    cy.contains('Send web3 email').click();

    cy.get('input[data-cy="sender-name-input"]').type('David');

    // See how many characters still left in the sender name input
    cy.contains('15 characters').should('be.visible');

    cy.get('input[data-cy="message-subject-input"]').type('email testing');

    // See how many characters still left in the message subject input
    cy.contains('65 characters').should('be.visible');

    cy.get('[data-cy="email-content-type-select"]').click();
    // Choose "text/html" type
    cy.contains('text/html').click({ force: true });

    cy.get('textarea[data-cy="message-content-textarea"]').type(
      'Hello, this is a test email :)'
    );

    // See how many characters still left in the message content textarea
    cy.contains('511970').should('be.visible');

    //as user i want to click on a button in order to send my email
    cy.get('[data-cy="send-email-button"]').click();

    // --- THEN

    cy.contains('Your email is being sent.').should('be.visible');
  });
});
