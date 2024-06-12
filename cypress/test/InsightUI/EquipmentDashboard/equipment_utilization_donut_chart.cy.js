import { LoginPage, GlobalMap, EquipmentDashboard, FactoryDashboard } from '../../../support/pages/insightUI';

const loginPage = new LoginPage();
const globalMap = new GlobalMap();
const factoryDashboard = new FactoryDashboard();
const equipmentDashboard = new EquipmentDashboard();
const { sapienceAPIPassword, sapienceAPIUser } = Cypress.env();

describe('CFIP-30978 - Equipment Utilization Donut Chart', () => {
  beforeEach(() => {
    loginPage.login(sapienceAPIUser, sapienceAPIPassword);
    globalMap.visit();
    globalMap.goToFactory('MangeshFactory');
    factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'eqp5014').click();
  });

  it('CFIP-32187 - display data', function () {
    cy.fixture('equipmentDashboard/metricData').then((metricData) => {
      equipmentDashboard.checkDonutChart();
      equipmentDashboard.checkEquipmentUtilization();
      equipmentDashboard.checkEquipmentUtilizationUptime();
      equipmentDashboard.checkEquipmentUtilizationDowntime();
      equipmentDashboard.checkEquipmentUtilizationOtherTime();

      equipmentDashboard.waitForMetricDataPollingAndStubResponse();

      equipmentDashboard.checkDonutChart(metricData.equipmentUtilization, metricData.other);
      equipmentDashboard.checkEquipmentUtilization(metricData.equipmentUtilization);
      equipmentDashboard.checkEquipmentUtilizationUptime(metricData.uptime);
      equipmentDashboard.checkEquipmentUtilizationDowntime(metricData.downtime);
      equipmentDashboard.checkEquipmentUtilizationOtherTime(metricData.other, metricData.total);
    });
  });

  it('CFIP-32188 - data integrity', function () {
    equipmentDashboard.checkTableDataIntegrity();
  });
});
