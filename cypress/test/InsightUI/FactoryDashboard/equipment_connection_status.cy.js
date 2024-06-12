import { LoginPage, FactoryDashboard, GlobalMap } from '../../../support/pages/insightUI';

const loginPage = new LoginPage();
const globalMap = new GlobalMap();
const factoryDashboard = new FactoryDashboard();
const { ci, sapienceAPIPassword, sapienceAPIUser } = Cypress.env();

const plugIconColors = {
  green: 'rgb(0, 153, 34)',
  grey: 'rgb(153, 153, 153)',
  red: 'rgb(225, 37, 27)',
};

const addSnapshotDir = (shapshotName) => [ci ? 'ci' : 'local', shapshotName].join('/');

describe('CFIP-30970 - Equipment Connection Status', { testIsolation: false }, () => {
  before(() => {
    loginPage.login(sapienceAPIUser, sapienceAPIPassword);
    globalMap.visit();
    globalMap.goToFactory('MangeshFactory');
    factoryDashboard.addOrRemoveFilter('Line');
    factoryDashboard.addOrRemoveFilter('Connection Status');
    factoryDashboard.locators.filterDropdownByName('Line').select(['Non-continuous Line-1']);
  });

  context('CFIP-31826 - Verify Equipment connection Status Icon "Plug"', () => {
    after(() => {
      factoryDashboard.locators
        .filterDropdownByName('Connection Status')
        .select(['Connected', 'Disconnected', 'Disabled']);
    });

    it('should display green plug icon', () => {
      factoryDashboard.locators.filterDropdownByName('Connection Status').select(['Connected']);
      factoryDashboard.locators
        .plugIconByLineName('Non-continuous Line-1', 'eqp5018')
        .should('be.visible')
        .matchImageSnapshot(addSnapshotDir('connected_icon'));
    });

    it('should display grey plug icon', () => {
      factoryDashboard.locators.filterDropdownByName('Connection Status').select(['Disconnected']);
      factoryDashboard.locators
        .plugIconByLineName('Non-continuous Line-1', 'testeqpmk')
        .should('be.visible')
        .matchImageSnapshot(addSnapshotDir('disconnected_icon'));
    });

    it('should display red plug icon', () => {
      factoryDashboard.locators.filterDropdownByName('Connection Status').select(['Disabled']);
      factoryDashboard.locators
        .plugIconByLineName('Non-continuous Line-1', 'testeqpmk')
        .should('be.visible')
        .matchImageSnapshot(addSnapshotDir('disabled_icon'));
    });
  });

  it('CFIP-31828 - Verify Position of Equipment Status Icon "plug"', () => {
    factoryDashboard.locators
      .plugIconByLineName('Non-continuous Line-1', 'EQP5010')
      .should('be.visible')
      .should('have.css', 'bottom', '18px')
      .should('have.css', 'left', '12px');
  });

  it('CFIP-31829 - Verify Connection Status Icons in Correct Forms/Colors', () => {
    factoryDashboard.locators
      .plugIconByLineName('Non-continuous Line-1', 'EQP5010')
      .should('be.visible')
      .should('have.css', 'background-color', plugIconColors.green);
  });

  it('CFIP-31831 - Verify the Equipment Connection status on Insight as Disconnected from UI', () => {
    factoryDashboard.locators
      .plugIconByLineName('Non-continuous Line-1', 'eqp5016')
      .should('be.visible')
      .should('have.css', 'background-color', plugIconColors.red);
  });

  it('CFIP-31833 - Verify the Equipment Connection status on Insight as Disable from UI ', () => {
    factoryDashboard.locators.miniaturesByLineName('Non-continuous Line-1').click('right');
    factoryDashboard.locators
      .plugIconByLineName('Non-continuous Line-1', 'testeqpmk')
      .should('be.visible')
      .should('have.css', 'background-color', plugIconColors.grey);
  });
});
