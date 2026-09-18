/**
 * verifier r1 — isolate the FOCUS arm of 3C-4 in the browser.
 *
 * The author's delta arm proves the CSS deletion (a tap paints a tape where it painted 0x0),
 * but chromium's emulated tap synthesises a mouseenter, so `pointedPos` may be what carried it.
 * These four reads separate the arms:
 *   A. tap the peer cell                          -> tape (reproduces the author's number)
 *   B. dispatch mouseleave on it (a device with no hover at all) -> tape must STAND (focus arm)
 *   C. arrow-key onto the peer cell from elsewhere, no pointer at all -> tape must rise
 *   D. arrow-key off the peer cell onto an unauthored cell -> tape must DROP
 *
 * usage: node focus-arm.mjs <baseURL> <engine> <width> <height>
 */
import {
  chromium,
  webkit,
} from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';

const [, , BASE, ENGINE = 'chromium', W = '390', H = '844'] = process.argv;
const ENGINES = { chromium, webkit };
const SOLO = '?size=3&difficulty=EASY&wire=local';
const cellInput = (p, i) => p.locator('.sudoku-cell input').nth(i);

async function settled(page) {
  await page.waitForSelector('svg.handwritten-logo', { timeout: 60000 });
  for (let i = 0; i < 120; i++) {
    if ((await page.locator('.sudoku-cell .glyph-svg').count()) > 0) return;
    await page.waitForTimeout(500);
  }
  throw new Error('board never settled');
}
const values = (p) =>
  p.evaluate(() => [...document.querySelectorAll('.sudoku-cell input')].map((i) => i.value));

async function shutTheSheet(page) {
  const tab = page.locator('.drawer-tab');
  if (!(await tab.count())) return 'no tab';
  if ((await tab.getAttribute('aria-expanded')) === 'true') await tab.tap();
  for (let i = 0; i < 40; i++) {
    if ((await tab.getAttribute('aria-expanded')) === 'false') break;
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(900);
  return await tab.getAttribute('aria-expanded');
}

async function read(page) {
  const tape = page.locator('.attribution-tape');
  const count = await tape.count();
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    const cell = el?.closest?.('.sudoku-cell');
    if (!cell) return null;
    return [...document.querySelectorAll('.sudoku-cell')].indexOf(cell);
  });
  return {
    count,
    text: count ? (await tape.first().innerText()).trim() : '',
    display: count ? await tape.first().evaluate((el) => getComputedStyle(el).display) : '',
    box: count
      ? await page.evaluate(() => {
          const el = document.querySelector('.attribution-tape .washi-label');
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100 };
        })
      : null,
    focusedCell: focused,
  };
}

const browser = await ENGINES[ENGINE].launch();
const ctx = await browser.newContext({
  viewport: { width: Number(W), height: Number(H) },
  hasTouch: true,
  isMobile: ENGINE === 'chromium',
  reducedMotion: 'reduce',
  deviceScaleFactor: 2,
});

const a = await ctx.newPage();
await a.setViewportSize({ width: 1280, height: 800 });
await a.goto(new URL('./' + SOLO, BASE).href);
await settled(a);
const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
await verb.waitFor({ state: 'visible', timeout: 30000 });
for (let i = 0; i < 60 && (await verb.isDisabled()); i++) await a.waitForTimeout(500);
await verb.click();
for (let i = 0; i < 60 && !new URL(a.url()).searchParams.get('s'); i++) await a.waitForTimeout(500);
const link = a.url();

const b = await ctx.newPage();
await b.goto(link);
await settled(b);

const out = {
  engine: ENGINE,
  viewport: `${W}x${H}`,
  pointerCoarse: await b.evaluate(() => matchMedia('(pointer: coarse)').matches),
  hoverNone: await b.evaluate(() => matchMedia('(hover: none)').matches),
};

// the peer writes a digit into an empty cell that is NOT on the first column (so ArrowLeft has room)
const before = await values(a);
let peerCell = before.findIndex((v, i) => !v && i % 9 !== 0);
await cellInput(a, peerCell).click();
await cellInput(a, peerCell).fill('5');
await a.waitForTimeout(900);
out.sheet = await shutTheSheet(b);
out.peerCell = peerCell;

// A — the tap, as the author measured it
await cellInput(b, peerCell).tap();
await b.waitForTimeout(700);
out.A_tap = await read(b);

// B — the synthesised hover is withdrawn; a device that never fires one lands here
out.leaveTarget = await b.evaluate((i) => {
  const el = document.querySelectorAll('.sudoku-cell')[i];
  const cls = el.className;
  el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: false }));
  document.querySelectorAll('.sudoku-cell').forEach((c) => c.dispatchEvent(new MouseEvent('mouseleave', { bubbles: false })));
  return cls;
}, peerCell);
await b.waitForTimeout(400);
out.B_hoverWithdrawn = await read(b);

// D — arrow off the peer cell onto its left neighbour (empty, unauthored)
await b.keyboard.press('ArrowLeft');
await b.waitForTimeout(500);
out.D_arrowOff = await read(b);

// C — arrow back onto the peer cell with no pointer event at all
await b.keyboard.press('ArrowRight');
await b.waitForTimeout(500);
out.C_arrowOn = await read(b);

// E — the realistic touch flow: tape up on a tapped peer cell, then the finger goes to a
// control OUTSIDE the grid. Focus leaves the board; a ghost hover left by the tap would strand
// the tape. Re-tap the peer cell first so the synthesised hover is live again.
await cellInput(b, peerCell).tap();
await b.waitForTimeout(700);
out.E_pre = await read(b);
const tab = b.locator('.drawer-tab');
if (await tab.count()) {
  await tab.tap();
  await b.waitForTimeout(1200);
  out.E_afterControlTap = await read(b);
  out.E_tabExpanded = await tab.getAttribute('aria-expanded');
} else {
  out.E_afterControlTap = 'no drawer tab';
}

console.log(JSON.stringify(out, null, 1));
await browser.close();
