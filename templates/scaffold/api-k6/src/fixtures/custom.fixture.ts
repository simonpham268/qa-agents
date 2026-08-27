import { test as base } from '@playwright/test';
import { ApiClient } from '../api/base/api.client';

interface CustomFixtures {
  apiClient: ApiClient;
}

export const test = base.extend<CustomFixtures>({
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
});

export { expect } from '@playwright/test';
