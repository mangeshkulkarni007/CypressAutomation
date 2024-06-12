import { LoginPage, GlobalMap, EquipmentDashboard, FactoryDashboard } from '../../../support/pages/insightUI';

const loginPage = new LoginPage();
const globalMap = new GlobalMap();
const factoryDashboard = new FactoryDashboard();
const equipmentDashboard = new EquipmentDashboard();
const { sapienceAPIPassword, sapienceAPIUser } = Cypress.env();

describe('CFIP-30980 - Filtering Equipment Utilization', () => {
  beforeEach(() => {
    loginPage.login(sapienceAPIUser, sapienceAPIPassword);
    globalMap.visit();
    globalMap.goToFactory('MangeshFactory');
    factoryDashboard.locators.equipmentByLineName('Non-continuous Line-1', 'eqp5014').click();
    equipmentDashboard.locators.donutChart().should('be.visible');
  });

  context('CFIP-32169 - predefined period', function () {
    it('should display utilization from "Previous Shift"', () => {
      equipmentDashboard.selectTimeRange('Previous Shift');
      equipmentDashboard.checkTableDataIntegrity();
      equipmentDashboard.checkEquipmentUtilizationBarChart('Previous Shift Utilization');
    });

    it('should display utilization from "Last 8 Hours"', () => {
      equipmentDashboard.selectTimeRange('Last 8 Hours');
      equipmentDashboard.checkTableDataIntegrity();
      equipmentDashboard.checkEquipmentUtilizationBarChart('Last 8 Hours Utilization', 9);
    });

    it('should display utilization from "Last 2 Weeks"', () => {
      equipmentDashboard.selectTimeRange('Last 2 Weeks');
      equipmentDashboard.checkTableDataIntegrity();
      equipmentDashboard.checkEquipmentUtilizationBarChart('Last 2 Weeks Utilization', 15);
    });

    it('should display utilization from "Last 6 Months"', () => {
      equipmentDashboard.selectTimeRange('Last 6 Months');
      equipmentDashboard.checkTableDataIntegrity();
      equipmentDashboard.checkEquipmentUtilizationBarChart('Last 6 Months Utilization', 27);
    });
  });

  context('CFIP-32170 - custom period', function () {
    it('should display utilization from absolute "Custom Time" (period of one day)', () => {
      equipmentDashboard.selectTimeRange('Custom Time');
      equipmentDashboard.selectAbsoluteTime();
      // TODO: waiting for CFIP-32808
      // equipmentDashboard.checkTableDataIntegrity();
      // equipmentDashboard.checkEquipmentUtilizationBarChart('Custom Time Utilization', 37);
    });

    it('should display utilization from relative "Custom Time" (period of 20 hours)', () => {
      equipmentDashboard.selectTimeRange('Custom Time');
      equipmentDashboard.selectRelativeTime({
        interval: 20,
        durationType: 'Hours',
      });
      equipmentDashboard.checkTableDataIntegrity();
      equipmentDashboard.checkEquipmentUtilizationBarChart('Custom Time Utilization', 21);
    });

    it('should display utilization from relative "Custom Time" (period of 2 months)', () => {
      equipmentDashboard.selectTimeRange('Custom Time');
      equipmentDashboard.selectRelativeTime({
        interval: 2,
        durationType: 'Months',
      });
      equipmentDashboard.checkTableDataIntegrity();
      equipmentDashboard.checkEquipmentUtilizationBarChart('Custom Time Utilization', 10);
    });
  });

  context('CFIP-32171 - wrong custom period', () => {
    it('should warn about future date selected', () => {
      equipmentDashboard.selectTimeRange('Custom Time');
      equipmentDashboard.selectAbsoluteTimeInFuture();
      equipmentDashboard.checkFutureDateWarningDialog();
    });

    it('should warn about start date later than end date selected', () => {
      equipmentDashboard.selectTimeRange('Custom Time');
      equipmentDashboard.selectAbsoluteStartTimeAfterEndTime();
      // TODO: waiting for CFIP-32808
      // equipmentDashboard.checkStartDateAfterEndDateWarningDialog();
    });
  });
});
