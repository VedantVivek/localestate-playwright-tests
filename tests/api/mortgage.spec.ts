import { test, expect } from '@playwright/test';

test.describe('Mortgage API', () => {
  test('calculates a standard 30-year loan', { tag: '@smoke' }, async ({ request }) => {
    const response = await request.post('/api/mortgage', {
      data: { price: 500000, down: 20, years: 30, rate: 6.5 },
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.principal).toBe(400000);
    expect(body.monthly).toBe(2528);
    expect(body.downPercent).toBe(20);
    expect(body.years).toBe(30);
    expect(body.rate).toBe(6.5);
    // total uses the unrounded monthly amount, so allow a small difference
    expect(Math.abs(body.total - body.monthly * 360)).toBeLessThan(360);
  });

  test('falls back to 20% down, 30 years and 6.5% when only price is sent', { tag: '@regression' }, async ({ request }) => {
    const response = await request.post('/api/mortgage', { data: { price: 500000 } });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.downPercent).toBe(20);
    expect(body.years).toBe(30);
    expect(body.rate).toBe(6.5);
    expect(body.monthly).toBe(2528);
  });

  for (const price of [0, -100000, 'abc']) {
    test(`rejects an invalid price: ${price}`, { tag: '@regression' }, async ({ request }) => {
      const response = await request.post('/api/mortgage', { data: { price } });
      expect(response.status()).toBe(400);
      expect(await response.json()).toEqual({ error: 'Price required' });
    });
  }

  test('rejects a request with no price', { tag: '@regression' }, async ({ request }) => {
    const response = await request.post('/api/mortgage', { data: {} });
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ error: 'Price required' });
  });

  test('respects a 0% down payment', {
    tag: '@known-bug',
    annotation: { type: 'issue', description: 'https://github.com/VedantVivek/localEstate/issues/1' },
  }, async ({ request }) => {
    test.fail();
    const response = await request.post('/api/mortgage', { data: { price: 500000, down: 0 } });
    const body = await response.json();
    expect(body.principal).toBe(500000);
  });

  test('supports a 0% interest rate', {
    tag: '@known-bug',
    annotation: { type: 'issue', description: 'https://github.com/VedantVivek/localEstate/issues/2' },
  }, async ({ request }) => {
    test.fail();
    const response = await request.post('/api/mortgage', {
      data: { price: 720000, down: 50, years: 30, rate: 0 },
    });
    const body = await response.json();
    expect(body.monthly).toBe(1000);
  });
});