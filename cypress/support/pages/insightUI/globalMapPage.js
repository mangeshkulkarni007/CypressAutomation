import BasePage from '../base';

export default class GlobalMap extends BasePage {
  constructor() {
    super('/insight-ui/map', {
      getMap: () => cy.get('#map'),
      getSearchList: () => cy.get('main ul[class*=MuiList-padding]'),
      getSearchInput: () => cy.get('[data-testid="search-input"]'),
      getErrorMessage: () => cy.get('div[class*=MuiAlert-message]'),
    });
  }

  loadMapFactories() {
    this.locators.getMap().should('be.visible');
    cy.wait('@factories').then((request) => {
      expect(request.response?.statusCode).to.eq(200);
      expect(request.response?.body.numberOfElements).to.be.above(0);
      cy.wrap(request.response?.body.numberOfElements).as('numberOfFactories');
      cy.wrap(request.response?.body.content).as('factoryList');
    });
    return this;
  }

  typeAndSearchNthFactory(list_index) {
    cy.get('@factoryList').then((factories) => {
      let factoryName = factories[list_index].name;
      this.locators.getSearchInput().type(factoryName);
    });
  }

  searchFactoryByName(name) {
    this.locators.getSearchInput().type(name);
  }

  clearSearchInput() {
    this.locators.getSearchInput().clear();
    cy.get('@numberOfFactories').then((length) => {
      this.assertSearchListLengthIs(length);
    });
  }

  assertSearchListLengthIs(length) {
    this.locators.getSearchList().find('div[class*=MuiListItem-root-]').should('have.length', length);
  }

  goToFactory(name) {
    this.locators.getSearchList().contains(name).click();
    cy.getBreadcrumbPath().should('deep.eq', [name]);
  }

  goToRandomFactory() {
    this.locators
      .getSearchList()
      .find('[role=button]')
      .sample()
      .then(($listItem) => {
        cy.wrap($listItem.find('span').text()).as('factoryName');
        cy.wrap($listItem.find('div').empty().text()); // remove child nodes
        cy.wrap($listItem.text()).then(Number).as('factoryLinesCount');
        cy.wrap($listItem).click();
      });

    cy.get('@factoryName').then((factoryName) => {
      cy.getBreadcrumbPath().should('deep.eq', [factoryName]);
    });
  }

  checkMapClickIsNotRedirectingToFactoryDashboard() {
    this.locators.getMap().click(100, 100);
    cy.location('pathname').should('eq', this.path);
  }

  expectScrollbarAfterScreenResizing() {
    const getOuterHeight = ($el) => Number($el.outerHeight().toFixed(0));
    const getScrollHeight = ($el) => Number($el.prop('scrollHeight').toFixed(0));

    this.locators.getSearchList().then(($searchList) => {
      const outerHeight = getOuterHeight($searchList);
      const scrollHeight = getScrollHeight($searchList);

      expect(outerHeight).to.eq(scrollHeight);
    });
    this.locators.getSearchList().find('[role=button]').last().should('be.visible');

    // decrease screen height:
    cy.viewport(1440, 600);

    this.locators.getSearchList().then(($searchList) => {
      const outerHeight = getOuterHeight($searchList);
      const scrollHeight = getScrollHeight($searchList);

      expect(outerHeight).be.lessThan(scrollHeight);
    });
    this.locators
      .getSearchList()
      .find('[role=button]')
      .last()
      .should('not.be.visible')
      .scrollIntoView()
      .should('be.visible');
  }
}
