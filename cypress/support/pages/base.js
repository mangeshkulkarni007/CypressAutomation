export default class BasePage {
  constructor(path, locators = {}) {
    this.locators = locators;
    this.path = path;
  }

  visit() {
    cy.visit(this.path);
    cy.waitForSpinnerToDisappear();
    return this;
  }

  assertUrlIsCorrect() {
    cy.url().should('contain', this.path);
    return this;
  }
}
