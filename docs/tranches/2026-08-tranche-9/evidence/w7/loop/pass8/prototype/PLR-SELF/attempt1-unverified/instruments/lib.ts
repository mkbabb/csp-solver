import { expect, type Browser, type Page } from '@playwright/test';
export async function settled(page: Page) {
  await page.waitForSelector('svg.handwritten-logo', { timeout: 60000 });
  await expect.poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 60000 }).toBeGreaterThan(0);
}
export async function stable(read: () => Promise<unknown>, timeout = 8000) {
  let last: unknown = Symbol('unread');
  await expect.poll(async () => { const v = JSON.stringify(await read()); const same = v === last; last = v; return same; }, { intervals: [150], timeout }).toBe(true);
}
export async function invite(page: Page) {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  const docked = !(await verb.isVisible());
  if (docked) { await page.locator('.drawer-tab').first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top)); }
  await verb.click();
  await expect.poll(() => page.locator('.players-roster .player-row').count()).toBe(1);
  if (docked) { await page.locator('.drawer-tab').first().click(); await expect(page.locator('#controls-drawer .drawer-case')).toBeHidden(); }
}
export async function crowd(page: Page, n: number, tag: string) {
  await page.evaluate(({ n, tag }) => { const room = new URL(location.href).searchParams.get('s')!; const ch = new BroadcastChannel(`board:${room}`); for (let i = 0; i < n; i++) ch.postMessage({ kind: 'hi', data: {}, from: `${tag}-${i}` }); setTimeout(() => ch.close(), 0); }, { n, tag });
  await expect.poll(() => page.locator('.players-roster .player-row').count(), { timeout: 15000 }).toBe(n + 1);
}
export const mark = (page: Page) => page.locator('[data-player-mark]:visible');
export const lobby = (page: Page) => page.locator('[data-lobby]:visible');
export async function cellPage(browser: Browser, w: number, h: number, coarse: boolean, size = 3) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: coarse });
  const page = await ctx.newPage();
  await page.goto(`./?size=${size}&difficulty=EASY&wire=local`);
  await settled(page);
  expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(coarse);
  return { ctx, page };
}
/** open, settle, and read the pose + both budgets' boxes (DEV hook) + lapped counts per box. */
export async function readSheet(page: Page) {
  if ((await mark(page).getAttribute('aria-expanded')) !== 'true') await mark(page).click();
  await expect(lobby(page)).toHaveClass(/is-open/);
  const rd = () => lobby(page).evaluate((el) => {
    const s = el.getBoundingClientRect();
    const cells = [...document.querySelectorAll('.sudoku-cell')].map((c) => c.getBoundingClientRect()).filter((c) => c.width > 0);
    const lap = (b: any) => b ? cells.filter((c) => c.left < b.right && c.right > b.left && c.top < b.bottom && c.bottom > b.top).length : null;
    const area = (a: any, b: any) => a && b ? Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)) : null;
    const f = (window as any).__plrFit ?? null;
    const cw = cells.length ? cells[0].width : 0;
    const r2 = (x: number | null) => (x == null ? null : Math.round(x * 100) / 100);
    return {
      rows: el.querySelectorAll('.pl-row').length, lapped: lap(s), n: cells.length, cell: r2(cw),
      boardL: f ? r2(f.board.left) : null, boardT: f ? r2(f.board.top) : null, rowsStart: f ? r2(f.rowsStart) : null,
      tallB: f ? r2(f.tall.bottom) : null, tallR: f ? r2(f.tall.right) : null, shortB: f?.short ? r2(f.short.bottom) : null,
      tallLap: f ? lap(f.tall) : null, shortLap: f?.short ? lap(f.short) : null,
      tallArea: f ? r2(area(f.tall, f.board)) : null, shortArea: f?.short ? r2(area(f.short, f.board)) : null,
      tallBoxArea: f ? r2(f.tall.width * f.tall.height) : null, shortBoxArea: f?.short ? r2(f.short.width * f.short.height) : null,
      cramped: f?.cramped ?? null,
    };
  });
  await stable(rd);
  return rd();
}
