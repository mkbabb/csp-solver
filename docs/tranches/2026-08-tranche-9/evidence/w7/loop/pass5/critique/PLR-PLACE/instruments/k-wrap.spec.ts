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

// K-WRAP (pass-5 critic): the height law H = … + 22.4·r assumes ONE line a row. Write the longest
// slugs the dictionaries can deal (straightforward-tyrannosaurus, 29 chars; ~6.6 % of names are
// ≥ 20) into the rendered rows (a text swap, stated: the peer ids are random) and read the sheet.
test('K-WRAP · the longest slugs on a 390 phone', async ({ browser }, info) => {
  test.slow();
  const { ctx, pages } = await coarseTable(browser, 844);
  const [a] = pages;
  await a.bringToFront();
  await mark(a).tap();
  await expect(sheet(a)).toBeVisible();
  const sh = sheet(a);
  await expect.poll(() => sh.evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
  const read = () => sh.evaluate((e) => {
    const r = e.getBoundingClientRect();
    const top = Math.min(...[...document.querySelectorAll('.sudoku-cell')].map((c) => c.getBoundingClientRect().top));
    return { H: +r.height.toFixed(2), W: +r.width.toFixed(2), lap: +Math.max(0, r.bottom - top).toFixed(2), rows: [...e.querySelectorAll('.pl-row')].map((x) => +x.getBoundingClientRect().height.toFixed(2)), names: [...e.querySelectorAll('.pl-name')].map((x) => x.textContent) };
  });
  const before = await read();
  await sh.evaluate((e) => { const n = [...e.querySelectorAll('.pl-name')]; n[0].textContent = 'administrative-hippopotamus'; n[1].textContent = 'straightforward-tyrannosaurus'; });
  await stable(read);
  const after = await read();
  console.log(`WRAP|${info.project.name}|${JSON.stringify({ before, after })}`);
  info.annotations.push({ type: 'wrap', description: JSON.stringify({ before, after }) });
  await ctx.close();
});
