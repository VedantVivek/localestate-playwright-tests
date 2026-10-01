import { type Locator, type Page } from '@playwright/test';

export class AuthPanel {
  readonly page: Page;
  readonly headerButton: Locator;
  readonly userName: Locator;
  readonly modal: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly note: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerButton = page.locator('#auth-open');
    this.userName = page.locator('#nav-user');
    this.modal = page.locator('#auth-modal');
    const form = page.locator('#login-form');
    this.emailInput = form.locator('input[name="email"]');
    this.passwordInput = form.locator('input[name="password"]');
    this.submitButton = form.getByRole('button', { name: 'Sign in' });
    this.note = page.locator('#auth-note');
  }

  async open() {
    await this.headerButton.click();
  }

  async signIn(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}