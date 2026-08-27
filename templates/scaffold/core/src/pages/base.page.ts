import type { Locator, Page } from '@playwright/test';
import { test } from '@playwright/test';
import { requireEnv } from '../utils/env';

/**
 * Base class for all page objects.
 * Provides shared timeout configs + generic utilities.
 * Extend this only when you need the helpers — leaf POMs can also instantiate Page directly.
 */
export class BasePage {
  protected page: Page;

  protected readonly elementTimeout: number;
  protected readonly waitDisappearTimeout: number;
  protected readonly navigationTimeout: number;
  protected readonly baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = requireEnv('BASE_URL');
    this.elementTimeout = parseInt(process.env.TIMEOUT_ELEMENT ?? '5000', 10);
    this.waitDisappearTimeout = parseInt(process.env.TIMEOUT_WAIT_DISAPPEAR ?? '10000', 10);
    this.navigationTimeout = parseInt(process.env.TIMEOUT_NAVIGATION ?? '60000', 10);
  }

  async navigateTo(path: string): Promise<void> {
    await test.step(`Navigate to ${path}`, async () => {
      const url = path.startsWith('http') ? path : `${this.baseURL}${path}`;
      await this.page.goto(url);
      await this.page.waitForLoadState('domcontentloaded');
    });
  }

  async getText(locator: Locator): Promise<string | null> {
    try {
      const text = await locator.innerText({ timeout: this.elementTimeout });
      return text?.trim() || null;
    } catch {
      return null;
    }
  }

  async getAttribute(locator: Locator, name: string): Promise<string | null> {
    try {
      const value = await locator.getAttribute(name, { timeout: this.elementTimeout });
      return value?.trim() || null;
    } catch {
      return null;
    }
  }

  async waitForLocatorToDisappear(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({
      state: 'hidden',
      timeout: timeout ?? this.waitDisappearTimeout,
    });
  }

  protected async scrollUntilVisible(locator: Locator, maxAttempts = 12): Promise<boolean> {
    await this.page.evaluate(() => window.scrollTo(0, 0));

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (await locator.isVisible()) {
        return true;
      }
      await this.page.mouse.wheel(0, 900);
      await this.page.waitForTimeout(120);
    }
    return locator.isVisible();
  }
}
