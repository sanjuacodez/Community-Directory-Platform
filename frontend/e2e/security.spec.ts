import { test, expect } from '@playwright/test';

test.describe('Security', () => {
  test('frontend loads without errors', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('Supabase API returns security headers', async ({ request }) => {
    const resp = await request.get('https://fflgfmhliwrltyjbfguf.supabase.co/rest/v1/announcements?select=count', {
      headers: { apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmbGdmbWhsaXdybHR5amJmZ3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTA1MzUsImV4cCI6MjA5NjQ4NjUzNX0.vRaUgCgEC-t23ctSDCt51gTGN5zDNFcxPg1wQwm5j5g' },
    });
    expect(resp.status()).toBe(200);
    expect(resp.headers()['content-type']).toContain('application/json');
  });

  test('auth required endpoints reject without token', async ({ request }) => {
    const resp = await request.post('https://fflgfmhliwrltyjbfguf.supabase.co/rest/v1/members', {
      headers: {
        apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmbGdmbWhsaXdybHR5amJmZ3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTA1MzUsImV4cCI6MjA5NjQ4NjUzNX0.vRaUgCgEC-t23ctSDCt51gTGN5zDNFcxPg1wQwm5j5g',
        'Content-Type': 'application/json',
      },
      data: { first_name: 'test' },
    });
    expect(resp.status()).toBeGreaterThanOrEqual(400);
  });

  test('CORS headers present', async ({ request }) => {
    const resp = await request.get('https://fflgfmhliwrltyjbfguf.supabase.co/rest/v1/announcements?select=count', {
      headers: {
        apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmbGdmbWhsaXdybHR5amJmZ3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTA1MzUsImV4cCI6MjA5NjQ4NjUzNX0.vRaUgCgEC-t23ctSDCt51gTGN5zDNFcxPg1wQwm5j5g',
        'Origin': 'http://localhost:3000',
      },
    });
    expect(resp.status()).toBe(200);
    expect(resp.headers()['access-control-allow-origin']).toBe('*');
  });
});
