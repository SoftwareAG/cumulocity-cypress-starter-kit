import { Client, IResult, ICurrentTenant } from '@c8y/client';

describe("Your First Test", function () {
  let client: Client;
  before(() => {
    cy.hideCookieBanner()
    cy.loginUI('cypress-starter-kit')
    cy.createClient().then(clientTmp => {
      client = clientTmp;
    })
  })

  it("Can access current tenant", () => {
    cy.wrap(client.tenant.current()).should((result: IResult<ICurrentTenant>) => {expect(result.res.status).to.eq(200)})
  })

  // this test onyly passes, if your language is set to english of course ;)
  it("Expect Welcome to Cockpit to show", function () {
    
    // we wait until the loading spinner disappears, to make sure we don't need to set crazy high timeouts in the next steps
    // cy.waitFor(
      
    // )
    cy
        .get(".loading-bar", { timeout: 10000 })
        .should("not.be.visible", { timeout: 60000 })

    // let's test if our cockpit app shows the typical 'Welcome to Cockpit' text
    cy.get("c8y-welcome-to-cockpit", { timeout: 10000 })
      .find("h2")
      .should(($h2) => {
        expect($h2.text()).to.equal("Welcome to Cockpit")
      })
  })
})
