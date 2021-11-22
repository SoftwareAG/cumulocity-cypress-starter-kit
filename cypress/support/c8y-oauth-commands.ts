import { Client, CookieAuth } from '@c8y/client';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Performs login using credentials from cypress env variables.
       * @example cy.login()
       */
      login(): Chainable<void>;

      /**
       * Performs logout.
       * @example cy.logout()
       */
      logout(): Chainable<void>;

      getClient(): Chainable<Client>;
    }
  }
}

function login(): void {
  const tenant = Cypress.env('tenant');
  const user = Cypress.env('username');
  const password = Cypress.env('password');

  expect(tenant, 'Missing or undefined tenant value. Check env CYPRESS_tenant').to.be.a('string').and.not.be.empty;

  expect(user, password ? 'Undefined username' : 'Username not found with env CYPRESS_' + user + '_username').to.not.be
    .undefined;

  // do not show password in run log when doing the assertion
  if (typeof password !== 'string' || !password) {
    throw new Error('Missing or undefined password value');
  }

  // for this to work, tenant needs to have Oauth internal enabled for authorization
  cy.request({
    method: 'POST',
    url: '/tenant/oauth?tenant_id=' + tenant,
    form: true,
    headers: {
      usexbasic: true,
      'x-cumulocity-application-key': 'cockpit-application-key',
    },
    auth: {
      username: user,
      password,
    },
    body: {
      grant_type: 'PASSWORD',
      username: user,
      password,
      tfa_code: 'undefined',
    },
    log: true,
  }).should((response) => {
    expect(response.status).to.eq(200);
  });

  cy.getCookie('XSRF-TOKEN').should('exist');
  cy.getCookie('authorization').should('exist');
}

function logout() {
  cy.request({
    method: 'POST',
    url: '/user/logout',
    log: true,
  }).should((response) => {
    expect(response.status).to.eq(200);
  });

  cy.getCookie('XSRF-TOKEN').should('not.exist');
  cy.getCookie('authorization').should('not.exist');
}

export function keepLoginAlive(): void {
  Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'authorization');
}

function getClient() {
  cy.getCookie('XSRF-TOKEN').should('exist');
  return cy.wrap(new Client(new CookieAuth()));
}

Cypress.Commands.add('login', login);
Cypress.Commands.add('logout', logout);
Cypress.Commands.add('getClient', getClient);
