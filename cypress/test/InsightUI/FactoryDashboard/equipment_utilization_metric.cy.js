import { LoginPage, FactoryDashboard, GlobalMap } from '../../../support/pages/insightUI';

const loginPage = new LoginPage();
const globalMap = new GlobalMap();
const factoryDashboard = new FactoryDashboard();
const { sapienceAPIPassword, sapienceAPIUser } = Cypress.env();

describe('CFIP-30972 - Equipment Utilization Metric', { testIsolation: false }, () => {
  before(() => {
    loginPage.login(sapienceAPIUser, sapienceAPIPassword);
    globalMap.visit();
    globalMap.goToFactory('MangeshFactory');
  });

  it('should display default utilization metrics', () => {
    factoryDashboard.checkEquipmentState('Non-continuous Line-1', 'EQP5010');
    factoryDashboard.checkEquipmentMetrics('Non-continuous Line-1', 'EQP5010');
  });

  it('should display equipment state', () => {
    factoryDashboard.waitForEquipmentStateAndStubResponse();

    cy.fixture('factoryDashboard/equipmentState').then((equipmentState) => {
      factoryDashboard.checkEquipmentState('mkline', 'mangeshEquipment2', equipmentState); // green
      factoryDashboard.checkEquipmentState('mkline', 'testeqp8', equipmentState); // yellow
      factoryDashboard.checkEquipmentState('mkline', 'testeqp3', equipmentState); // blue
      factoryDashboard.checkEquipmentState('mkline', 'testeqp4', equipmentState); // light red
      factoryDashboard.checkEquipmentState('mkline', 'testeqp5', equipmentState); // red
      factoryDashboard.checkEquipmentState('mkline', 'testeqp7', equipmentState); // grey
      factoryDashboard.checkEquipmentState('mkline', 'mangeshkulkarni', equipmentState); // black
    });
  });

  it('should display equipment metrics', () => {
    factoryDashboard.waitForMetricsAndStubResponse();

    cy.fixture('factoryDashboard/metrics').then((metrics) => {
      factoryDashboard.checkEquipmentMetrics('Non-continuous Line-1', 'EQP5010', metrics);
      factoryDashboard.checkEquipmentMetrics('Non-continuous Line-1', 'eqp5014', metrics);
      factoryDashboard.checkEquipmentMetrics('Non-continuous Line-1', 'eqp5016', metrics);
    });
  });
});
