import { test, expect, type Browser, type Page } from '@playwright/test';
const SOLO = './?size=3&difficulty=EASY&wire=local';
async function settled(page: Page) {
  await page.waitForSelector('svg.handwritten-logo', { timeout: 60000 });
  await expect.poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 60000 }).toBeGreaterThan(0);
}
async function stable(read: () => Promise<unknown>) {
  let last: unknown = Symbol('u');
  await expect.poll(async () => { const v = JSON.stringify(await read()); const s = v === last; last = v; return s; }, { intervals: [150], timeout: 8000 }).toBe(true);
}
const mark = (p: Page) => p.locator('[data-player-mark]:visible');
const lobby = (p: Page) => p.locator('[data-lobby]:visible');
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
async function readSheet(page: Page) {
  return lobby(page).evaluate((el) => {
    const s = el.getBoundingClientRect();
    const cells = [...document.querySelectorAll('.sudoku-cell')].map((c) => c.getBoundingClientRect()).filter((c) => c.width > 0);
    const lapped = cells.filter((c) => c.left < s.right && c.right > s.left && c.top < s.bottom && c.bottom > s.top).length;
    const bl = Math.min(...cells.map((c) => c.left)), bt = Math.min(...cells.map((c) => c.top));
    return { rows: el.querySelectorAll('.pl-row').length, lapped, sheetBottom: +s.bottom.toFixed(1), sheetRight: +s.right.toFixed(1), rowsStart: +(s.left + parseFloat(getComputedStyle(el).paddingLeft)).toFixed(1), cellsLeft: +bl.toFixed(1), cellsTop: +bt.toFixed(1) };
  });
}

// C1 · THE SWEEP ACROSS THE KEY'S SECOND CLAUSE (board.left <= rowsStart), coarse, six peers.
const CELLS = (process.env.CELLS || '700x800,712x800,724x800,736x800,748x800,760x800,768x800,700x1024,736x1024,768x1024,744x1133,820x1180,1024x768,1180x820').split(',');
for (const c of CELLS) {
  test(`C1 sweep ${c}`, async ({ browser }) => {
    const [w, h] = c.split('x').map(Number);
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto(SOLO); await settled(page);
    expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
    await invite(page); await crowd(page, 6, `sw${w}`);
    await mark(page).tap();
    await expect(lobby(page)).toHaveClass(/is-open/);
    await stable(() => readSheet(page));
    const r = await readSheet(page);
    console.log(`SWEEP ${test.info().project.name} ${c} ${JSON.stringify(r)}`);
    await ctx.close();
  });
}

// C2 · THE DEBT THAT IS NEVER FORGIVEN: a tap in WebKit sends no click, so clickOwed stays true;
// the next click that has no press before it (an assistive technology's activation, el.click())
// is swallowed. Expected: every activation toggles once.
test('C2 a click after a tap, with no press between', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(SOLO); await settled(page);
  await mark(page).evaluate((el) => {
    const seen: string[] = [el.getAttribute('aria-expanded')!]; (window as any).__s = seen;
    new MutationObserver(() => { const v = el.getAttribute('aria-expanded')!; if (v !== seen[seen.length - 1]) seen.push(v); }).observe(el, { attributes: true });
    const ev: string[] = []; (window as any).__e = ev;
    for (const t of ['pointerdown', 'pointerup', 'click', 'keydown']) addEventListener(t, (e) => el.contains(e.target as Node) && ev.push(`${t}:${(e as PointerEvent).pointerType ?? '-'}${e.isTrusted ? '' : '(synthetic)'}`), { capture: true });
  });
  const read = () => page.evaluate(() => ({ s: (window as any).__s, e: (window as any).__e }));
  await mark(page).tap();
  await stable(read);
  const afterTap = await read();
  // the tap's click (if any) has had 1.5s to arrive
  await page.waitForTimeout(1500);
  await mark(page).evaluate((el) => (el as HTMLElement).click());
  await stable(read);
  const afterClick = await read();
  await mark(page).evaluate((el) => (el as HTMLElement).click());
  await stable(read);
  const afterClick2 = await read();
  console.log(`DEBT ${test.info().project.name} ${JSON.stringify({ afterTap, afterClick, afterClick2 })}`);
  expect(afterClick.s, 'one programmatic click after a tap toggles once').toEqual(['false', 'true', 'false']);
  await ctx.close();
});

// C3 · THE SCROLL POSE: the head is FIXED, the board scrolls. Open at scroll 0, scroll the page with
// the sheet open, read at rest; then a fresh open at the scrolled pose.
for (const c of (process.env.SCELLS || '390x844,390x800,844x390,812x375,390x664').split(',')) {
  test(`C3 scroll ${c}`, async ({ browser }) => {
    const [w, h] = c.split('x').map(Number);
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto(SOLO); await settled(page);
    await invite(page); await crowd(page, 6, `sc${w}`);
    const room = await page.evaluate(() => ({ sh: document.scrollingElement!.scrollHeight, ih: innerHeight, pos: getComputedStyle(document.querySelector('.corner-left')!).position }));
    await mark(page).tap();
    await expect(lobby(page)).toHaveClass(/is-open/);
    await stable(() => readSheet(page));
    const atOpen = await readSheet(page);
    const dy = Math.min(120, room.sh - room.ih);
    await page.evaluate((dy) => window.scrollTo(0, dy), dy);
    await stable(() => readSheet(page));
    const open = await lobby(page).evaluate((e) => e.classList.contains('is-open'));
    const afterScroll = await readSheet(page);
    await mark(page).tap();
    await expect(mark(page)).toHaveAttribute('aria-expanded', 'false');
    await mark(page).tap();
    await expect(lobby(page)).toHaveClass(/is-open/);
    await stable(() => readSheet(page));
    const fresh = await readSheet(page);
    const sy = await page.evaluate(() => scrollY);
    console.log(`SCROLL ${test.info().project.name} ${c} ${JSON.stringify({ room, dy, sy, atOpen: [atOpen.rows, atOpen.lapped], stillOpen: open, afterScroll: [afterScroll.rows, afterScroll.lapped, afterScroll.cellsTop], fresh: [fresh.rows, fresh.lapped, fresh.cellsTop] })}`);
    await ctx.close();
  });
}

// C4 · THE DESK'S LAP AT REST (the README's 3/4 vs pass 6's 2/3, "settling, not separated").
test('C4 desk lap at rest 1280x800 fine', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(SOLO); await settled(page);
  await invite(page); await crowd(page, 6, 'desk');
  const reads: unknown[] = [];
  for (const wait of [0, 1500, 4000]) {
    await page.waitForTimeout(wait);
    await mark(page).click();
    await expect(lobby(page)).toHaveClass(/is-open/);
    await stable(() => readSheet(page));
    const r = await readSheet(page);
    reads.push([wait, r.rows, r.lapped, r.cellsTop, r.sheetBottom]);
    await page.keyboard.press('Escape');
    await expect(mark(page)).toHaveAttribute('aria-expanded', 'false');
  }
  console.log(`DESK ${test.info().project.name} ${JSON.stringify(reads)}`);
});
