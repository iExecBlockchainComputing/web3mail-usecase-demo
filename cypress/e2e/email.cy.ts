beforeEach(() => {
    cy.visit('/');
    cy.contains('Login').click();
    cy.get('w3m-modal').find('w3m-view-all-wallets-button').click();
    cy.get('w3m-wallet-button[name="MetaMask"]').click();
    cy.get('.css-vubbuv').click();
  });
  describe('email', () => {
    it("en tant qu'utilisateur je souhaite pouvoir me connecter via un bouton", () => {
      cy.contains('Login').click();
      cy.get('w3m-modal').find('w3m-view-all-wallets-button').click();
      cy.get('w3m-wallet-button[name="MetaMask"]').click();
      cy.get('.css-vubbuv').click();
    }),
      it("en tant qu'utilisateur je souhaite pouvoir aller sur la page 'My Protected Data' qui contient toute mes données protégés", () => {
        cy.contains('My Protected Data').click();
        cy.location().should((loc) => {
          expect(loc.href).to.eq('https://web3mail.iex.ec/protectedData');
        });
        cy.contains('Protect your data').click();
        cy.get('.css-qiwgdb.css-qiwgdb.css-qiwgdb').click();
        cy.contains('Email').click();
        cy.get('input[id="email"]').type('test@test.com');
        cy.get('input[id="Name of your Protected Data"]').type('azerty');
        cy.contains('Protect the data').click();
        cy.contains('Your data has been protected!').should('be.visible');
      });
  });
  