/** PLR-SELF pass-6 CRITIC instruments (dev tree :4244, ?wire=local, seven at the table). */
import { test, expect, type Page, type Browser } from '@playwright/test';
import fs from 'node:fs';
const OUT = process.env.OUT!;
const log = (o: unknown) => { const l = JSON.stringify(o); fs.appendFileSync(OUT, l + '\n'); console.log(l); };
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
const mark = (p: Page) => p.locator('[data-player-mark]:visible');
const lob = (p: Page) => p.locator('[data-lobby]:visible');
async function readSheet(page: Page) {
  return page.evaluate(() => {
    const el = [...document.querySelectorAll('[data-lobby]')].find((e) => (e as HTMLElement).getBoundingClientRect().width > 0) as HTMLElement;
    const s = el.getBoundingClientRect();
    const cells = [...document.querySelectorAll('.sudoku-cell')].map((c) => c.getBoundingClientRect()).filter((c) => c.width > 0);
    const lapped = cells.filter((c) => c.left < s.right && c.right > s.left && c.top < s.bottom && c.bottom > s.top).length;
    const top = Math.min(...cells.map((c) => c.top)); const left = Math.min(...cells.map((c) => c.left));
    return { open: el.classList.contains('is-open'), vis: getComputedStyle(el).visibility, rows: el.querySelectorAll('.pl-row').length,
      more: el.querySelector('.pl-more')?.textContent?.trim() ?? '', bottom: +s.bottom.toFixed(1), boardTop: +top.toFixed(1), boardLeft: +left.toFixed(1), lapped,
      vw: innerWidth, vh: innerHeight, coarse: matchMedia('(pointer: coarse)').matches };
  });
}
async function coarse(browser: Browser, w: number, h: number, touch = true) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch });
  const page = await ctx.newPage(); await page.goto(SOLO); await settled(page); return { ctx, page };
}
async function openMark(page: Page, tap: boolean) {
  if (tap) await mark(page).tap(); else await mark(page).click();
  await expect(lob(page)).toHaveClass(/is-open/);
  await stable(() => lob(page).evaluate((e) => e.getBoundingClientRect().bottom));
}


const CELLS: [number, number, boolean][] = [[440, 800, true], [460, 800, true], [480, 800, true], [520, 800, true], [560, 800, true], [620, 800, true], [700, 800, true], [768, 1024, true], [600, 700, false], [800, 700, false], [900, 640, false]];
for (const [w, h, touch] of CELLS)
  test(`C9 width sweep ${w}x${h} ${touch ? 'coarse' : 'fine'}`, async ({ browser }, info) => {
    const { ctx, page } = await coarse(browser, w, h, touch);
    await invite(page); await crowd(page, 6, `c9-${w}x${h}`);
    await openMark(page, touch);
    const r = await readSheet(page);
    const rs = await page.evaluate(() => { const el = [...document.querySelectorAll('[data-lobby]')].find((e) => (e as HTMLElement).getBoundingClientRect().width > 0) as HTMLElement; const s = el.getBoundingClientRect(); return { sheetLeft: +s.left.toFixed(1), sheetRight: +s.right.toFixed(1), rowsStart: +(s.left + parseFloat(getComputedStyle(el).paddingLeft)).toFixed(1) }; });
    log({ row: 'C9', engine: info.project.name, cell: `${w}x${h}`, touch, ...r, ...rs });
    await ctx.close();
  });
