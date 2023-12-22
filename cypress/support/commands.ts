/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import { WALLET_MAP, addEip6963ProvidersToWindow } from './ethereum.ts';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface VisitOptions {
      injectWallets?: boolean;
    }
    interface Chainable {
      login(walletName?: string): Chainable<void>;
    }
  }
}

// sets up the injected provider to be a mock ethereum provider with the given mnemonic/index
// eslint-disable-next-line no-undef
Cypress.Commands.overwrite(
  'visit',
  (
    original,
    url: string | Partial<Cypress.VisitOptions>,
    options?: Partial<Cypress.VisitOptions>
  ) => {
    assert(typeof url === 'string');
    cy.intercept('/service-worker.js', { statusCode: 404 }).then(() => {
      original({
        ...options,
        url: `${url}`,
        onBeforeLoad(win) {
          options?.onBeforeLoad?.(win);
          win.localStorage.clear();
          if (options?.injectWallets) {
            addEip6963ProvidersToWindow(win);
          }
        },
      });
    });
  }
);

Cypress.Commands.add('login', (walletName: string = WALLET_MAP.TEST.name) => {
  cy.contains('Login').click();
  cy.contains(walletName, { includeShadowDom: true }).click();
});
