import { Client, IResult, ICurrentTenant } from '@c8y/client';
import { keepLoginAlive } from '../support/c8y-oauth-commands';

describe('@c8y/client Test', () => {
  let client: Client;

  before(() => {
    cy.hideCookieBanner();
    cy.login();
    cy.visitAndWaitToFinishLoading('/apps/cypress-starter-kit/#/');
    cy.getClient().then((c) => (client = c));
  });

  beforeEach(() => {
    keepLoginAlive();
  });

  it('Can access current tenant', () => {
    cy.wrap(client.tenant.current()).should((result: IResult<ICurrentTenant>) => {
      expect(result.res.status).to.eq(200);
    });
  });
});
