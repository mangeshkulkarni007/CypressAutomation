import { LoginPage, FactoryDashboard, GlobalMap } from '../../../support/pages/insightUI';

const loginPage = new LoginPage();
const globalMap = new GlobalMap();
const factoryDashboard = new FactoryDashboard();
const { sapienceAPIUser, sapienceAPIPassword } = Cypress.env();

describe('CFIP-30967 - List of Factories', () => {
  const NUMBER_OF_FACTORIES = 7;

  beforeEach(() => {
    loginPage.login(sapienceAPIUser, sapienceAPIPassword);

    cy.intercept(/^\/fcm\/factories\?.*timestamp=\d*$/).as('factories');
    globalMap.visit();
  });

  it('CFIP-31913 - Redirect to Factory Dashboard', function () {
    globalMap.goToRandomFactory();

    cy.get('@factoryName').then((factoryName) => {
      factoryDashboard.getNameOfFactory().should('eq', factoryName);
    });
  });

  it('CFIP-31914 - Multiple Factories on a list', () => {
    globalMap.assertSearchListLengthIs(NUMBER_OF_FACTORIES);
    globalMap.expectScrollbarAfterScreenResizing();
  });

  it('CFIP-31915 - Check number of lines in a single factory', () => {
    globalMap.goToRandomFactory();

    cy.get('@factoryLinesCount').then((factoryLinesCount) => {
      factoryDashboard.checkLinesCount(factoryLinesCount);
    });
  });
});
