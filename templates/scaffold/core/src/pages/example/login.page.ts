import type { Locator, Page } from '@playwright/test';
import { test, expect } from '@playwright/test';
import { BasePage } from '../base.page';

// TODO(init): STARTER FILE — do not ship these locators as-is. Run the
// `dom-inspector` agent against this app's real login page and replace every
// locator below (and the button.click()/wait target) with what it reports.
// Never guess selectors from this template.

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly serverErrorAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.locator('TODO: replace with dom-inspector result');
    this.passwordInput = this.page.locator('TODO: replace with dom-inspector result');
    this.loginButton = this.page.getByRole('button', { name: 'TODO' });
    this.serverErrorAlert = this.page.getByRole('alert');
  }

  async goto(): Promise<void> {
    await test.step('Navigate to login page', async () => {
      await this.navigateTo('/login'); // TODO: confirm real login path
      await expect(this.loginButton).toBeVisible({ timeout: this.navigationTimeout });
    });
  }

  async login(username: string, password: string): Promise<void> {
    await test.step(`Login as ${username}`, async () => {
      await this.usernameInput.fill(username);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
      await this.page.waitForURL(/TODO/, { timeout: this.navigationTimeout }); // TODO: real post-login URL pattern
    });
  }

  async assertLoginError(message: string): Promise<void> {
    await test.step(`Assert login error "${message}"`, async () => {
      await expect(this.serverErrorAlert).toContainText(message, { timeout: this.elementTimeout });
    });
  }
}
