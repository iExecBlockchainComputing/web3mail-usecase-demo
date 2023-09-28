import { TEST_ADDRESS, toShortAddress } from '../support/ethereum';

describe('login', () => {
  it('can login with injected provider MetaMask', () => {
    cy.visit('/', { selectedWallet: 'metamask' });
    /**
     * web3modal uses shadow DOM and custom elements
     * however cypress should handle shadow DOM manipulation,
     * programmatically clicking custom elements in the shadow dom
     * produced non consistent 'this' to be passed causing errors
     * To workaround this issue we "blindly" click the expected button locations
     * without relying on shadow DOM
     */
    //
    cy.get('body').as('body');
    // catch a web3modal uncaught exception
    cy.on('uncaught:exception', (e, runnable) => {
      console.log('uncaught:exception', e);
      return false;
    });
    cy.contains('Login').click();
    // wait web3modal to open
    cy.wait(2000);
    // click metamask button coordinates on a known wiewport
    cy.viewport(1000, 660);
    cy.get('@body').click(350, 600);
    // restore config viewport
    cy.viewport(
      Cypress.config('viewportWidth'),
      Cypress.config('viewportHeight')
    );
    cy.contains(toShortAddress(TEST_ADDRESS));
  });
});
