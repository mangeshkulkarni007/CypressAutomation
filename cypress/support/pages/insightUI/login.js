import BasePage from '../base';

export default class LoginPage extends BasePage {
  constructor() {
    super('/insight-ui/login', {
      firstLoginButton: () => cy.contains('Login'),
      userInput: () => cy.get('#username'),
      passwordInput: () => cy.get('#password'),
      secondLoginButton: () => cy.get('#kc-login'),
      IAgreeAlert: () => cy.contains('I Agree'),
    });
  }
  login(username, password) {
    cy.session([username, password], () => {
      this.visit();
      this.assertUrlIsCorrect();
      this.locators.firstLoginButton().click();
      this.locators.userInput().type(username);
      this.locators.passwordInput().type(password);
      this.locators.secondLoginButton().click();
      this.locators.IAgreeAlert().click(); //putting this outside the session was causing the the element to be non interactable. Thus, I have placed it inside the session.
    });
    return this;
  }
}
