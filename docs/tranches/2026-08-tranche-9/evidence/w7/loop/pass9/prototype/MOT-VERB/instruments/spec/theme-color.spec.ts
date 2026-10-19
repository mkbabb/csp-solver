// theme-color.spec.ts (MOT-VERB pass 9 scratch instrument, never banked): INTAKE-23 row 16's closing read.
// On every flip (and at boot), meta[name=theme-color]'s content equals the PAINTED page background (a viewport
// corner pixel, photographed) and the computed body background. Arm (b) = a build with VITE_THEME_COLOR=on.
import { test, expect } from '@playwright/test';
test('row 16 · theme-color tracks the painted paper', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: 'no-preference', colorScheme: 'light' });
  await page.goto('/?game=sudoku');
  await page.locator('.board-cells').first().waitFor();
  await page.waitForTimeout(3500);
  const norm = (c: string) => page.evaluate((c) => { const x = document.createElement('canvas').getContext('2d')!; x.fillStyle = '#010203'; x.fillStyle = c; return x.fillStyle; }, c);
  const read = async (k: number) => {
    const meta = await page.evaluate(() => [...document.querySelectorAll('meta[name="theme-color"]')].map((m) => (m as HTMLMetaElement).content));
    const body = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const png = await page.screenshot({ clip: { x: 2, y: 2, width: 1, height: 1 } });
    const px = await page.evaluate(async (b64) => { const i = new Image(); await new Promise((ok) => { i.onload = ok; i.src = 'data:image/png;base64,' + b64; }); const c = document.createElement('canvas'); c.width = c.height = 1; const g = c.getContext('2d')!; g.drawImage(i, 0, 0); const d = g.getImageData(0, 0, 1, 1).data; return '#' + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, '0')).join(''); }, png.toString('base64'));
    const m = meta.length ? await norm(meta[0]) : null;
    const b = await norm(body);
    const dark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    console.log(`ROW16 ${test.info().project.name} flip ${k} dark ${dark}: metas ${meta.length} content ${m} · body ${b} · painted ${px} → ${m === null ? 'NO META' : m === px && m === b ? 'EQUAL' : 'DIFFERS'}`);
    return { m, b, px, n: meta.length };
  };
  const rows = [await read(0)];
  for (let k = 1; k <= 6; k++) {
    await page.locator('button.sun-moon-toggle').first().click();
    await page.waitForTimeout(1600);
    rows.push(await read(k));
  }
  if (process.env.ROW16_ARM === 'b') for (const r of rows) expect(r.m, 'meta ≠ painted paper').toBe(r.px);
  else for (const r of rows) expect(r.n, 'arm (a) ships a theme-color').toBe(0);
});
