import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads with the LocaleEstate title', { tag: '@smoke' }, async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle('LocaleEstate');
  });
});