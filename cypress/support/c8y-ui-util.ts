class CumulocityUserInterfaceUtil {
    constructor() {}

    getToolbarListButtons(position: 'left' | 'right') {
        return cy.get("#page-toolbar")
        .find(`ul.navbar-${position} > li > button`);
    }

    getSideNaivgationMenu() {
        return cy.get('c8y-navigator-outlet')
        .find('nav');    
    }
}

export default CumulocityUserInterfaceUtil;