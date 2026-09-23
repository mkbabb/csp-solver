/** PLR-SELF pass 6 — the outside-edge band (LAWS P5; PLR-PLACE's critic): taps 1–4 css px BELOW the open lobby's bottom
 *  edge, over a board cell, coarse (hasTouch), seven at the table, 390×664 (the lap) — what does the tap reach: the cell
 *  (focus in a cell, sheet shut by the focus move) or the sheet (focus unchanged, sheet shut by the page's closeAll)? */
import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
const OUT = process.env.OUT!;
async function settled(page: Page) { await page.waitForSelector('svg.handwritten-logo', { timeout: 60000 }); await expect.poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 60000 }).toBeGreaterThan(0); }
async function stable(read: () => Promise<unknown>) { let last: unknown = Symbol('u'); await expect.poll(async () => { const v = JSON.stringify(await read()); const s = v === last; last = v; return s; }, { intervals: [150], timeout: 8000 }).toBe(true); }
test('edge taps', async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 664 }, hasTouch: true });
  const page = await ctx.newPage(); await page.goto('./?size=3&difficulty=EASY&wire=local'); await settled(page);
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await page.locator('.drawer-tab').first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top));
  await verb.click(); await expect.poll(() => page.locator('.players-roster .player-row').count()).toBe(1);
  await page.locator('.drawer-tab').first().click(); await expect(page.locator('#controls-drawer .drawer-case')).toBeHidden();
  await page.evaluate(() => { const room = new URL(location.href).searchParams.get('s')!; const ch = new BroadcastChannel(`board:${room}`); for (let i = 0; i < 6; i++) ch.postMessage({ kind: 'hi', data: {}, from: `e-${i}` }); setTimeout(() => ch.close(), 0); });
  await expect.poll(() => page.locator('.players-roster .player-row').count()).toBe(7);
  const rows: any[] = [];
  for (const dy of [-2, 1, 2, 3, 4]) {
    await page.locator('.sudoku-cell input').nth(80).tap();
    const mark = page.locator('[data-player-mark]:visible');
    await mark.tap(); await expect(mark).toHaveAttribute('aria-expanded', 'true');
    const lob = page.locator('[data-lobby]:visible');
    await stable(() => lob.evaluate((e) => e.getBoundingClientRect().bottom));
    const b = await lob.evaluate((e) => { const r = e.getBoundingClientRect(); return { bottom: r.bottom, x: r.left + 60 }; });
    const y = b.bottom + dy;
    const under = await page.evaluate(({ x, y }) => { const e = document.elementFromPoint(x, y); return e ? e.tagName + '.' + String(e.className).slice(0, 30) : null; }, { x: b.x, y });
    await page.touchscreen.tap(b.x, y);
    await stable(() => mark.getAttribute('aria-expanded'));
    rows.push({ dy, y: +y.toFixed(1), under, expanded: await mark.getAttribute('aria-expanded'), focus: await page.evaluate(() => { const a = document.activeElement as HTMLElement | null; return a?.closest('.sudoku-cell') ? 'cell ' + (a.getAttribute('aria-label') ?? '').slice(0, 24) : a?.tagName; }) });
  }
  const line = JSON.stringify({ engine: info.project.name, rows });
  fs.appendFileSync(OUT, line + '\n'); console.log('EDGETAP ' + line);
  await ctx.close();
});
