import { test, expect } from '@playwright/test';

const DEMO_USER = {
  email: process.env.DEMO_EMAIL ?? 'demo@localeestate.com',
  password: process.env.DEMO_PASSWORD ?? 'demo1234',
};

test.describe('Auth API', () => {
  test('gives the same error for a wrong password and an unknown email', { tag: '@regression' }, async ({ request }) => {
    const wrongPassword = await request.post('/api/auth/login', {
      data: { email: DEMO_USER.email, password: 'wrong-password' },
    });
    const unknownEmail = await request.post('/api/auth/login', {
      data: { email: 'no-such-user@example.com', password: 'whatever123' },
    });

    expect(wrongPassword.status()).toBe(401);
    expect(unknownEmail.status()).toBe(401);
    expect(await wrongPassword.json()).toEqual({ error: 'Invalid email or password' });
    expect(await unknownEmail.json()).toEqual({ error: 'Invalid email or password' });
  });

  test('rejects an empty login request without a server error', { tag: '@regression' }, async ({ request }) => {
    const response = await request.post('/api/auth/login', { data: {} });
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });

  test('blocks the profile endpoint without a token', { tag: '@regression' }, async ({ request }) => {
    const response = await request.get('/api/auth/me');
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ error: 'Please sign in' });
  });

  test('blocks the profile endpoint with an invalid token', { tag: '@regression' }, async ({ request }) => {
    const response = await request.get('/api/auth/me', {
      headers: { Authorization: 'Bearer not-a-real-token' },
    });
    expect(response.status()).toBe(401);
  });

  test('signs in, reads the profile and signs out', { tag: '@regression' }, async ({ request }) => {
    let token = '';

    await test.step('sign in with the demo account', async () => {
      const response = await request.post('/api/auth/login', { data: DEMO_USER });
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.token).toEqual(expect.any(String));
      expect(body.token.length).toBeGreaterThan(0);
      expect(body.user.email).toBe(DEMO_USER.email);
      expect(body.user).not.toHaveProperty('password');
      token = body.token;
    });

    await test.step('read the signed-in profile', async () => {
      const response = await request.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status()).toBe(200);
      expect((await response.json()).user.email).toBe(DEMO_USER.email);
    });

    await test.step('sign out', async () => {
      const response = await request.post('/api/auth/logout', {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status()).toBe(200);
      expect(await response.json()).toEqual({ ok: true });
    });

    await test.step('the old token no longer works', async () => {
      const response = await request.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status()).toBe(401);
    });
  });
});