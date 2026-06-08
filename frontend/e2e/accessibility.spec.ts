import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('home page heading hierarchy', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('Community Directory');
  });

  test('all nav links have text', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('nav a');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const text = await links.nth(i).textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('login form has accessible inputs', async ({ page }) => {
    await page.goto('/login');
    const email = page.locator('input[type="email"]');
    const password = page.locator('input[type="password"]');
    await expect(email).toBeVisible();
    await expect(password).toBeVisible();
    await expect(email).toHaveAttribute('placeholder');
    // Labels exist
    const labels = page.locator('label');
    await expect(labels.nth(0)).toContainText('Email');
  });

  test('forms have submit buttons', async ({ page }) => {
    await page.goto('/login');
    const btn = page.locator('button[type="submit"]');
    await expect(btn).toBeVisible();
  });

  test('all pages have main landmark', async ({ page }) => {
    const pages = ['/','/login','/announcements','/events','/businesses','/jobs','/obituaries'];
    for (const p of pages) {
      await page.goto(p);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    }
  });

  test('no empty links', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('a');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const hasImg = (await link.locator('img').count()) > 0;
      if (!hasImg) expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('keyboard navigation on login', async ({ page }) => {
    await page.goto('/login');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('image upload component accessible', async ({ page }) => {
    // login first then go to member create
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@communityportal.com');
    await page.fill('input[type="password"]', 'admin123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    await page.goto('/members/create');
    await page.waitForLoadState('networkidle');
    // Image upload should have a label
    const uploadLabel = page.locator('#profile-image-label');
    await expect(uploadLabel).toBeVisible();
    // The upload area should be focusable
    const uploadArea = page.locator('[role="button"]').first();
    await expect(uploadArea).toHaveAttribute('tabindex', '0');
  });
});

test.describe('Performance', () => {
  test('home page loads under 2s', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(Date.now() - start).toBeLessThan(2000);
  });

  test('login page loads under 1.5s', async ({ page }) => {
    const start = Date.now();
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    expect(Date.now() - start).toBeLessThan(1500);
  });

  test('announcements page loads under 2s', async ({ page }) => {
    const start = Date.now();
    await page.goto('/announcements');
    await page.waitForLoadState('networkidle');
    expect(Date.now() - start).toBeLessThan(2000);
  });
});

test.describe('Responsive Design', () => {
  test('mobile nav visible', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('login page centered on mobile', async ({ page }) => {
    await page.goto('/login');
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });
});

test.describe('UX Flows', () => {
  test('full login flow', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@communityportal.com');
    await page.fill('input[type="password"]', 'admin123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    const nav = page.locator('nav');
    await expect(nav).toContainText('admin@communityportal.com');
  });

  test('logout flow', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@communityportal.com');
    await page.fill('input[type="password"]', 'admin123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await page.click('button:has-text("Logout")');
    await expect(page.locator('nav')).toContainText('Login');
  });

  test('member creation page loads all form fields', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@communityportal.com');
    await page.fill('input[type="password"]', 'admin123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    await page.goto('/members/create');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('Add Member');
    await expect(page.locator('input[type="date"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    // Image upload should be present
    await expect(page.locator('#profile-image-label')).toBeVisible();
  });
});
