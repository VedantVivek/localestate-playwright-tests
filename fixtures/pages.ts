import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { AuthPanel } from '../pages/AuthPanel';

type Pages = {
  homePage: HomePage;
  authPanel: AuthPanel;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  authPanel: async ({ page }, use) => {
    await use(new AuthPanel(page));
  },
});

export { expect } from '@playwright/test';