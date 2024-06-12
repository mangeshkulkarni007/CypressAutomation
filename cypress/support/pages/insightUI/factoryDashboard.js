import BasePage from '../base';

const { _ } = Cypress;

const filterBy = {
  line: 'Line',
  equipmentModel: 'Equipment Model',
  connectionStatus: 'Connection Status',
};

export default class FactoryDashboard extends BasePage {
  constructor() {
    super('/insight-ui/factory-dashboard', {
      globe: () => cy.get('span[class*=cim-globe]'),
      factoryNameOnDashboard: cy.getBreadcrumbPath,
      lineByName: (name) => cy.contains('[class*=MuiCard-root]', name),
      equipmentAvatarsByLineName: (lineName) => this.locators.lineByName(lineName).getByTestId('equipment-holder'),
      equipmentByLineName: (lineName, equipmentName) =>
        this.locators.lineByName(lineName).contains('div:not([class])', equipmentName),
      equipmentSupplierImageByLineName: (lineName, equipmentName) =>
        this.locators.equipmentByLineName(lineName, equipmentName).find('img'),
      miniaturesByLineName: (name) => this.locators.lineByName(name).getByTestId('miniatures'),
      miniatureByLineName: (name) => this.locators.miniaturesByLineName(name).getByTestId('miniature'),
      miniaturesSliderByLineName: (name) => this.locators.miniaturesByLineName(name).getByTestId('miniatures-slider'),
      plugIconByLineName: (lineName, equipmentName) =>
        this.locators.equipmentByLineName(lineName, equipmentName).find('[data-testid] > span'),
      filterButton: () => cy.get('h4').next().find('[role=menu]'),
      filterDropdownByName: cy.getDropdownButtonByLabel,
      filterOptionByName: (name) => cy.contains('#simple-menu li', name),
      filterDropdownOption: () => cy.get('[role=listbox] [role=option]'),
      clearFiltersButton: () => cy.contains('button', 'CLEAR FILTERS'),
      goToNextPageButton: () => cy.get('button[aria-label="Go to next page"]'),
    });
  }

  clickGlobeIcon() {
    cy.intercept(/^\/fcm\/factories\?.*timestamp=\d*$/).as('factories');
    this.locators.globe().click();
    return this;
  }

  checkUrlOfGlobalMap() {
    cy.url().should('contain', '/insight-ui/map');
    return this;
  }

  getNameOfFactory() {
    return this.locators.factoryNameOnDashboard().then(_.first);
  }

  addOrRemoveFilter(name) {
    this.locators.filterButton().click();
    this.locators.filterOptionByName(name).click();
  }

  checkFilteringIsNotApplied() {
    _.values(filterBy).forEach((filterByOption) => {
      this.locators.filterDropdownByName(filterByOption).should('not.exist');
    });
  }

  checkFilterByOptions() {
    _.values(filterBy).forEach((filterByOption) => {
      this.locators.filterOptionByName(filterByOption).should('not.be.visible');
    });

    this.locators.filterButton().click();
    _.values(filterBy).forEach((filterByOption) => {
      this.locators.filterOptionByName(filterByOption).should('be.visible');
    });

    cy.get('h4').realClick(); // close filtering options
    _.values(filterBy).forEach((filterByOption) => {
      this.locators.filterOptionByName(filterByOption).should('not.be.visible');
    });
  }

  checkFilterDropdownOptions({ line, equipmentModel, connectionStatus }) {
    const optionsShouldHaveLength = ({ length }, expectedLength) => {
      if (expectedLength) {
        expect(length).to.eq(expectedLength);
      } else {
        expect(length).to.be.above(0);
      }
    };

    const optionShouldBeChecked = ($option) => {
      const option = $option.text().trim();
      const isChecked = $option.find('input').attr('checked');

      expect(isChecked, `'${option}' option should be checked`).to.eq('checked');
    };

    this.addOrRemoveFilter(filterBy.line);
    this.locators.filterDropdownByName(filterBy.line).click();
    this.locators
      .filterDropdownOption()
      .should('be.visible')
      .should(($options) => optionsShouldHaveLength($options, line))
      .each(optionShouldBeChecked);

    cy.get('h4').realClick(); // close filtering options

    this.addOrRemoveFilter(filterBy.equipmentModel);
    this.locators.filterDropdownByName(filterBy.equipmentModel).click();
    this.locators
      .filterDropdownOption()
      .should('be.visible')
      .should(($options) => optionsShouldHaveLength($options, equipmentModel))
      .each(optionShouldBeChecked);

    cy.get('h4').realClick(); // close filtering options

    this.addOrRemoveFilter(filterBy.connectionStatus);
    this.locators.filterDropdownByName(filterBy.connectionStatus).click();
    this.locators
      .filterDropdownOption()
      .should('be.visible')
      .should(($options) => optionsShouldHaveLength($options, connectionStatus))
      .each(optionShouldBeChecked);
  }

  checkPaginationNumberOfPages(number) {
    cy.get('[aria-label="pagination navigation"] li')
      .map('innerText')
      .then((textPath) => textPath.filter(Boolean)) // remove empty strings
      .should('have.length', number);
  }

  checkNoLinesAddedYet() {
    cy.contains('p', 'No lines added yet.');
  }

  checkMaxNumberOfLinesPerPage(number) {
    cy.get('[class*=MuiCard-root]').should('have.length', number);
  }

  checkEquipmentSupplierImage({ line, equipment, supplier }) {
    this.locators
      .equipmentSupplierImageByLineName(line, equipment)
      .invoke('attr', 'src')
      .should('contain', `${supplier}.svg`);
  }

  checkIsContinuousLine(line, isContinuous) {
    const continuousClass = 'continuous';
    const isLastEquipment = ($list, index) => $list.length - 1 === index;

    this.locators
      .equipmentAvatarsByLineName(line)
      .parent()
      .each(($lineEquipment, index, $lineEquipments) => {
        cy.wrap($lineEquipment)
          .next()
          .should(($space) => {
            if (isLastEquipment($lineEquipments, index)) {
              expect($space).to.not.exist;
            } else {
              const $conveyor = $space.find('svg');

              if (isContinuous) {
                expect($conveyor).to.exist;
              } else {
                expect($conveyor).to.not.exist;
              }
            }
          });
      });

    this.locators.miniatureByLineName(line).each(($lineEquipment, index, $lineEquipments) => {
      if (isContinuous) {
        expect($lineEquipment)
          .to.have.class(continuousClass)
          .and.have.css('margin-right', isLastEquipment($lineEquipments, index) ? '0px' : '10px');
      } else {
        expect($lineEquipment).not.to.have.class(continuousClass);
      }
    });
  }

  checkEquipmentState(line, equipment, data) {
    this.locators
      .equipmentByLineName(line, equipment)
      .find('[color]')
      .as('statusBox')
      .should('be.visible')
      .should('have.css', 'background-color');

    if (data) {
      const { color } = data[equipment];

      cy.get('@statusBox').should('have.css', 'background-color', color);
    }
  }

  checkEquipmentMetrics(line, equipment, data) {
    this.locators
      .equipmentByLineName(line, equipment)
      .find('[color]')
      .as('statusBox')
      .should('be.visible')
      .invoke('text')
      .should('match', /^.*%$/);

    if (data) {
      const { percent } = data[equipment];

      cy.get('@statusBox').should('have.text', `${percent}%`);
    }
  }

  waitForEquipmentStateAndStubResponse() {
    cy.intercept('/insight/equipmentState/search', { fixture: 'factoryDashboard/equipmentStateResponse.json' }).as(
      'getEquipmentState',
    );

    cy.reload();
    cy.wait('@getEquipmentState');
  }

  waitForMetricsAndStubResponse() {
    cy.intercept('/insight/metrics/update?**', { fixture: 'factoryDashboard/metricsResponse.json' }).as('getMetrics');

    cy.reload();
    cy.wait('@getMetrics');
  }

  checkLinesCount(number) {
    if (number === 0) {
      this.checkNoLinesAddedYet();
      cy.get('[class*=MuiCard-root]').should('not.exist');
      this.locators.goToNextPageButton().should('not.exist');
    } else if (number <= 5) {
      cy.get('[class*=MuiCard-root]').should('have.length', number);
      this.locators.goToNextPageButton().should('be.visible').should('be.disabled');
    } else {
      cy.get('[class*=MuiCard-root]').should('have.length', 5);
      this.locators.goToNextPageButton().should('be.visible').should('be.enabled');
    }
  }
}
