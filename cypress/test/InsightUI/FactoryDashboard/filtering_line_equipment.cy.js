import { LoginPage, FactoryDashboard, GlobalMap } from '../../../support/pages/insightUI';

const loginPage = new LoginPage();
const globalMap = new GlobalMap();
const factoryDashboard = new FactoryDashboard();
const { sapienceAPIPassword, sapienceAPIUser } = Cypress.env();
const expectedDropdownOptionsCount = {
  line: 9,
  connectionStatus: 3,
};
const noEquipmentAssignedText = 'No equipment is assigned to the line.';

describe('CFIP-30973 - Filtering Line Equipment', () => {
  beforeEach(() => {
    loginPage.login(sapienceAPIUser, sapienceAPIPassword);
    globalMap.visit();
    globalMap.goToFactory('MangeshFactory');
  });

  it('CFIP-32079 - General UI', () => {
    factoryDashboard.checkFilteringIsNotApplied();
    factoryDashboard.locators.clearFiltersButton().should('be.visible').should('be.disabled');
    factoryDashboard.checkFilterByOptions();
    factoryDashboard.checkFilterDropdownOptions(expectedDropdownOptionsCount);
  });

  context('CFIP-32080 - Filtering combinations', () => {
    it('should filter lines by Line', () => {
      factoryDashboard.addOrRemoveFilter('Line');

      factoryDashboard.locators.lineByName('Non-continuous Line-1').should('be.visible');
      factoryDashboard.locators.lineByName('mkline').should('be.visible');
      factoryDashboard.checkPaginationNumberOfPages(2);

      // apply filtering:
      factoryDashboard.locators.filterDropdownByName('Line').select(['Non-continuous Line-1']);

      // check the results:
      factoryDashboard.locators.lineByName('Non-continuous Line-1').should('be.visible');
      factoryDashboard.locators.lineByName('mkline').should('not.exist');
      factoryDashboard.checkPaginationNumberOfPages(1);
      factoryDashboard.locators.clearFiltersButton().should('be.enabled');
    });

    it('should filter equipments by Equipment Model', () => {
      factoryDashboard.addOrRemoveFilter('Equipment Model');

      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'EQP5010').should('be.visible');
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'eqp5016').should('be.visible');
      factoryDashboard.locators
        .miniaturesByLineName('Non-continuous Line-1')
        .getByTestId('miniature')
        .should('have.length', 11);
      factoryDashboard.locators.miniaturesSliderByLineName('Non-continuous Line-1').should('be.visible');
      factoryDashboard.locators.equipmentByLineName('mkline', 'testeqp8').should('be.visible');

      // apply filtering:
      factoryDashboard.locators.filterDropdownByName('Equipment Model').select(['QualityCheckModel']);

      // check the results:
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'EQP5010').should('not.exist');
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'eqp5016').should('be.visible');
      factoryDashboard.locators
        .miniaturesByLineName('Non-continuous Line-1')
        .getByTestId('miniature')
        .should('have.length', 3);
      factoryDashboard.locators.miniaturesSliderByLineName('Non-continuous Line-1').should('not.exist');
      factoryDashboard.locators.equipmentByLineName('mkline', 'testeqp8').should('not.exist');
      factoryDashboard.locators.lineByName('mkline').should('contain.text', noEquipmentAssignedText);
      factoryDashboard.locators.clearFiltersButton().should('be.enabled');
    });

    it('should filter equipments by Connection Status', () => {
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'EQP5010');
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'eqp5016');
      factoryDashboard.locators
        .miniaturesByLineName('Non-continuous Line-1')
        .getByTestId('miniature')
        .should('have.length', 11);
      factoryDashboard.locators.miniaturesSliderByLineName('Non-continuous Line-1');
      factoryDashboard.locators.goToNextPageButton().click();
      factoryDashboard.locators.equipmentByLineName('testline5', 'eqp5039');

      // apply filtering:
      factoryDashboard.addOrRemoveFilter('Connection Status');
      factoryDashboard.locators.filterDropdownByName('Connection Status').select(['Disconnected']);

      // check the results:
      factoryDashboard.locators.goToNextPageButton().click();
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'EQP5010').should('not.exist');
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'eqp5016');
      factoryDashboard.locators
        .miniaturesByLineName('Non-continuous Line-1')
        .getByTestId('miniature')
        .should('have.length', 4);
      factoryDashboard.locators.miniaturesSliderByLineName('Non-continuous Line-1').should('not.exist');
      factoryDashboard.locators.equipmentByLineName('testline5', 'eqp5039').should('not.exist');
      factoryDashboard.locators.lineByName('testline5').should('contain.text', noEquipmentAssignedText);
      factoryDashboard.locators.clearFiltersButton().should('be.enabled');
    });

    it('should filter lines and equipments with all filters applied', () => {
      factoryDashboard.addOrRemoveFilter('Line');
      factoryDashboard.addOrRemoveFilter('Equipment Model');
      factoryDashboard.addOrRemoveFilter('Connection Status');

      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'EQP5010').should('be.visible');
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'eqp5016').should('be.visible');
      factoryDashboard.locators.miniaturesSliderByLineName('Non-continuous Line-1').should('be.visible');
      factoryDashboard.locators.equipmentByLineName('mkline', 'testeqp3').should('be.visible');
      factoryDashboard.locators.lineByName('testline4').should('be.visible');
      factoryDashboard.locators.equipmentByLineName('mkline', 'testeqp8').should('be.visible');

      // apply filtering:
      factoryDashboard.locators.filterDropdownByName('Line').select(['Non-continuous Line-1', 'mkline']);
      factoryDashboard.locators.filterDropdownByName('Equipment Model').select(['QualityCheckModel']);
      factoryDashboard.locators.filterDropdownByName('Connection Status').select(['Disconnected', 'Disabled']);

      // check the results:
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'EQP5010').should('not.exist');
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'eqp5016').should('be.visible');
      factoryDashboard.locators.miniaturesSliderByLineName('Non-continuous Line-1').should('not.exist');
      factoryDashboard.locators.equipmentByLineName('mkline', 'testeqp3').should('not.exist');
      factoryDashboard.locators.lineByName('mkline').should('contain.text', noEquipmentAssignedText);
      factoryDashboard.locators.lineByName('testline4').should('not.exist');
      factoryDashboard.locators.clearFiltersButton().should('be.enabled');
    });
  });

  context('CFIP-32081 - Clear the filter', () => {
    it('should clear filtering with CLEAR FILTERS button', () => {
      factoryDashboard.addOrRemoveFilter('Line');
      factoryDashboard.addOrRemoveFilter('Equipment Model');
      factoryDashboard.addOrRemoveFilter('Connection Status');
      factoryDashboard.locators.filterDropdownByName('Line').select(['Non-continuous Line-1', 'mkline']);
      factoryDashboard.locators.filterDropdownByName('Equipment Model').select(['QualityCheckModel', 'testgemmodel']);
      factoryDashboard.locators.filterDropdownByName('Connection Status').select(['Disconnected', 'Disabled']);

      // remove al filtering:
      factoryDashboard.locators.clearFiltersButton().click();

      // check the results:
      factoryDashboard.locators.clearFiltersButton().should('be.disabled');
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'EQP5010').should('be.visible');
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'eqp5016').should('be.visible');
      factoryDashboard.locators
        .miniaturesByLineName('Non-continuous Line-1')
        .getByTestId('miniature')
        .should('have.length', 11);
      factoryDashboard.locators.equipmentByLineName('mkline', 'testeqp8').should('be.visible');
      factoryDashboard.locators.filterDropdownByName('Line').should('not.exist');
      factoryDashboard.locators.filterDropdownByName('Equipment Model').should('not.exist');
      factoryDashboard.locators.filterDropdownByName('Connection Status').should('not.exist');
    });

    it('should clear filtering by removing filter type', () => {
      factoryDashboard.locators.lineByName('testline4').should('be.visible');

      factoryDashboard.addOrRemoveFilter('Line');
      factoryDashboard.addOrRemoveFilter('Equipment Model');
      factoryDashboard.addOrRemoveFilter('Connection Status');
      factoryDashboard.locators.filterDropdownByName('Line').select(['Non-continuous Line-1', 'mkline']);
      factoryDashboard.locators.filterDropdownByName('Equipment Model').select(['QualityCheckModel', 'testgemmodel']);
      factoryDashboard.locators.filterDropdownByName('Connection Status').select(['Disconnected', 'Disabled']);

      // remove Line filtering:
      factoryDashboard.addOrRemoveFilter('Line');

      // check the results:
      factoryDashboard.locators.clearFiltersButton().should('be.enabled');
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'EQP5010').should('not.exist');
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'eqp5016').should('be.visible');
      factoryDashboard.locators
        .miniaturesByLineName('Non-continuous Line-1')
        .getByTestId('miniature')
        .should('have.length', 5);
      factoryDashboard.locators.lineByName('mkline').should('contain.text', noEquipmentAssignedText);
      factoryDashboard.locators.filterDropdownByName('Line').should('not.exist');
      factoryDashboard.locators.filterDropdownByName('Equipment Model').should('be.visible');
      factoryDashboard.locators.filterDropdownByName('Connection Status').should('be.visible');
      // TODO: waiting for CFIP-32280 fix:
      // factoryDashboard.locators.lineByName('testline4').should('be.visible');
    });
  });
});
