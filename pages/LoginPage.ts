import assert from 'node:assert/strict';
import type { Locator, Page } from 'playwright';
import { config } from '../config/config';

// The Page Object Model keeps login selectors and browser interactions in one place.
export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly pageTitle: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.pageTitle = page.locator('[data-test="title"]');
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto(config.baseUrl);
  }

  async enterUsername(username: string = config.username): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string = config.password): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await this.pageTitle.waitFor({ state: 'visible' });
    assert.equal((await this.pageTitle.textContent())?.trim(), 'Products');
    assert.match(this.page.url(), /\/inventory\.html$/);
  }

  async verifyLoginError(): Promise<void> {
    await this.errorMessage.waitFor({ state: 'visible' });
    assert.match(
      (await this.errorMessage.textContent()) ?? '',
      /Username and password do not match/
    );
  }
}
