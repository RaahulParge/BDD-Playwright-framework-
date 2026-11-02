import { Given, When, Then } from '@cucumber/cucumber';
import type { LoginWorld } from '../hooks/hooks';

// Step definitions translate Gherkin language into reusable page-object calls.
Given('I navigate to the login page', async function (this: LoginWorld) {
  await this.loginPage.navigateToLoginPage();
});

When('I enter valid username and password', async function (this: LoginWorld) {
  await this.loginPage.enterUsername();
  await this.loginPage.enterPassword();
});

When('I enter invalid username and password', async function (this: LoginWorld) {
  await this.loginPage.enterUsername('invalid_user');
  await this.loginPage.enterPassword('invalid_password');
});

When('I click the login button', async function (this: LoginWorld) {
  await this.loginPage.clickLogin();
});

Then('I should be successfully logged in', async function (this: LoginWorld) {
  await this.loginPage.verifySuccessfulLogin();
});

Then('I should see a login error', async function (this: LoginWorld) {
  await this.loginPage.verifyLoginError();
});
