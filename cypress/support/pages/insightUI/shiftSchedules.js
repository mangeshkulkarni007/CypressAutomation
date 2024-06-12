import BasePage from '../base';

const anyNumberPattern = /^\d+$/;

export default class ShiftSchedules extends BasePage {
  constructor() {
    super('/insight-ui/shift-schedules', {
      manageDateExclusionsButton: () => cy.contains('button', 'Manage date exclusions'),
      addShiftScheduleButton: () => cy.contains('button', 'Add shift schedule'),
      searchInput: () => cy.get('[class*=MuiInputBase] input'),
      filterButton: () => cy.get('h4').next().find('[role=menu]'),
      clearFiltersButton: () => cy.contains('button', 'CLEAR FILTERS'),
      tableRowByName: (shiftScheduleName) => cy.contains('tr > td:nth-child(1)', shiftScheduleName).parent(),
      editButtonByName: (shiftScheduleName) =>
        this.locators.tableRowByName(shiftScheduleName).find('button:nth-child(1)'),
      deleteButtonByName: (shiftScheduleName) =>
        this.locators.tableRowByName(shiftScheduleName).find('button:nth-child(2)'),
    });
  }

  checkShiftSchedulesTable() {
    cy.getBreadcrumbPath().should('deep.eq', ['Shift Schedules']);

    cy.get('table tbody tr').its('length').should('be.greaterThan', 2);
    cy.paginationVerifyRowsPerPage(10);
    cy.paginationPreviousPageButton().should('be.disabled');
  }

  checkNumberOfShiftsDetail(shiftScheduleName) {
    return this.locators
      .tableRowByName(shiftScheduleName)
      .find('td')
      .eq(1)
      .invoke('text')
      .should('match', anyNumberPattern)
      .then(Number);
  }

  checkFactoriesDetail(shiftScheduleName) {
    return this.locators.tableRowByName(shiftScheduleName).find('td').eq(1).invoke('text');
  }

  checkLinesAssociatedDetail(shiftScheduleName) {
    return this.locators
      .tableRowByName(shiftScheduleName)
      .find('td')
      .eq(3)
      .invoke('text')
      .should('match', anyNumberPattern)
      .then(Number);
  }

  checkDateExclusionsDetail(shiftScheduleName) {
    return this.locators
      .tableRowByName(shiftScheduleName)
      .find('td')
      .eq(4)
      .invoke('text')
      .should('match', anyNumberPattern)
      .then(Number);
  }
}
