import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

/** REQ-DEMO-013 — demo card with select-all choices. */
const outDir = process.env.SCREENSHOT_DIR
  ? resolve(process.env.SCREENSHOT_DIR)
  : resolve(__dirname, '../../../../docs/images/demo');

function useCasePanel(page: import('@playwright/test').Page) {
  return page.locator('main .card').first();
}

async function ensureSelectAllScript(page: import('@playwright/test').Page) {
  await page.addScriptTag({ url: '/bundles/nowoselectallchoice/select-all-choice.js' });
  await page.waitForFunction(() => document.querySelector('[data-select-all-target="toggle"]') !== null, {
    timeout: 5000,
  });
}

test.beforeAll(() => {
  mkdirSync(outDir, { recursive: true });
});

test.describe('SelectAllChoice screenshots (use-case context)', () => {
  test('overview — unchecked in demo card', async ({ page }) => {
    await page.goto('/en');
    const panel = useCasePanel(page);
    await expect(panel).toBeVisible();
    await ensureSelectAllScript(page);
    await expect(page.locator('[data-select-all-target="toggle"]').first()).toBeVisible();
    await panel.screenshot({ path: resolve(outDir, 'overview.png') });
  });

  test('interaction — all selected in demo card', async ({ page }) => {
    await page.goto('/en');
    const panel = useCasePanel(page);
    await expect(panel).toBeVisible();
    await ensureSelectAllScript(page);
    const toggle = page.locator('[data-select-all-target="toggle"]').first();
    await expect(toggle).toBeVisible({ timeout: 5000 });
    await toggle.check();
    await expect(toggle).toBeChecked();
    await panel.screenshot({ path: resolve(outDir, 'interaction.png') });
  });
});
