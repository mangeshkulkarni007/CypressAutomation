import BasePage from "../base";
const anyNumberPattern = /^\d+$/;
const anyTextPattern = /^.*$/;

export default class DateExclusionPage extends BasePage{
    constructor() {
    super('/insight-ui/shift-schedules', {
        manageDtaeExclusionsButton: () => cy.contains('button', 'Manage date exclusions'),
        searchInput: () => cy.get('input[class*=MuiInputBase-input]'),
        filterButton: () => cy.get('button').find('[role=menu]'),
        clearFiltersButton: () => cy.contains('button', 'CLEAR FILTERS'),
        tableRowByName: (dateExclusionName) => cy.contains('tr > td:nth-child(1)', dateExclusionName).parent(),
        editButtonByName: (dateExclusionName) =>
        this.locators.tableRowByName(dateExclusionName).find('button:nth-child(1)'),
        deleteButtonByName: (dateExclusionName) =>
        this.locators.tableRowByName(dateExclusionName).find('button:nth-child(2)'),  
        dateExclusionTableHeader:()=>cy.get('table').find('th'),
    });
    
}



checkAndClickManageDateExclusionsButton()
{
    this.locators.manageDtaeExclusionsButton().should('be.visible').should('be.enabled').click();
}

checkDateExclusionPage()
{
    cy.location('pathname').should('eq', '/insight-ui/shift-schedules/date-exclusions');

}

checkHeadersOfDateExclusionsTable()
{
    const headers = ['Name', 'Type', 'Factory', 'Time Entries'];
    headers.forEach((headerText, index)=>{
    this.locators.dateExclusionTableHeader().eq(index).invoke('text').should('eq', headerText);
});
this.locators.dateExclusionTableHeader().eq(4).should('be.visible');
}

checkDateExclusionAsTable()
{
    cy.get('table').find('tr').should('have.length.greaterThan', 1);
    cy.paginationVerifyRowsPerPage(10);
    cy.paginationPreviousPageButton().should('be.disabled');
    
}

checkDateExclusionName(dateExclusionName)
{
    return this.locators
    .tableRowByName(dateExclusionName)
    .find('td').eq(0)
    .invoke('text')
    .should('eq', dateExclusionName);
}

checkTypeOfDateExclusion(dateExclusionName)
{
    return this.locators
    .tableRowByName(dateExclusionName)
    .find('td')
    .eq(1).invoke('text')
    .should('match', anyTextPattern);
}

checkFactoryOfDateExclusion(dateExclusionName)
{
//    const factoryName = this.locators.tableRowByName(dateExclusionName).find('td').eq(2).invoke('text');
//    cy.log("factory name is "+ factoryName);
    return this.locators
    .tableRowByName(dateExclusionName)
    .find('td')
    .eq(2).invoke('text')
    .should('match', anyTextPattern);   
}

checkNumberOfTimeEntriesOfDateExclusion(dateExclusionName)
{
    return this.locators
    .tableRowByName(dateExclusionName)
    .find('td')
    .eq(3)
    .invoke('text')
    .should('match', anyNumberPattern)
    .then(Number);
}

checkEditAndDeleteButton(dateExclusionName)
{
    this.locators.editButtonByName(dateExclusionName).should('be.visible').should('be.enabled');
    this.locators.deleteButtonByName(dateExclusionName).should('be.visible').should('be.enabled');
}

}