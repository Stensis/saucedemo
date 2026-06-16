import { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.locator("#user-name");
    this.password = page.locator("#password");
    this.loginButton = page.locator("#login-button");
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // Navigates to the login page base URL
  async gotoLoginPage() {
    await this.page.goto("/");
  }

  // Fills out the form and attempts to log in
  async login(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginButton.click();
  }

  // Optional: A clean helper method to abstract getting the error message text
  async getErrorMessageText(): Promise<string> {
    return await this.errorMessage.innerText();
  }
}
