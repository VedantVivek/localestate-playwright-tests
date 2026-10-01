import { test, expect } from '../../fixtures/pages';
import { DEMO_USER } from '../../test-data/users';

test.describe('Sign in', () => {
  test.beforeEach(async ({ homePage, authPanel }) => {
    await homePage.goto();
    await authPanel.open();
    await expect(authPanel.modal).toBeVisible();
  });

  test('shows an error for a wrong password', { tag: '@regression' }, async ({ authPanel }) => {
    await authPanel.signIn(DEMO_USER.email, 'wrong-password');
    await expect(authPanel.note).not.toBeEmpty();
    await expect(authPanel.userName).toBeHidden();
  });

  test('signs in with the demo account', { tag: '@regression' }, async ({ authPanel }) => {
    await authPanel.signIn(DEMO_USER.email, DEMO_USER.password);
    await expect(authPanel.userName).toBeVisible();
    await expect(authPanel.userName).not.toBeEmpty();
    await expect(authPanel.headerButton).toHaveText('Sign out');
  });
});