import { LoginPage,DateExclusionPage } from "../../../support/pages/insightUI";
const loginPage = new LoginPage();
const dateExclusionPage = new DateExclusionPage();
const { sapienceAPIPassword, sapienceAPIUser } = Cypress.env();

describe('CFIP-30982 - List of Date Exclusions', { testIsolation: false }, () => {
    before(() => {
        loginPage.login(sapienceAPIUser, sapienceAPIPassword);
        dateExclusionPage.visit();
        
    });
    
    it('CFIP-32388 - Verify User is on Date Exclusion Page', () => {
        dateExclusionPage.checkAndClickManageDateExclusionsButton();
        dateExclusionPage.checkDateExclusionPage();
    });

    it('CFIP-32389 - Verify header of Table in Date exclusion ', () => {
        dateExclusionPage.checkHeadersOfDateExclusionsTable();
    });    


    it('CFIP-32387 - Verify Date Exclusion View as in Table format', () => {
        dateExclusionPage.checkDateExclusionAsTable();
    });
    
    it('CFIP-32390 - Verify Date Exclusion detail must be listed in individual row', () => {
        dateExclusionPage.checkDateExclusionName('QA Automation Date Exclusion');
        dateExclusionPage.checkTypeOfDateExclusion('QA Automation Date Exclusion');
        dateExclusionPage.checkFactoryOfDateExclusion('QA Automation Date Exclusion');
        dateExclusionPage.checkNumberOfTimeEntriesOfDateExclusion('QA Automation Date Exclusion');
    });
    
    it('CFIP-32391 - Verify Delete and edit icon at Date Exclusion page, CFIP-32393 - Verify Delete and edit button are able to select', () => {
        dateExclusionPage.locators.editButtonByName('QA Automation Date Exclusion').should('be.visible').should('be.enabled');
        dateExclusionPage.locators.deleteButtonByName('QA Automation Date Exclusion').should('be.visible').should('be.enabled');
    
    });
    });