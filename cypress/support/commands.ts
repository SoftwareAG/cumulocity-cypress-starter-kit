// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { BasicAuth, Client, CookieAuth } from '@c8y/client';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Hides c8y CookieBanner.
       * @example cy.hideCookieBanner()
       */
      hideCookieBanner(): Chainable<void>;

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

      /**
       * Sets c8y UI language to the provided language or per default to English.
       * @example cy.setLanguage('de')
       */
      setLanguage(lang?: string): Chainable<void>;

      createClient(): Chainable<Client>;

      /**
       * Performs a login via UI interaction, supporting both basic auth and OAuth.
       * @example cy.loginUI('cockpit')
       */
      loginUI(appContextPath: string): Chainable<Client>;

      /**
       * Allows to use a custom response body for the request to: '/apps/public/public-options/options.json'.
       * If 'jsonResponseBody' is not defined request will be answered with status 404.
       * @example cy.modifyTenantBrandingRequests({name: 'Tristan'})
       */
      modifyTenantBrandingRequests(jsonResponseBody?: any): Chainable<void>;
    }
  }
}

// it ('Application compiled', () => {
//   cy.intercept({
//     method: 'GET',
//     url: '/apps/*/*',
//   }).as('hasCompiled');
//   cy.visit(`/apps/cypress-starter-kit/#/`);
//   cy.wait('@hasCompiled', {responseTimeout: 120000}).its('response.statusCode').should('equal', 200);
// })

Cypress.Commands.add('hideCookieBanner', () => {
  const COOKIE_NAME = 'acceptCookieNotice';
  const COOKIE_VALUE = '{"required":true,"functional":true}';

  Cypress.on('window:before:load', (window) => {
    window.localStorage.setItem(COOKIE_NAME, COOKIE_VALUE);
  });
});

Cypress.Commands.add('createClient', () => {
  const client = new Client(new CookieAuth());
  return cy.wrap(client);
});

Cypress.Commands.add('login', () => {
  const tenant = Cypress.env('tenant');
  const user = Cypress.env('username');
  const password = Cypress.env('password');

  expect(tenant, 'Missing or undefined tenant value. Check env CYPRESS_tenant').to.be.a('string').and.not.be.empty;

  expect(user, 'Missing username value, set using CYPRESS_username').to.be.a('string').and.not.be.empty;

  // do not show password in run log when doing the assertion
  if (typeof password !== 'string' || !password) {
    throw new Error('Missing password value, set using CYPRESS_password');
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
      password: password,
    },
    body: {
      grant_type: 'PASSWORD',
      username: user,
      password: password,
      tfa_code: 'undefined',
    },
    log: true,
  }).should((response) => {
    expect(response.status).to.eq(200);
  });

  cy.getCookie('XSRF-TOKEN').should('exist');
  cy.getCookie('authorization').should('exist');
});

Cypress.Commands.add('logout', () => {
  // for this to work, tenant needs to have Oauth internal enabled for authorization
  cy.request({
    method: 'POST',
    url: '/user/logout',
    log: true,
  }).should((response) => {
    expect(response.status).to.eq(200);
  });

  cy.getCookie('XSRF-TOKEN').should('not.exist');
  cy.getCookie('authorization').should('not.exist');
});

Cypress.Commands.add('setLanguage', (lang) => {
  window.localStorage.setItem('c8y_language', lang || 'en');
});

Cypress.Commands.add('modifyTenantBrandingRequests', (jsonResponse?: any) => {
  cy.intercept(
    {
      method: 'GET',
      url: '/apps/public/public-options/options.json*',
    },
    { statusCode: jsonResponse ? 200 : 404, body: jsonResponse }
  ).as('blockTenantBrandingRequests');
});

Cypress.Commands.add('loginUI', (appContextPath: string) => {
  const username = Cypress.env('username');
  const password = Cypress.env('password');
  const tenant = Cypress.env('tenant');

  // it is ok for the tenant and username to be visible in the Command Log
  expect(tenant, 'Missing tenant value, set using CYPRESS_tenant').to.be.a('string').and.not.be.empty;

  expect(username, 'Missing username value, set using CYPRESS_username').to.be.a('string').and.not.be.empty;

  // but the password value should not be shown
  if (typeof password !== 'string' || !password) {
    throw new Error('Missing password value, set using CYPRESS_password');
  }

  cy.visit(`/apps/${appContextPath}/#/`);
  cy.get('input[name=tenant]', { timeout: 10000 }).type(tenant);
  cy.get('input[name=user]').type(username);
  cy.intercept({
    method: 'GET',
    url: '/tenant/currentTenant',
  }).as('accessCurrentTenant');
  cy.intercept({
    method: 'POST',
    url: '/tenant/oauth*',
  }).as('requestOAuthCookie');
  cy.intercept({
    method: 'GET',
    url: '/user/currentUser',
  }).as('accessCurrentUser');
  cy.get('input[name=password]').type(`${password}{enter}`, { log: false });

  // credentials valid via basic auth
  cy.wait('@accessCurrentTenant').its('response.statusCode').should('equal', 200);
  // current user fetched via basic auth or oauth
  cy.wait('@accessCurrentUser').its('response.statusCode').should('equal', 200);

  // If cookie was requested, tenant uses OAuth
  let client: Client;
  return cy
    .get('@requestOAuthCookie.all')
    .should((requests) => {
      if (requests.length === 1) {
        client = new Client(new CookieAuth());
      } else if (requests.length === 0) {
        client = new Client(new BasicAuth({ tenant, user: username, password }));
      }
      // Cookie should only be requested maximum a single time
      return requests.length <= 1;
    })
    .then(() => {
      return client;
    });
});
