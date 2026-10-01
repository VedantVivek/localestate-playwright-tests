import { test, expect } from '@playwright/test';

test.describe('Health API', () => {
  test('reports the service and database as healthy', { tag: '@smoke' }, async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.mongo).toBe(true);
    expect(body.brand).toBe('LocaleEstate');
  });

  test('lists the core features', { tag: '@smoke' }, async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.features).toEqual(
      expect.arrayContaining(['auth', 'favorites', 'tours', 'reviews', 'filters'])
    );
  });
});