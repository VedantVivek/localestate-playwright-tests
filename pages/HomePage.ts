import { type Locator, type Page, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly boardStatus: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('#location-search');
    this.searchButton = page.getByRole('button', { name: 'Search the board' });
    this.boardStatus = page.locator('#popular-status');
  }

  async goto() {
    await this.page.goto('/');
  }

  // The backend is serverless, so the first load can be slow while it wakes up
  async waitForBoard() {
    await expect(this.boardStatus).toHaveText(/^\d+ on the board$/, { timeout: 20_000 });
  }

  async boardCount(): Promise<number> {
    await this.waitForBoard();
    return Number.parseInt(await this.boardStatus.innerText(), 10);
  }

  // Waits for the search API response instead of a fixed delay
  async search(term: string) {
    await this.searchInput.fill(term);
    const searchResponse = this.page.waitForResponse(
      (res) => res.url().includes('/api/properties?') && res.request().method() === 'GET'
    );
    await this.searchButton.click();
    await searchResponse;
  }
}