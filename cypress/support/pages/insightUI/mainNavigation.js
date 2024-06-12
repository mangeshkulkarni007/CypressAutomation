import BasePage from '../base';

export default class MainNavigation extends BasePage {
  constructor() {
    super('/insight-ui/factory-dashboard', {
      appsDropdownButton: () => cy.get('div[class^=MuiToolbar-root]').contains('Insight'),
      appsDropdown: () => cy.getByTestId('appsDropdown').find('[role=menu]'),
      dashboardButton: () => cy.contains('a', 'Dashboards'),
      shiftSchedulesButton: () => cy.contains('a', 'Shift Schedules'),
      eventStateConfButton: () => cy.contains('a', 'Event State Configuration'),
      helpIcon: () => cy.get('a[title="Help"]'),
      aboutIcon: () => cy.get('button[title="About"]'),
      userDropdownButton: () => cy.get('div[class^=MuiToolbar-root]').find('button').last(),
      userDropdown: () => cy.contains('div', 'Sign out'),
      userDropdownUserDetails: () => cy.get('div[class*=MuiListItemText-root]'),
      mainLogo: () => cy.get('div[class^=MuiToolbar-root]').find('a').first(),
      logoutButton: () => cy.contains('li', 'Sign out'),
    });
  }

  // Main navigation elements in order they appear on the screen

  clickMainLogo() {
    this.locators.mainLogo().click();
    cy.location('pathname').should('eq', '/sapience');
  }

  openAppsDropdown() {
    this.locators.appsDropdownButton().click();
    this.locators.appsDropdown().should('be.visible');
    return this;
  }

  selectAppFromDropdown(application) {
    this.locators.appsDropdown().contains('li', application).click();
  }

  goToDashboard() {
    this.locators.dashboardButton().click();
    cy.location('pathname').should('eq', '/insight-ui/map'); // To be updated with correct URL after creating those pages
  }

  goToShiftSchedules() {
    this.locators.shiftSchedulesButton().click();
    cy.location('pathname').should('eq', '/insight-ui/shift-schedules');
  }

  goToEventStateConfiguration() {
    this.locators.eventStateConfButton().click();
    cy.location('pathname').should('eq', '/insight-ui/event-state-configuration');
  }

  gotoHelpPage() {
    this.locators.helpIcon().click();
    cy.url().should('contain', '/help');
  }

  openAboutModal() {
    this.locators.aboutIcon().click();
    cy.contains('About Cimetrix Sapience Platform').should('be.visible');
    cy.contains('I Agree').click();
  }

  openUserDropdown() {
    this.locators.userDropdownButton().click();
    this.locators.userDropdown().should('be.visible');
    return this;
  }

  verifyUserDropdownName(userName) {
    this.locators.userDropdownUserDetails().should('contain', userName);
    return this;
  }

  logOut() {
    this.locators.userDropdownButton().click();
    this.locators.logoutButton().click();
    cy.url().should('contain', 'insight-ui/login');
  }
}
