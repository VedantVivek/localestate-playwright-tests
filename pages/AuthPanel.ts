import { type Locator, type Page, expect } from '@playwright/test';

export class AuthPanel {
  readonly page: Page;
  readonly headerButton: Locator;
  readonly userName: Locator;
  readonly modal: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly note: Locator;
  readonly popup: Locator;
  readonly popupTitle: Locator;
  readonly popupOkButton: Locator;

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
    this.popup = page.locator('#le-popup');
    this.popupTitle = page.locator('#le-popup-title');
    this.popupOkButton = this.popup.getByRole('button', { name: 'OK' });
  }

  async open() {
    await this.headerButton.click();
  }

  async signIn(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  // The app shows a confirmation popup after sign-in and sign-out
  async dismissPopup() {
    await this.popupOkButton.click();
    await expect(this.popup).toBeHidden();
  }

  async signOut() {
    await this.headerButton.click();
  }
}