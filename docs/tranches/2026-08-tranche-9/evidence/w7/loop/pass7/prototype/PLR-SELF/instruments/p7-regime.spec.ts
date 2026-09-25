/** PLR-SELF pass 7 (copy of pass 6's p6-regime, OUT re-pointed; + the pass-6 critic's unpriced cells) — the band census (copy of the pass-5 critic's c5-regime, OUT re-pointed; +16×16 landscape,
 *  + the one-row lap each tall sheet would have had, + a longest-slug cell). Seven at the table, dev (?wire=local). */
import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
const OUT = process.env.OUT!;
async function settled(page: Page) {
  await page.waitForSelector('svg.handwritten-logo', { timeout: 60000 });
  await expect.poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 60000 }).toBeGreaterThan(0);
}
async function stable(read: () => Promise<unknown>) {
  let last: unknown = Symbol('u');
  await expect.poll(async () => { const v = JSON.stringify(await read()); const s = v === last; last = v; return s; }, { intervals: [150], timeout: 30000 }).toBe(true);
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
async function crowd(page: Page, ids: string[]) {
  await page.evaluate((ids) => { const room = new URL(location.href).searchParams.get('s')!; const ch = new BroadcastChannel(`board:${room}`); for (const id of ids) ch.postMessage({ kind: 'hi', data: {}, from: id }); setTimeout(() => ch.close(), 0); }, ids);
  await expect.poll(() => page.locator('.players-roster .player-row').count(), { timeout: 15000 }).toBe(ids.length + 1);
}
/** `long-66737` slugs to `straightforward-tyrannosaurus` (29 chars, the dictionaries' longest pair; found by a
 *  search of 66,737 ids on the dev server's own `slugFor`). Read back, never assumed. */
async function longId(page: Page) {
  return page.evaluate(async () => {
    const m = await import('/src/games/shared/playerIdentity.ts');
    return { id: 'long-66737', slug: m.slugFor('long-66737', new Set()) };
  });
}
const CELLS: [number, number, boolean, number, boolean][] = [
  [390, 664, true, 3, false], [390, 800, true, 3, false], [360, 800, true, 3, false], [390, 844, true, 3, false],
  [768, 1024, true, 3, false], [520, 800, true, 3, false], [560, 800, true, 3, false], [620, 800, true, 3, false], [700, 800, true, 3, false],
  [844, 390, true, 3, false], [812, 375, true, 3, false], [844, 390, true, 4, false], [812, 375, true, 4, false],
  [800, 700, false, 3, false], [900, 640, false, 3, false], [1280, 800, false, 3, false], [1280, 720, false, 3, false],
];
for (const [w, h, coarse, size, long] of CELLS) {
  test(`regime ${w}x${h} ${coarse ? 'coarse' : 'fine'} ${size * size}${long ? ' long-slug' : ''}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: coarse });
    const page = await ctx.newPage();
    await page.goto(`./?size=${size}&difficulty=EASY&wire=local`); await settled(page);
    const pc = await page.evaluate(() => matchMedia('(pointer: coarse)').matches);
    await invite(page);
    const ids = ['c6-0', 'c6-1', 'c6-2', 'c6-3', 'c6-4', 'c6-5'];
    let slug = '';
    if (long) { const L = await longId(page); ids[0] = L.id; slug = L.slug; }
    await crowd(page, ids);
    // the long row's qualifier: the peers said hello once, so 21 s on they are QUIET (read at the open)
    if (long) await page.clock.setSystemTime(new Date(Date.now() + 21000));
    const m = page.locator('[data-player-mark]:visible');
    if (coarse) await m.tap(); else await m.click();
    const lob = page.locator('[data-lobby]:visible');
    await expect(lob).toHaveClass(/is-open/);
    await stable(() => lob.evaluate((e) => e.getBoundingClientRect().bottom));
    const r = await lob.evaluate((el) => {
      const s = el.getBoundingClientRect();
      const cells = [...document.querySelectorAll('.sudoku-cell')].map((c) => c.getBoundingClientRect()).filter((c) => c.width > 0);
      const lapOf = (bottom: number) => cells.filter((c) => c.left < s.right && c.right > s.left && c.top < bottom && c.bottom > s.top).length;
      const rows = [...el.querySelectorAll('.pl-row')].map((e) => e.getBoundingClientRect().height);
      const top = Math.min(...cells.map((c) => c.top)); const left = Math.min(...cells.map((c) => c.left));
      return { rows: rows.length, rowH: rows.map((x) => +x.toFixed(2)), more: el.querySelector('.pl-more')?.textContent?.trim() ?? '',
        bottom: +s.bottom.toFixed(1), height: +s.height.toFixed(2), boardTop: +top.toFixed(1), boardLeft: +left.toFixed(1),
        lapped: lapOf(s.bottom), lapIfOneRow: rows.length > 1 ? lapOf(s.bottom - rows.slice(1).reduce((a, b) => a + b, 0)) : null,
        pass5key: matchMedia('(orientation: portrait) and (max-height: 799px)').matches };
    });
    const line = JSON.stringify({ arm: process.env.ARM, engine: info.project.name, cell: `${w}x${h}`, board: size * size, coarse, pointerCoarse: pc, slug: slug || undefined, ...r });
    fs.appendFileSync(OUT, line + '\n'); console.log(line);
    await ctx.close();
  });
}
