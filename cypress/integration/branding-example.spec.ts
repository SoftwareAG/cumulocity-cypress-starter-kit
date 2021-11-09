import { keepLoginAlive } from '../support/c8y-oauth-commands';
import * as chaiColors from 'chai-colors';

describe('Test Branding', () => {
  before(() => {
    chai.use(chaiColors);

    cy.modifyTenantBrandingRequests({
      brandingCssVars: {
        'brand-logo-img-height': '40%',
        'font-family-base': "'Source Sans Pro', sans-serif",
        'header-hover-color': '#78b72a',
        'body-background-color': '#efefef',
        'navigator-font-family': 'var(--font-family-headings)',
        'navigator-header-bg': '#111a23',
        'brand-complementary': '#ccc',
        'header-text-color': 'white',
        'header-color': '#111a23',
        'navigator-active-color': 'white',
        'navigator-active-bg': '#538a0e',
        'font-family-headings': "'SourceSansPro-Regular', Verdana, sans-serif",
        'brand-primary': '#78b72a',
        'brand-light': '#78b72a',
        'navigator-bg-color': '#111a23',
        'brand-dark': 'black',
      },
      cookieBanner: {},
    });
    cy.hideCookieBanner();
    cy.login();
    cy.visitAndWaitToFinishLoading('/apps/cypress-starter-kit/#/');
  });

  beforeEach(() => {
    keepLoginAlive();
  });

  it('Header bar should use custom branding', function () {
    // Background Color
    cy.get('.header-bar').should('have.css', 'background-color').and('be.colored', '#111a23');

    // Text Color
    cy.get('.header-bar').should('have.css', 'color').and('be.colored', '#ffffff');
  });
});
