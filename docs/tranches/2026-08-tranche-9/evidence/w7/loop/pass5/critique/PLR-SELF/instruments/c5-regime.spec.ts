import { test, expect, type Browser, type Page } from '@playwright/test';
import fs from 'node:fs';
const OUT = process.env.OUT!;
const SOLO = './?size=3&difficulty=EASY&wire=local';
async function settled(page: Page) {
  await page.waitForSelector('svg.handwritten-logo', { timeout: 60000 });
  await expect.poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 60000 }).toBeGreaterThan(0);
}
async function stable(read: () => Promise<unknown>) {
  let last: unknown = Symbol('u');
  await expect.poll(async () => { const v = JSON.stringify(await read()); const s = v === last; last = v; return s; }, { intervals: [150], timeout: 8000 }).toBe(true);
}
async function invite(page: Page) {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  const docked = !(await verb.isVisible());
  if (docked) { await page.locator('.drawer-tab').first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top)); }
  await verb.click();
  await expect.poll(() => page.locator('.players-roster .player-row').count()).toBe(1);
  if (docked) { await page.locator('.drawer-tab').first().click(); await expect(page.locator('#controls-drawer .drawer-case')).toBeHidden(); }
}
async function crowd(page: Page, n: number, tag: string) {
  await page.evaluate(({ n, tag }) => { const room = new URL(location.href).searchParams.get('s')!; const ch = new BroadcastChannel(`board:${room}`); for (let i = 0; i < n; i++) ch.postMessage({ kind: 'hi', data: {}, from: `${tag}-${i}` }); setTimeout(() => ch.close(), 0); }, { n, tag });
  await expect.poll(() => page.locator('.players-roster .player-row').count(), { timeout: 15000 }).toBe(n + 1);
}
const CELLS: [number, number, boolean][] = [
  [390, 664, true], [390, 799, true], [390, 800, true], [360, 800, true], [390, 820, true], [390, 844, true], [430, 800, true],
  [844, 390, true], [812, 375, true], [700, 780, false], [1280, 800, false],
];
for (const [w, h, coarse] of CELLS) {
  test(`regime ${w}x${h} ${coarse ? 'coarse' : 'fine'}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: coarse });
    const page = await ctx.newPage();
    await page.goto(SOLO); await settled(page);
    const pc = await page.evaluate(() => matchMedia('(pointer: coarse)').matches);
    await invite(page); await crowd(page, 6, 'c5');
    const m = page.locator('[data-player-mark]:visible');
    if (coarse) await m.tap(); else await m.click();
    const lob = page.locator('[data-lobby]:visible');
    await expect(lob).toHaveClass(/is-open/);
    await stable(() => lob.evaluate((e) => e.getBoundingClientRect().bottom));
    const r = await lob.evaluate((el) => {
      const s = el.getBoundingClientRect();
      const cells = [...document.querySelectorAll('.sudoku-cell')].map((c) => c.getBoundingClientRect()).filter((c) => c.width > 0);
      const lap = cells.filter((c) => c.left < s.right && c.right > s.left && c.top < s.bottom && c.bottom > s.top).length;
      const top = Math.min(...cells.map((c) => c.top)); const left = Math.min(...cells.map((c) => c.left));
      return { rows: el.querySelectorAll('.pl-row').length, more: el.querySelector('.pl-more')?.textContent?.trim() ?? '',
        bottom: +s.bottom.toFixed(1), height: +s.height.toFixed(2), boardTop: +top.toFixed(1), boardLeft: +left.toFixed(1), lapped: lap,
        regime: matchMedia('(orientation: portrait) and (max-height: 799px)').matches,
        pass4: matchMedia('(pointer: coarse) and (max-height: 799px)').matches };
    });
    const line = JSON.stringify({ engine: info.project.name, cell: `${w}x${h}`, coarse, pointerCoarse: pc, ...r });
    fs.appendFileSync(OUT, line + '\n'); console.log(line);
    await ctx.close();
  });
}
