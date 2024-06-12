import { LoginPage, FactoryDashboard, MainNavigation } from '../../../support/pages/insightUI';

describe('Main Navigation Bar', () => {
  const loginPage = new LoginPage();
  const dashboard = new FactoryDashboard();
  const mainNav = new MainNavigation();

  beforeEach(() => {
    loginPage.login(Cypress.env('sapienceAPIUser'), Cypress.env('sapienceAPIPassword'));
    dashboard.visit();
  });

  it('Checks opening Apps in a new tab, from the dropdown', () => {
    mainNav.openAppsDropdown();
    cy.window().then((win) => {
      cy.stub(win, 'open').as('open');
    });
    mainNav.selectAppFromDropdown('Settings');
    cy.get('@open').should('have.been.be.calledWith', '/settings-ui/');
    mainNav.openAppsDropdown();
    mainNav.selectAppFromDropdown('Compass');
    cy.get('@open').should('have.been.be.calledWith', '/compass-ui/');
  });

  it('Checks Main Navigation content', () => {
    mainNav.goToDashboard();
    mainNav.goToShiftSchedules();
    mainNav.goToEventStateConfiguration();
    mainNav.gotoHelpPage();
    mainNav.openAboutModal();
  });

  it('Checks the Users dropdown content', () => {
    mainNav.openUserDropdown();
    cy.log(Cypress.env('sapienceAPIUser'));
    mainNav.verifyUserDropdownName(Cypress.env('sapienceAPIUserNameInUI'));
  });

  it('Checks the Main Logo CTA', () => {
    mainNav.clickMainLogo();
  });

  it('Logs out the user', () => {
    mainNav.logOut();
    Cypress.session.clearAllSavedSessions();
  });
});
