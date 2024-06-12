import { LoginPage, GlobalMap } from '../../../support/pages/insightUI';

describe('CFIP-30968 - Search Factories', () => {
  const loginPage = new LoginPage();
  const globalMap = new GlobalMap();
  const expectedError = 'No results found, please review your search criteria';

  before(() => {
    loginPage.login(Cypress.env('sapienceAPIUser'), Cypress.env('sapienceAPIPassword'));

    cy.intercept(/^\/fcm\/factories\?.*timestamp=\d*$/).as('factories');
    globalMap.visit();
  });

  it('CFIP-32042 - list of factories: search box', () => {
    globalMap.loadMapFactories();
    globalMap.locators.getSearchInput().should('have.attr', 'placeholder', 'Search factories');
    globalMap.typeAndSearchNthFactory(1);
    globalMap.assertSearchListLengthIs(1);
    globalMap.clearSearchInput();
    globalMap.searchFactoryByName('randomName');
    globalMap.assertSearchListLengthIs(0);
    globalMap.locators.getErrorMessage().should('have.text', expectedError);
  });
});
