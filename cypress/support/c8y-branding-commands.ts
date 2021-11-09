declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Allows to use a custom response body for the request to: '/apps/public/public-options/options.json'.
       * If 'json' is not defined request will be answered with status 404.
       * @example cy.modifyTenantBrandingRequests({name: 'Tristan'})
       */
      modifyTenantBrandingRequests(json?: BrandingJSON): Chainable<void>;
    }
  }
}

export interface BrandingJSON {
  brandingCssVars: Record<string, string>;
  cookieBanner: Record<string, unknown>;
}

function modifyTenantBrandingRequests(json?: BrandingJSON): Cypress.Chainable<void> {
  return cy
    .intercept(
      {
        method: 'GET',
        url: '/apps/public/public-options/options.json*',
      },
      { statusCode: json ? 200 : 404, body: json }
    )
    .as('blockTenantBrandingRequests');
}
Cypress.Commands.add('modifyTenantBrandingRequests', modifyTenantBrandingRequests);
