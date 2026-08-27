import { test as setup } from '@playwright/test';
import { LoginPage } from './pages/example/login.page';
import { requireEnv } from './utils/env';

// TODO(init): delete this file (and the 'setup' project + storageState line
// in playwright.config.ts) if this app needs no authenticated session.

export const AUTH_FILE = 'src/auth/{{APP_SLUG}}.json';

setup('authenticate', async ({ page }) => {
  // TODO: credentials are typically per-environment (e.g. APP_ADMIN_USERNAME_UAT,
  // _PROD) since each environment has its own account — adjust the env var
  // names below to match what's set in .env.<environment>.
  const env = (process.env.ENVIRONMENT || 'uat').toUpperCase();

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(requireEnv(`APP_ADMIN_USERNAME_${env}`), requireEnv(`APP_ADMIN_PASSWORD_${env}`));

  await page.context().storageState({ path: AUTH_FILE });
});
