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

async function edgePaint(page: Page, sel: string, band: 'top' | 'bottom') {
  const sheet = page.locator(`${sel}:visible`).first();
  const box = (await sheet.boundingBox())!;
  const y = band === 'top' ? Math.round(box.y) : Math.round(box.y + box.height) - 14;
  const clip = { x: Math.round(box.x), y, width: Math.round(box.width), height: 14 };
  const shoot = async () => (await page.screenshot({ clip })).toString('base64');
  const on = await shoot();
  const off = await page.addStyleTag({ content: '.head-sheet-edge { visibility: hidden !important; }' });
  const bare = await shoot();
  await off.evaluate((e) => (e as Element).remove());
  return page.evaluate(async ({ on, bare, band }) => {
    const read = async (b64: string) => { const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob()); const c = document.createElement('canvas'); c.width = bmp.width; c.height = bmp.height; const x = c.getContext('2d')!; x.drawImage(bmp, 0, 0); return x.getImageData(0, 0, c.width, c.height); };
    const lum = (d: Uint8ClampedArray, i: number) => { const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * f(d[i]) + 0.7152 * f(d[i + 1]) + 0.0722 * f(d[i + 2]); };
    const [a, b] = [await read(on), await read(bare)];
    const H = a.height; const Y = (y: number) => (band === 'top' ? y : H - 1 - y);
    const best = (img: ImageData, x: number) => { const g = lum(img.data, (Y(10) * img.width + x) * 4); let r = 1; for (let y = 0; y < 5; y++) { const l = lum(img.data, (Y(y) * img.width + x) * 4); r = Math.max(r, (Math.max(l, g) + 0.05) / (Math.min(l, g) + 0.05)); } return r; };
    const x0 = Math.floor(a.width * 0.2), x1 = Math.floor(a.width * 0.8); let drawn = 0; const on_: number[] = [];
    for (let x = x0; x < x1; x++) { const r = best(a, x); on_.push(r); if (r >= 1.5 * best(b, x)) drawn++; }
    on_.sort((p, q) => p - q);
    return { frac: +(drawn / (x1 - x0)).toFixed(3), onMedian: +on_[on_.length >> 1].toFixed(2) };
  }, { on, bare, band });
}

test('C6 edge blind spots', async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(SOLO); await settled(page);
  const plants: [string, string][] = [
    ['none', ''],
    ['X3@40', '.head-sheet-edge { clip-path: inset(0 0 calc(100% - 40px) 0) !important; }'],
    ['X3@70', '.head-sheet-edge { clip-path: inset(0 0 calc(100% - 70px) 0) !important; }'],
    ['X6-bottom-gone', '.head-sheet-edge { clip-path: inset(0 0 16px 0) !important; }'],
    ['X5@0.3', '.head-sheet-edge { opacity: 0.3 !important; }'],
    ['X5@0.4', '.head-sheet-edge { opacity: 0.4 !important; }'],
    ['X5@0.5', '.head-sheet-edge { opacity: 0.5 !important; }'],
  ];
  const out: Record<string, unknown> = {};
  for (const which of ['lobby', 'card'] as const) {
    if (which === 'lobby') { await mark(page).click(); await expect(lob(page)).toHaveClass(/is-open/); await stable(() => lob(page).evaluate((e) => e.getBoundingClientRect().height)); }
    else { await page.keyboard.press('Escape'); await page.locator('.corner-left .attribution-trigger').hover(); const c = page.locator('.corner-left .hover-card'); await expect(c).toHaveClass(/is-open/); await stable(() => c.evaluate((e) => getComputedStyle(e).opacity + JSON.stringify(e.getBoundingClientRect()))); }
    const sel = which === 'lobby' ? '[data-lobby]' : '.corner-left .hover-card';
    for (const [name, css] of plants) {
      const tag = css ? await page.addStyleTag({ content: css }) : null;
      const a = await edgePaint(page, sel, 'top'); const b = await edgePaint(page, sel, 'bottom');
      out[`${which}:${name}`] = `top ${a.frac}/${a.onMedian} bottom ${b.frac}/${b.onMedian}`;
      if (tag) await tag.evaluate((e) => (e as Element).remove());
    }
  }
  log({ row: 'C6', engine: info.project.name, out });
});
