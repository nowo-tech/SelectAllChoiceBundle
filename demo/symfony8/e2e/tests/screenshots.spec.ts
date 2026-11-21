import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * REQ-DEMO-013 — full demo frame: the demo platform shell + heading + form with
 * select-all widgets (Symfony toolbar hidden).
 */
const outDir = process.env.SCREENSHOT_DIR
  ? resolve(process.env.SCREENSHOT_DIR)
  : resolve(__dirname, '../../../../docs/images/demo');

/** The demo platform shell fills the viewport; the Symfony toolbar is hidden (it is not part of the demo). */
async function prepareDemoPage(page: import('@playwright/test').Page) {
  await page.setViewportSize({ width: 1280, height: 1100 });
  await page.goto('/en');
  await page.addStyleTag({ content: '.sf-toolbar,.sf-minitoolbar,[id^="sfwdt"]{display:none!important}' });
  await expect(page.getByTestId('demo-platform')).toBeVisible();
  await expect(page.locator('main [data-testid="demo-case"]')).toBeVisible();
  await page.waitForFunction(() => document.querySelector('[data-select-all-target="toggle"]') !== null, {
    timeout: 8000,
  });
}

test.beforeAll(() => {
  mkdirSync(outDir, { recursive: true });
});

test.describe('SelectAllChoice screenshots (full demo context)', () => {
  test('overview — platform shell + form, select-all unchecked', async ({ page }) => {
    await prepareDemoPage(page);
    await expect(page.locator('[data-select-all-target="toggle"]')).toHaveCount(3);
    await expect(page.getByText(/Categories|Categorías/i)).toBeVisible();
    await page.screenshot({ path: resolve(outDir, 'overview.png') });
  });

  test('interaction — platform shell + form, all select-all checked', async ({ page }) => {
    await prepareDemoPage(page);
    const toggles = page.locator('[data-select-all-target="toggle"]');
    await expect(toggles).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      const toggle = toggles.nth(i);
      await toggle.check();
      await expect(toggle).toBeChecked();
    }
    await expect(page.locator('main [data-testid="demo-case"] .nowo-ui-check__input:checked').first()).toBeVisible();
    await page.screenshot({ path: resolve(outDir, 'interaction.png') });
  });
});
