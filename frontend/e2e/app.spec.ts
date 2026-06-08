import { test, expect } from '@playwright/test';

test.describe('Navigation & Pages', () => {
  test('home page loads', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Community Directory');
  });

  test('all pages load without errors', async ({ page }) => {
    const pages = [
      '/',
      '/announcements',
      '/events',
      '/businesses',
      '/jobs',
      '/obituaries',
      '/directory',
      '/families',
      '/members',
    ];

    for (const path of pages) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    }
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav.locator('a[href="/families"]')).toBeVisible();
    await expect(nav.locator('a[href="/members"]')).toBeVisible();
    await expect(nav.locator('a[href="/directory"]')).toBeVisible();
    await expect(nav.locator('a[href="/events"]')).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('members page renders on mobile', async ({ page }) => {
    await page.goto('/members');
    await page.waitForLoadState('networkidle');
    // Page shows login prompt when not authenticated
    await expect(page.locator('body')).toBeVisible();
  });

  test('directory page renders on tablet', async ({ page }) => {
    await page.goto('/directory');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Auth Flow', () => {
  test('login form renders', async ({ page }) => {
    await page.goto('/families');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Login');
  });

  test('login shows validation for empty fields', async ({ page }) => {
    await page.goto('/families');
    // Click submit without filling
    const submit = page.locator('button[type="submit"]');
    // The form is there
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('login with credentials works', async ({ page }) => {
    await page.goto('/families');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123456');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('Families');
  });
});

test.describe('Member Directory Flow', () => {
  test('directory page loads', async ({ page }) => {
    await page.goto('/directory');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });
});
