import { test, expect, type BrowserContext, type Page } from '@playwright/test';
const Q = 'difficulty=EASY&wire=local';

/** Two reads 150 ms apart agree — a settled pose, never a fixed window (the leader's helper). */
async function stable(read: () => Promise<unknown>) {
  let last: unknown = Symbol('unread');
  await expect
    .poll(
      async () => {
        const v = JSON.stringify(await read());
        const same = v === last;
        last = v;
        return same;
      },
      { intervals: [150], timeout: 8000 },
    )
    .toBe(true);
}

async function settled(page: Page) {
  await page.waitForSelector('svg.handwritten-logo', { timeout: 60000 });
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

async function invite(page: Page): Promise<string> {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  const docked = !(await verb.isVisible());
  if (docked) {
    await page.locator('.drawer-tab').first().click();
    // the dock SLIDES — its settled pose is the verb's own box holding still
    await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top));
  }
  await verb.click();
  await expect.poll(() => page.locator('.players-roster .player-row').count()).toBe(1);
  if (docked) {
    // Shut the door again: an open dock makes the board inert, and every row here plays on it.
    await page.locator('.drawer-tab').first().click();
    await expect(page.locator('#controls-drawer .drawer-case')).toBeHidden();
  }
  return page.url();
}

/** A table of `n` pages in ONE context (the local wire is a BroadcastChannel, which is scoped to
 *  the context), A first. The rest open the link A's own verb wrote. */
async function table(ctx: BrowserContext, n: number, size = 3): Promise<Page[]> {
  const a = await ctx.newPage();
  await a.goto(`./?size=${size}&${Q}`);
  await settled(a);
  const link = await invite(a);
  const pages = [a];
  for (let i = 1; i < n; i++) {
    const p = await ctx.newPage();
    await p.goto(link);
    await settled(p);
    pages.push(p);
  }
  await a.bringToFront();
  await expect
    .poll(() => a.locator('.players-roster .player-row').count(), { timeout: 20000 })
    .toBe(n);
  return pages;
}

const cell = (p: Page, i: number) => p.locator('.sudoku-cell input').nth(i);
const mark = (p: Page) => p.locator('[data-player-mark]:visible');
const sheet = (p: Page) => p.locator('[data-lobby]:visible');
const dots = (p: Page) =>
  p.evaluate(() =>
    [...document.querySelectorAll('[data-lobby].is-open .chart-dot')].map((d) => ({
      peer: d.getAttribute('data-peer'),
      cx: d.getAttribute('cx'),
      cy: d.getAttribute('cy'),
      opacity: getComputedStyle(d).opacity,
    })),
  );

/** Open by a real press and read past the 150ms fade: the sheet scales 0.9 → 1 on the way in,
 *  so a box read inside the fade is 10% short (a 4×4 chart reads 38.39 there, not 42.67). */
async function openSheet(p: Page) {
  await mark(p).click();
  await expect(sheet(p)).toBeVisible();
  await p.waitForTimeout(400);
}


const sig = (p: Page) => p.evaluate(() => [...document.querySelectorAll<HTMLInputElement>('.sudoku-cell input')].map((i) => i.value || '.').join(''));

// K-GHOST (pass-5 critic): C's FIRST cur since A opened (C not in A's seed, so not in `settled`)
// is pending on A's clock when B deals; the epoch clears A's cur map, the leave loop walks
// `settled` only, and C's surviving timer draws C on a cell of the board that is gone.
for (const seeded of [false, true]) test(`K-GHOST · a deal inside C's first settle window ${seeded ? '(control: C seeded)' : ''}`, async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const [a, b, c] = await table(ctx, 3);
  const deal = b.locator('.controls-card button[aria-label="Deal a new board"]');
  if (seeded) { await c.bringToFront(); await cell(c, 5).click(); }
  await a.bringToFront();
  await openSheet(a);
  if (seeded) await expect.poll(() => dots(a).then((d) => d.length), { timeout: 5000 }).toBe(1);
  else expect((await dots(a)).length, 'nobody placed at the open').toBe(0);
  const before = await sig(a);
  await b.bringToFront();
  await expect(deal).toBeVisible();
  await c.bringToFront();
  const t0 = Date.now();
  await cell(c, 20).click();
  await b.bringToFront();
  await deal.click();
  const tDeal = Date.now() - t0;
  await expect.poll(() => sig(a), { timeout: 10000 }).not.toBe(before);
  const tAdopt = Date.now() - t0;
  // sleep-ok: an absence past C's whole settle window IS the subject; no event marks "no dot".
  await a.waitForTimeout(1500);
  const d = await dots(a);
  const open = await mark(a).getAttribute('aria-expanded');
  info.annotations.push({ type: 'ghost', description: JSON.stringify({ seeded, tDeal, tAdopt, open, dots: d.map((x) => `${x.peer?.slice(0, 6)}@${Number(x.cx).toFixed(1)},${Number(x.cy).toFixed(1)}`) }) });
  expect(open, 'A read an open chart throughout').toBe('true');
  expect(tAdopt, 'the deal landed on A inside C\'s 700 ms window').toBeLessThan(700);
  expect(d, 'no dot for anyone on the new board 1.5 s after the deal').toEqual([]);
  await ctx.close();
});
