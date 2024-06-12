import { LoginPage, FactoryDashboard, GlobalMap } from '../../../support/pages/insightUI';

const loginPage = new LoginPage();
const globalMap = new GlobalMap();
const factoryDashboard = new FactoryDashboard();
const { sapienceAPIPassword, sapienceAPIUser } = Cypress.env();

const MAX_NUMBER_OF_LINES_PER_PAGE = 5;

describe('CFIP-30969 - Display Lines With Equipment In A Single Row', () => {
  beforeEach(() => {
    loginPage.login(sapienceAPIUser, sapienceAPIPassword);
    globalMap.visit();
  });

  it('CFIP-31846 - Verify Redirect to Factory Configuration Page', () => {
    globalMap.goToFactory('MangeshFactory');

    factoryDashboard.getNameOfFactory().should('eq', 'MangeshFactory');
  });

  it('CFIP-31847 - Verify Add line or Empty State Screen when no line is associated with Factory', () => {
    globalMap.goToFactory('QA_Factory_006');

    factoryDashboard.checkNoLinesAddedYet();
  });

  it('CFIP-31848 - Verify Redirect to Factory Configuration Page', () => {
    globalMap.goToFactory('MangeshFactory');

    factoryDashboard.checkMaxNumberOfLinesPerPage(MAX_NUMBER_OF_LINES_PER_PAGE);
    factoryDashboard.locators.goToNextPageButton().click();
    factoryDashboard.checkMaxNumberOfLinesPerPage(4);
    factoryDashboard.locators.goToNextPageButton().should('be.disabled');
  });

  it('CFIP-31849 - Verify Each line on FCP page should be in single line card', () => {
    const factoryLineNames = [
      'Non-continuous Line-1',
      'mkline',
      'testline4',
      'testline',
      'testline6',
      'KG test line',
      'Mkshiftline',
      'testline5',
      'TestShift2',
    ];

    globalMap.goToFactory('MangeshFactory');

    Cypress._.slice(factoryLineNames, 0, MAX_NUMBER_OF_LINES_PER_PAGE).forEach(factoryDashboard.locators.lineByName);
  });

  it('CFIP-31862 - Verify Equipment Avatars on the respective factory and line in Horizontal Order', () => {
    globalMap.goToFactory('MangeshFactory');

    factoryDashboard.locators.equipmentAvatarsByLineName('Non-continuous Line-1').should('have.length', 11);
    factoryDashboard.locators.equipmentAvatarsByLineName('testline4').should('not.exist');
  });

  it('CFIP-31863 - Verify Equipments on FCP page according to User Configuration like order line, Avatar, factory, model', () => {
    globalMap.goToFactory('MangeshFactory');

    // check avatars:
    factoryDashboard.locators
      .equipmentByLineName('Non-continuous Line-1', 'EQP5010')
      .find('svg')
      .should('have.attr', 'width', '102')
      .should('have.attr', 'height', '200');
    factoryDashboard.locators
      .equipmentByLineName('Non-continuous Line-1', 'eqp5014')
      .find('svg')
      .should('have.attr', 'width', '274')
      .should('have.attr', 'height', '200');

    // check supplier images:
    factoryDashboard.checkEquipmentSupplierImage({
      line: 'Non-continuous Line-1',
      equipment: 'eqp5014',
      supplier: 'BTU',
    });
    factoryDashboard.checkEquipmentSupplierImage({
      line: 'mkline',
      equipment: 'testeqp8',
      supplier: 'ASM',
    });
  });

  it('CFIP-31864 - Verify Scroll Functionality on Factory Configuration Page', () => {
    globalMap.goToFactory('MangeshFactory');

    //scroll to the bottom:
    factoryDashboard.locators.goToNextPageButton().scrollIntoView();

    //scroll to the top:
    factoryDashboard.locators.lineByName('Non-continuous Line-1').scrollIntoView();

    //scroll to the bottom:
    cy.scrollTo('bottom');
  });

  it('CFIP-31868 - Verify Total Count of Equipment on FCP page per Line', () => {
    const factoryLines = [
      { name: 'Non-continuous Line-1', equipmentCount: 11 },
      { name: 'mkline', equipmentCount: 7 },
    ];

    globalMap.goToFactory('MangeshFactory');

    factoryLines.forEach(({ name, equipmentCount }) => {
      factoryDashboard.locators
        .miniaturesByLineName(name)
        .should('be.visible')
        .getByTestId('miniature')
        .should('be.visible')
        .should('have.length', equipmentCount)
        .each(($equipment, index) => {
          const countIndicator = $equipment.text().trim();
          expect(countIndicator, `${name} equipment number ${index + 1} `).to.eq(`${index + 1}`);
        });
    });
  });

  it('CFIP-31870 - Verifying to access the factory Dashboard from FCP Page without selecting a factory', () => {
    globalMap.checkMapClickIsNotRedirectingToFactoryDashboard();
  });

  context('CFIP-32494 - Display Non-Continuous Line In New UI', () => {
    beforeEach(() => {
      globalMap.goToFactory('MangeshFactory');
    });

    it('CFIP-32523 - Verify Non-Continuous line on Dashboard', () => {
      factoryDashboard.checkIsContinuousLine('Non-continuous Line-1', false);
    });

    it('CFIP-32521 - Verify Continuous line on Dashboard', () => {
      factoryDashboard.checkIsContinuousLine('mkline', true);
    });
  });
});
