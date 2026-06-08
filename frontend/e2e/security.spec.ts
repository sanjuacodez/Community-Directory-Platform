import { test, expect } from '@playwright/test';

test.describe('Security Tests', () => {
  test('frontend page loads without errors', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('backend returns security headers', async ({ page }) => {
    const response = await page.request.get('http://localhost:3001/api/announcements');
    expect(response.status()).toBe(200);
    const headers = response.headers();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBeDefined();
  });

  test('auth endpoints return 401 without token', async ({ page }) => {
    const response = await page.request.post('http://localhost:3001/api/members', {
      data: { firstName: 'Test' },
    });
    expect(response.status()).toBe(401);
  });

  test('CORS headers present on backend', async ({ page }) => {
    const response = await page.request.get('http://localhost:3001/api/announcements', {
      headers: { Origin: 'http://localhost:3000' },
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['access-control-allow-origin']).toBe('http://localhost:3000');
  });
});
