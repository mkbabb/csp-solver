import { test, expect, type Browser, type BrowserContext, type Page } from '@playwright/test';
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

async function coarseTable(browser: Browser, height: number) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 1,
  });
  const pages = await table(ctx, 2);
  for (const p of pages) {
    expect(await p.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
  }
  return { ctx, pages };
}

// K-BELOW (pass-5 critic): the thin-lap cure makes the sheet answer taps. Does it now also take
// taps meant for the board just BELOW its edge (touch adjustment snapping outward)? The board's
// own hit area is an unclaimed surface. Read, per depth below the bottom edge: the cell focused?
test('K-BELOW · taps just under the sheet reach the cell under them', async ({ browser }, info) => {
  test.slow();
  const { ctx, pages } = await coarseTable(browser, 844);
  const [a] = pages;
  await a.bringToFront();
  const out: Record<string, string> = {};
  for (const depth of [1, 2, 3, 4, 6, 10]) {
    await mark(a).tap();
    await expect(sheet(a)).toBeVisible();
    const sh = sheet(a);
    await expect.poll(() => sh.evaluate((e) => getComputedStyle(e).opacity), { timeout: 8000 }).toBe('1');
    await stable(() => sh.evaluate((e) => Math.round(e.getBoundingClientRect().bottom * 10)));
    const g = await sh.evaluate((e, d) => {
      const y = e.getBoundingClientRect().bottom + d;
      const hit = document.elementFromPoint(60, y);
      return { bottom: e.getBoundingClientRect().bottom, y, hit: hit?.closest('.sudoku-cell') ? 'cell' : hit?.closest('[data-lobby]') ? 'sheet' : (hit?.tagName ?? 'none') };
    }, depth);
    await a.touchscreen.tap(60, g.y);
    await expect(mark(a)).toHaveAttribute('aria-expanded', 'false');
    await expect.poll(() => a.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.tagName ?? '')).not.toBe('');
    const active = await a.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.tagName);
    out[`-${depth}px`] = `${g.hit} → ${/^Row \d/.test(active ?? '') ? 'CELL ' + active!.slice(0, 18) : active}`;
    console.log(`BELOW-STEP|${info.project.name}|-${depth}px|${out[`-${depth}px`]}|bottom=${g.bottom.toFixed(2)}`);
    await a.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  }
  info.annotations.push({ type: 'below', description: JSON.stringify(out) });
  console.log(`BELOW|${info.project.name}|${JSON.stringify(out)}`);
  await ctx.close();
});
