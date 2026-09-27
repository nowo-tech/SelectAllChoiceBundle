import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * REQ-DEMO-013 — full demo frame: navbar toolbar + heading + form with
 * select-all widgets + Symfony WebProfiler toolbar.
 *
 * Playwright clips to the viewport, so we enlarge the viewport before capture.
 */
const outDir = process.env.SCREENSHOT_DIR
  ? resolve(process.env.SCREENSHOT_DIR)
  : resolve(__dirname, '../../../../docs/images/demo');

type Box = { x: number; y: number; width: number; height: number };

async function boxOf(
  page: import('@playwright/test').Page,
  selector: string,
): Promise<Box | null> {
  const loc = page.locator(selector).first();
  if ((await loc.count()) === 0) {
    return null;
  }
  return loc.boundingBox();
}

/** Navbar → main → profiler (union), padded. */
async function clipDemoFrame(page: import('@playwright/test').Page): Promise<Box> {
  const nav = await boxOf(page, 'nav.navbar');
  const main = await boxOf(page, 'main');
  const profiler =
    (await boxOf(page, '.sf-toolbar')) ?? (await boxOf(page, '.sf-minitoolbar'));
  if (!nav || !main) {
    throw new Error('Missing nav.navbar or main for SelectAllChoice screenshot clip');
  }
  const boxes = [nav, main, profiler].filter(Boolean) as Box[];
  const x = Math.min(...boxes.map((b) => b.x));
  const y = Math.min(...boxes.map((b) => b.y));
  const right = Math.max(...boxes.map((b) => b.x + b.width));
  const bottom = Math.max(...boxes.map((b) => b.y + b.height));
  const pad = 8;
  return {
    x: Math.max(0, x - pad),
    y: Math.max(0, y - pad),
    width: right - x + pad * 2,
    height: bottom - y + pad * 2,
  };
}

async function prepareDemoPage(page: import('@playwright/test').Page) {
  // Clip cannot exceed viewport — size for navbar + full form + profiler.
  await page.setViewportSize({ width: 1280, height: 1600 });
  await page.goto('/en');
  await expect(page.locator('nav.navbar .navbar-brand')).toBeVisible();
  await expect(page.locator('main .card')).toBeVisible();
  await page.waitForFunction(() => document.querySelector('[data-select-all-target="toggle"]') !== null, {
    timeout: 8000,
  });
  // Prefer loaded profiler (status) over "Loading…".
  await page
    .locator('.sf-toolbar .sf-toolbar-block, .sf-toolbar-status, .sf-minitoolbar')
    .first()
    .waitFor({ state: 'visible', timeout: 10000 })
    .catch(() => {});
}

test.beforeAll(() => {
  mkdirSync(outDir, { recursive: true });
});

test.describe('SelectAllChoice screenshots (full demo context)', () => {
  test('overview — navbar + form + toolbar, select-all unchecked', async ({ page }) => {
    await prepareDemoPage(page);
    await expect(page.locator('[data-select-all-target="toggle"]')).toHaveCount(3);
    await expect(page.getByText(/Categories|Categorías/i)).toBeVisible();
    // Prefer clip (navbar→main→profiler); fall back to fullPage if clip is short.
    const clip = await clipDemoFrame(page);
    if (clip.height >= 900) {
      await page.screenshot({ path: resolve(outDir, 'overview.png'), clip });
    } else {
      await page.screenshot({ path: resolve(outDir, 'overview.png'), fullPage: true });
    }
  });

  test('interaction — navbar + form + toolbar, all select-all checked', async ({ page }) => {
    await prepareDemoPage(page);
    const toggles = page.locator('[data-select-all-target="toggle"]');
    await expect(toggles).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      const toggle = toggles.nth(i);
      await toggle.check();
      await expect(toggle).toBeChecked();
    }
    await expect(page.locator('main .card .form-check-input:checked').first()).toBeVisible();
    const clip = await clipDemoFrame(page);
    if (clip.height >= 900) {
      await page.screenshot({ path: resolve(outDir, 'interaction.png'), clip });
    } else {
      await page.screenshot({ path: resolve(outDir, 'interaction.png'), fullPage: true });
    }
  });
});
