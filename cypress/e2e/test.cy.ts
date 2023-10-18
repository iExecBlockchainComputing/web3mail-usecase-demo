beforeEach(() => {
  cy.visit('/', { selectedWallet: 'metamask' });
  cy.get('body').as('body');
  cy.on('uncaught:exception', (e, runnable) => {
    console.log('uncaught:exception', e);
    return false;
