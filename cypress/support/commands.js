// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('hideCookieBanner', () => {
  const COOKIE_NAME = 'acceptCookieNotice';
  const COOKIE_VALUE = '{"required":true,"functional":true}';

  Cypress.on("window:before:load", (window) => {
    window.localStorage.setItem(COOKIE_NAME, COOKIE_VALUE);
  })
})

Cypress.Commands.add('login', () => {
  const tenant = Cypress.env('tenant')
  const user = Cypress.env('username')
  const password = Cypress.env('password')

  expect(
    tenant,
    'Missing or undefined tenant value. Check env CYPRESS_tenant'
  ).to.be.a('string').and.not.be.empty

  expect(user, 'Missing username value, set using CYPRESS_username').to.be.a('string').and.not.be.empty

  // do not show password in run log when doing the assertion
  if (typeof password !== 'string' || !password) {
    throw new Error('Missing password value, set using CYPRESS_password')
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
    expect(response.status).to.eq(200)
  })

  cy.getCookie('XSRF-TOKEN').should('exist')
  cy.getCookie('authorization').should('exist')
})

Cypress.Commands.add('logout', () => {
  // for this to work, tenant needs to have Oauth internal enabled for authorization
  cy.request({
    method: 'POST',
    url: '/user/logout',
    log: true,
  }).should((response) => {
    expect(response.status).to.eq(200)
  })

  cy.getCookie('XSRF-TOKEN').should('not.exist')
  cy.getCookie('authorization').should('not.exist')
})
