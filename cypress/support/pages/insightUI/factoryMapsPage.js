import BasePage from '../base';

export default class FactoryMaps extends BasePage {
  constructor() {
    super('/insight-ui/factory-dashboard', {
      randomPin: (index) => cy.get(`div[class*=leaflet-marker-pane] > div:nth-of-type(${index})`),
      factoryPin: () => cy.get('div[class*=leaflet-tooltip-top] div:nth-of-type(1)'),
      zoomInButton: () => cy.get('.leaflet-control-zoom-in'),
      zoomOutButton: () => cy.get('a.leaflet-control-zoom-out'),
      randomPlaceOnMap: () => cy.get('div[class*=leaflet-zoom-animated] img:nth-of-type(1)'),
    });
  }

  getTextOfPinOne() {
    this.locators.randomPin(1).trigger('mouseover', { force: true });
    return this.locators
      .factoryPin()
      .trigger('mouseover', { force: true })
      .invoke('text')
      .then((factoryNameOnPinOne) => {
        cy.log('Factory name on pin one is-' + factoryNameOnPinOne);
        this.locators.randomPin(1).invoke('show').click({ force: true });
        return cy.wrap(factoryNameOnPinOne);
      });
  }

  getTextOfPinTwo() {
    this.locators.randomPin(2).trigger('mouseover', { force: true });
    return this.locators
      .factoryPin()
      .trigger('mouseover', { force: true })
      .invoke('text')
      .then((factoryNameOnPinTwo) => {
        cy.log('Factory name on pin two is-' + factoryNameOnPinTwo);
        this.locators.randomPin(2).invoke('show').click({ force: true });
        return cy.wrap(factoryNameOnPinTwo);
      });
  }

  #waitForAnimation() {
    cy.get('.leaflet-zoom-anim').as('animation');
    cy.get('@animation').should('not.exist');
  }

  validateZoomInButton() {
    this.locators.zoomInButton().click();
    this.#waitForAnimation();
  }
  validateZoomOutButton() {
    this.locators.zoomOutButton().click();
    this.#waitForAnimation();
  }

  validateMapSwipping() {
    this.locators.randomPlaceOnMap().should('be.visible').realSwipe('toLeft', { force: true });
    this.locators.randomPlaceOnMap().should('be.visible').realSwipe('toRight', { force: true });
  }
  validateDoubleClickZoom() {
    this.locators.randomPlaceOnMap().realClick().realClick();
  }
}
