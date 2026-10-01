import { test, expect } from '@playwright/test';

test.describe('Properties API', () => {
  test('returns a non-empty list of properties', { tag: '@smoke' }, async ({ request }) => {
    const response = await request.get('/api/properties');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.properties)).toBe(true);
    expect(body.properties.length).toBeGreaterThan(0);
    expect(body.count).toBeGreaterThanOrEqual(body.properties.length);
  });

  test('every property has the core fields', { tag: '@regression' }, async ({ request }) => {
    const response = await request.get('/api/properties');
    expect(response.status()).toBe(200);
    const { properties } = await response.json();

    for (const property of properties) {
      expect(property).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          price: expect.any(Number),
          city: expect.any(String),
          beds: expect.any(Number),
          baths: expect.any(Number),
        })
      );
      expect(property.price).toBeGreaterThan(0);
    }
  });

  test('property ids are unique', { tag: '@regression' }, async ({ request }) => {
    const response = await request.get('/api/properties');
    expect(response.status()).toBe(200);
    const { properties } = await response.json();

    const ids = properties.map((p: { id: number }) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
