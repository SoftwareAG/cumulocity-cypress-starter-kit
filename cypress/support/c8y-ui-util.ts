class CumulocityUserInterfaceUtil {
  getTitle(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('c8y-title-outlet').find('h1');
  }

  getToolbarListButtons(position: 'left' | 'right'): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#page-toolbar').find(`ul.navbar-${position} > li > button`);
  }

  getSideNavigationMenu(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('c8y-navigator-outlet').find('nav');
  }

  toggleSideMenu(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.navigator-toggle').click();
  }

  getSideNavigationNodes(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getSideNavigationMenu().find('ul.navigatorContent').children('c8y-navigator-node-display');
  }

  getSideNavigationNodeTitles(): Cypress.Chainable<string[]> {
    return this.getSideNavigationMenu().find('ul.navigatorContent').find('a.root-link').getAttributes('title');
  }

  getCollapsibleRootNodeTitles(): Cypress.Chainable<string[]> {
    return this.getSideNavigationMenu().find('ul.navigatorContent').find('a.root-link.parent').getAttributes('title');
  }
}

export default CumulocityUserInterfaceUtil;
