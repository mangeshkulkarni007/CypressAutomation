import { LoginPage, GlobalMap, EquipmentDashboard, FactoryDashboard } from '../../../support/pages/insightUI';

const loginPage = new LoginPage();
const globalMap = new GlobalMap();
const factoryDashboard = new FactoryDashboard();
const equipmentDashboard = new EquipmentDashboard();
const { sapienceAPIPassword, sapienceAPIUser } = Cypress.env();

describe('CFIP-30979 - Equipment Utilization Bar Chart', () => {
  beforeEach(() => {
    loginPage.login(sapienceAPIUser, sapienceAPIPassword);
    globalMap.visit();
    globalMap.goToFactory('MangeshFactory');
    factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'eqp5014').click();

    cy.fixture('equipmentDashboard/timeSeries').as('timeSeries');
  });

  it('CFIP-32212 - UI aspects', function () {
    equipmentDashboard.checkEquipmentUtilizationBarChart('Current Shift Utilization');

    equipmentDashboard.waitForTimeSeriesPollingAndStubResponse();

    equipmentDashboard.checkEquipmentUtilizationBarChart('Current Shift Utilization', 9, this.timeSeries);
  });
});
