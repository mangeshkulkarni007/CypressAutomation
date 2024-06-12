import { LoginPage, GlobalMap, EquipmentDashboard, FactoryDashboard } from '../../../support/pages/insightUI';

const loginPage = new LoginPage();
const globalMap = new GlobalMap();
const factoryDashboard = new FactoryDashboard();
const equipmentDashboard = new EquipmentDashboard();
const { sapienceAPIPassword, sapienceAPIUser } = Cypress.env();

describe('CFIP-30974 - Equipment Details', () => {
  beforeEach(() => {
    loginPage.login(sapienceAPIUser, sapienceAPIPassword);
    globalMap.visit();
    globalMap.goToFactory('MangeshFactory');
  });

  it('CFIP-32116 - Navigate to Factory Equipment Detail Page', () => {
    factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'eqp5014').click();
    equipmentDashboard.checkUrlOfEquipmentDetail('MangeshFactory', 'eqp5014');
  });

  it('CFIP-32117 - Verify Primary Equipment Details Display', () => {
    factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'eqp5014').click();
    equipmentDashboard.checkPrimaryEquipmentDetails({ name: 'eqp5014', model: 'testgemmodel', supplier: 'BTU' });
  });

  it('CFIP-32118 - Verify Equipment Detail Card Structure', () => {
    factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'eqp5014').click();
    equipmentDashboard.checkEquipmentDetailsStructure();
  });

  context('CFIP-32121 - Verify Equipment State Display', () => {
    it('should display default state', () => {
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'EQP5010').click();

      equipmentDashboard.checkEquipmentState();
    });

    [
      'PRODUCTIVE TIME',
      'STANDBY TIME',
      'ENGINEERING TIME',
      'SCHEDULED DOWNTIME',
      'UNSCHEDULED DOWNTIME',
      'NON-SCHEDULED TIME',
      'UNKNOWN TIME',
    ].forEach((type) => {
      it(`should display ${type} state`, () => {
        factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'eqp5015').click();

        equipmentDashboard.waitForEquipmentStateAndStubResponse(type);
        equipmentDashboard.checkEquipmentState(type);
      });
    });
  });

  context('CFIP-32122 - Verify Connection Status Display', () => {
    it('should display CONNECTED status', () => {
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'eqp5014').click();
      equipmentDashboard.checkConnectionStatus('CONNECTED');
    });

    it('should display DISCONNECTED status', () => {
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'eqp5016').click();
      equipmentDashboard.checkConnectionStatus('DISCONNECTED');
    });

    it('should display DISABLED status', () => {
      factoryDashboard.locators.miniaturesByLineName('Non-continuous Line-1').click('right');
      factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'testeqpmk').click();
      equipmentDashboard.checkConnectionStatus('DISABLED');
    });
  });
});
