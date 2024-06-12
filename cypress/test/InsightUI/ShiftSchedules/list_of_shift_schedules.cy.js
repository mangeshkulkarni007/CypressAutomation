import { LoginPage, ShiftSchedules } from '../../../support/pages/insightUI';

const loginPage = new LoginPage();
const shiftSchedules = new ShiftSchedules();
const { sapienceAPIPassword, sapienceAPIUser } = Cypress.env();

describe('CFIP-30981 - List of Shift Schedules', { testIsolation: false }, () => {
  before(() => {
    loginPage.login(sapienceAPIUser, sapienceAPIPassword);
    shiftSchedules.visit();
  });

  it('CFIP-32200 - Verify shift Schedule View as in Table format, CFIP-32208 - Verify Content of table in Shift Schedule', () => {
    shiftSchedules.checkShiftSchedulesTable();
  });

  it('CFIP-32209 - Verify shift schedule detail must be listed in individual row', () => {
    shiftSchedules.checkNumberOfShiftsDetail('Default Shift Schedule');
    shiftSchedules.checkFactoriesDetail('Default Shift Schedule');
    shiftSchedules.checkLinesAssociatedDetail('Default Shift Schedule');
    shiftSchedules.checkDateExclusionsDetail('Default Shift Schedule');
  });

  it('CFIP-32210 - Verify Delete and edit icon at shift Schedule page, CFIP-32211 - Verify Delete and edit button should be clickable on Shift Schedule page', () => {
    shiftSchedules.locators.editButtonByName('QA Automation Shift').should('be.visible').should('be.enabled');
    shiftSchedules.locators.deleteButtonByName('QA Automation Shift').should('be.visible').should('be.enabled');

    // action buttons not available for default shift schedule:
    shiftSchedules.locators.editButtonByName('Default Shift Schedule').should('not.exist');
    shiftSchedules.locators.deleteButtonByName('Default Shift Schedule').should('not.exist');
  });
});
