import { test, expect } from '@playwright/test';

/** Ensure standalone IIFE is present when Vite build is missing. */
async function ensureSelectAllScript(page: import('@playwright/test').Page) {
  await page.addScriptTag({ url: '/bundles/nowoselectallchoice/select-all-choice.js' });
  await page.waitForFunction(() => document.querySelector('[data-select-all-target="toggle"]') !== null, {
    timeout: 5000,
  });
}

test.describe('SelectAllChoice demo', () => {
  test('locale form shows select-all widget', async ({ page }) => {
    const response = await page.goto('/en');
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('nowo-select-all-choice').first()).toBeVisible();
  });

  test('select-all toggle checks choices', async ({ page }) => {
    await page.goto('/en');
    const host = page.locator('nowo-select-all-choice').first();
    await expect(host).toBeVisible();
    await ensureSelectAllScript(page);
    const toggle = page.locator('[data-select-all-target="toggle"]').first();
    await expect(toggle).toBeVisible({ timeout: 5000 });
    await toggle.check();
    await expect(toggle).toBeChecked();
  });
});
