// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { BasicAuth, Client, CookieAuth, IManagedObject } from '@c8y/client';

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
       * Opens the specified path and waits until the UI has finished loading.
       */
      visitAndWaitToFinishLoading(path: string): Chainable<void>;

      getAttributes(attr: string): Chainable<string[]>;

      /**
       * Sets c8y UI language to the provided language or per default to English.
       * @example cy.setLanguage('de')
       */
      setLanguage(lang: string): Chainable<void>;

      /**
       * Performs a login via UI interaction, supporting both basic auth and OAuth.
       * @example cy.loginUI('cockpit')
       */
      loginUI(appContextPath: string): Chainable<Client>;
    }
  }
}

Cypress.Commands.add('hideCookieBanner', () => {
  const COOKIE_NAME = 'acceptCookieNotice';
  const COOKIE_VALUE = '{"required":true,"functional":true}';

  Cypress.on('window:before:load', (window) => {
    window.localStorage.setItem(COOKIE_NAME, COOKIE_VALUE);
  });
});

function waitForLoadingBarToDisappear() {
  cy.get('.loading-bar', { timeout: 20000 });
  cy.get('.loading-bar', { timeout: 20000 }).should('not.be.visible', { timeout: 60000 });
}

Cypress.Commands.add('visitAndWaitToFinishLoading', (path: string) => {
  // cy.intercept('/notification/realtime').as('CumulocityFinishedLoading');
  cy.visit(path);
  waitForLoadingBarToDisappear();
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

Cypress.Commands.add('setLanguage', (lang: string) => {
  cy.intercept(
    {
      method: 'GET',
      url: '/inventory/managedObjects?fragmentType=language*',
    },
    (req) => {
      const languageFragment = req.query.fragmentType.toString();
      const body: Partial<IManagedObject> = {
        id: '123',
        type: 'c8y_UserPreference',
        [languageFragment]: lang,
      };

      req.reply({ statusCode: 200, body });
    }
  );
  window.localStorage.setItem('c8y_language', lang);
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

Cypress.Commands.add(
  'getAttributes',
  {
    prevSubject: true,
  },
  (subject: JQuery<HTMLElement>, attr: string) => {
    const attrList = [];
    cy.wrap(subject).each(($el) => {
      cy.wrap($el, { log: false })
        .invoke('attr', attr)
        .then((value) => {
          if (value == null) {
            throw new Error(`${attr} not found.`);
          }
          attrList.push(value);
        });
    });
    return cy.wrap(attrList);
  }
);
