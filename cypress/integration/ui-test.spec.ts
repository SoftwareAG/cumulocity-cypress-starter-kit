import { keepLoginAlive } from '../support/c8y-oauth-commands';
import CumulocityUserInterfaceUtil from '../support/c8y-ui-util';

describe('UI Tests', () => {
  const ui = new CumulocityUserInterfaceUtil();

  before(() => {
    // make sure that our language on the tenant is english, otherwise text comparisons will fail
    cy.setLanguage('en');
    cy.hideCookieBanner();
    cy.login();
    cy.visitAndWaitToFinishLoading('/apps/cypress-starter-kit/#/');
  });

  beforeEach(() => {
    // cypress resets the apps state between every test so we need to prevent it from resetting our login cookie
    keepLoginAlive();
  });

  it('Test title', () => {
    ui.getTitle().should('contain.text', 'Home');
  });

  it('Test action bar', () => {
    ui.getToolbarListButtons('right').should(($btns) => {
      expect($btns.eq(0).text(), 'first item').to.contain('Add widget');
      expect($btns.eq(1).text(), 'second item').to.contain('Edit');
      expect($btns.eq(2).text(), 'third item').to.contain('Full screen');
    });
  });

  it('Test welcome to Cockpit widget', () => {
    // let's test if our cockpit app shows the typical 'Welcome to Cockpit' text
    cy.get('c8y-welcome-to-cockpit')
      .find('h2')
      .should(($h2) => {
        expect($h2.text()).to.equal('Welcome to Cockpit');
      });
  });

  it('Test navigation menu', () => {
    const expectedNodes = ['Home', 'Groups', 'Alarms', 'Data explorer', 'Reports', 'Configuration'];
    const expectedCollapsibleNodes = ['Groups', 'Configuration'];

    ui.toggleSideMenu();

    ui.getSideNavigationNodes().should('have.length', expectedNodes.length);

    ui.getSideNavigationNodeTitles().should('deep.equal', expectedNodes);

    ui.getCollapsibleRootNodeTitles().should('deep.equal', expectedCollapsibleNodes);
  });
});
