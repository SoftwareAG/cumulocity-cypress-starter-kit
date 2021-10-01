import { Client, IResult, ICurrentTenant } from '@c8y/client';

describe('Your First Test', function () {
  let client: Client;
  before(() => {
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
    cy.loginUI('cypress-starter-kit');
    cy.createClient().then((clientTmp) => {
      client = clientTmp;
    });
  });

  it('Can access current tenant', () => {
    cy.wrap(client.tenant.current()).should((result: IResult<ICurrentTenant>) => {
      expect(result.res.status).to.eq(200);
    });
  });

  // this test onyly passes, if your language is set to english of course ;)
  it('Expect Welcome to Cockpit to show', function () {
    // we wait until the loading spinner disappears, to make sure we don't need to set crazy high timeouts in the next steps
    // cy.waitFor(

    // )
    cy.get('.loading-bar', { timeout: 10000 }).should('not.be.visible', { timeout: 60000 });

    // let's test if our cockpit app shows the typical 'Welcome to Cockpit' text
    cy.get('c8y-welcome-to-cockpit', { timeout: 10000 })
      .find('h2')
      .should(($h2) => {
        expect($h2.text()).to.equal('Welcome to Cockpit');
      });
  });
});
