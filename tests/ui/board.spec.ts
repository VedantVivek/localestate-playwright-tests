import { test, expect } from '../../fixtures/pages';

test.describe('Property board', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('shows how many properties are listed', { tag: '@smoke' }, async ({ homePage }) => {
    expect(await homePage.boardCount()).toBeGreaterThan(0);
  });

  test('narrows the board when searching for a city', { tag: '@regression' }, async ({ homePage }) => {
    const total = await homePage.boardCount();
    await homePage.search('Mumbai');

    await expect
      .poll(async () => {
        const match = (await homePage.boardStatus.innerText()).match(/^(\d+) on the board$/);
        const count = match ? Number(match[1]) : -1;
        return count > 0 && count < total;
      })
      .toBe(true);
  });

  test('tells the user when a search finds nothing', { tag: '@regression' }, async ({ homePage }) => {
    await homePage.waitForBoard();
    await homePage.search('zzzz-no-such-place');
    await expect(homePage.boardStatus).toHaveText(/^Nothing matched/);
  });
});