describe("Your First Test", function () {

  before(() => {
    cy.hideCookieBanner()
    cy.login()
    cy.visit("/apps/cypress-starter-kit/index.html#/")
  })

  // this test onyly passes, if your language is set to english of course ;)
  it("Expect Welcome to Cockpit to show", function () {
    
    // we wait until the loading spinner disappears, to make sure we don't need to set crazy high timeouts in the next steps
    cy.waitFor(
      cy
        .get(".loading-bar", { timeout: 10000 })
        .should("not.be.visible", { timeout: 60000 })
    )

    // let's test if our cockpit app shows the typical 'Welcome to Cockpit' text
    cy.get("c8y-welcome-to-cockpit", { timeout: 10000 })
      .find("h2")
      .should(($h2) => {
        expect($h2.text()).to.equal("Welcome to Cockpit")
      })
  })
})
