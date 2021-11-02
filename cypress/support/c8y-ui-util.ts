class CumulocityUserInterfaceUtil {
  getToolbarListButtons(position: 'left' | 'right'): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#page-toolbar').find(`ul.navbar-${position} > li > button`);
  }

  getSideNaivgationMenu(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('c8y-navigator-outlet').find('nav');
  }
}

export default CumulocityUserInterfaceUtil;
