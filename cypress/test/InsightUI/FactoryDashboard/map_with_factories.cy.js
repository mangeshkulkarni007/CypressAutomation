import { LoginPage, FactoryDashboard, FactoryMaps, GlobalMap } from '../../../support/pages/insightUI';

describe('CFIP-30966 - Map With Factories', () => {
  const loginPage = new LoginPage();
  const globalMap = new GlobalMap();
  const dashboard = new FactoryDashboard();
  const factorymaps = new FactoryMaps();

  beforeEach(() => {
    loginPage.login(Cypress.env('sapienceAPIUser'), Cypress.env('sapienceAPIPassword'));
    globalMap.visit();

    cy.intercept('/fcm/factories/dashboard/**').as('factorydashboardpage');
  });

  it('CFIP-31869 - Verify Zoom functionality on Maps', () => {
    factorymaps.validateZoomInButton();
    factorymaps.validateZoomOutButton();
    factorymaps.validateMapSwipping();
    factorymaps.validateZoomOutButton();
    factorymaps.validateDoubleClickZoom();
  });

  it('CFIP-31865 - Verify Factory Map Tooltips; CFIP-31867 - Verify close proximity pins on map', () => {
    factorymaps
      .getTextOfPinOne()
      .as('PinNumberOne')
      .then((pinNameOne) => {
        cy.log(pinNameOne);
      });
    cy.wait('@factorydashboardpage').then((intercept) => {
      expect(intercept.response.body.factoryId).contains('-');
    });
    dashboard.getNameOfFactory().then((factoryNameOnDash) => {
      cy.get('@PinNumberOne').should('eq', factoryNameOnDash);
    });
    dashboard.clickGlobeIcon();
    factorymaps
      .getTextOfPinTwo()
      .as('PinNumberTwo')
      .then((pinNameTwo) => {
        cy.log(pinNameTwo);
      });
    cy.wait('@factorydashboardpage').then((intercept) => {
      expect(intercept.response.body.factoryId).contains('-');
    });
    dashboard.getNameOfFactory().then((factoryNameOnDash) => {
      cy.get('@PinNumberTwo').should('eq', factoryNameOnDash);
    });
  });

  it('CFIP-31866 - Redirection to Factory dashboard', () => {
    factorymaps
      .getTextOfPinOne()
      .as('PinNumberOne')
      .then((pinNameOne) => {
        cy.log(pinNameOne);
      });
    dashboard.assertUrlIsCorrect();
    cy.wait('@factorydashboardpage').then((intercept) => {
      expect(intercept.response.body.factoryId).contains('-');
    });
    dashboard.getNameOfFactory().then((factoryNameOnDash) => {
      cy.get('@PinNumberOne').should('eq', factoryNameOnDash);
    });
  });
});
