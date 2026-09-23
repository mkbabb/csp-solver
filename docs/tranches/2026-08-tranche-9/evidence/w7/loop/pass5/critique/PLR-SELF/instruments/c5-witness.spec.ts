import { test, expect } from '@playwright/test';
test('witness the edge layer', async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('./?size=3&difficulty=EASY&wire=local');
  await page.waitForSelector('svg.handwritten-logo', { timeout: 60000 });
  await page.locator('[data-player-mark]:visible').click();
  await expect(page.locator('[data-lobby]:visible')).toHaveClass(/is-open/);
  await page.waitForTimeout(400);
  const w = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('.head-sheet-edge')].filter((e) => e.getBoundingClientRect().width > 0).map((e) => { const cs = getComputedStyle(e); const p = e.querySelector('path'); return { opacity: cs.opacity, color: cs.color, stroke: p ? getComputedStyle(p).stroke : null }; }));
  console.log('WITNESS ' + info.project.name + ' ' + JSON.stringify(w));
});
