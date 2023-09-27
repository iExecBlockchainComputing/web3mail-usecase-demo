import { TEST_ADDRESS, toShortAddress } from '../support/ethereum';

describe('login', () => {
  it.only('can login with injected provider MetaMask', () => {
    cy.visit('/', { selectedWallet: 'metamask' });
    cy.contains('Login').click();
    cy.wait(5000);
    cy.get('w3m-modal')
      .find('w3m-wallet-button[name="MetaMask"]')
      .should('be.visible')
      .click();
    cy.contains(toShortAddress(TEST_ADDRESS));
  });

  it('fail', () => {
    cy.visit('/');
    cy.contains('Login').click();
    cy.contains('metamask').click();
    cy.contains(toShortAddress(TEST_ADDRESS));
  });
});
