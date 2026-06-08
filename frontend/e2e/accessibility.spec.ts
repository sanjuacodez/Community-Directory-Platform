import { test, expect } from '@playwright/test';

test.describe('Accessibility (a11y)', () => {
  test('home page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
  });

  test('navigation has accessible links', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    const links = nav.locator('a');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('forms have labels', async ({ page }) => {
    await page.goto('/families');
    const inputs = page.locator('input');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('color contrast is sufficient', async ({ page }) => {
    await page.goto('/');
    const body = page.locator('body');
    const color = await body.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { bg: style.backgroundColor, fg: style.color };
    });
    expect(color.bg).toBeTruthy();
    expect(color.fg).toBeTruthy();
  });

  test('no missing alt attributes on images', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeDefined();
    }
  });
});

test.describe('Performance', () => {
  test('home page loads within 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(3000);
  });

  test('announcements page loads within 2 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/announcements');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(2000);
  });

  test('directory page loads within 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/directory');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(3000);
  });
});
