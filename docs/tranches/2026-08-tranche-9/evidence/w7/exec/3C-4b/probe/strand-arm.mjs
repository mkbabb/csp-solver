/**
 * T9-W7 exec 3C-4b — READ F: the hover that arrives and never leaves.
 *
 * 3C-4's focus arm (verify-r1/focus-arm.mjs) measures reads A-E and is re-run unmodified
 * beside this one. This arm measures the ONE shape that arm leaves open, the residue booked
 * as G8: a hover-in with NO hover-out, followed by a focus move that fires no pointer event
 * at all (an external keyboard on a phone).
 *
 *   F1. tap peer cell A              -> tape over A
 *   F2. dispatch `mouseenter` on A   -> a live hover that will never be withdrawn
 *   F3. ArrowRight to peer cell B    -> the tape must sit over B, not over A
 *
 * Both cells are peer-authored, so the tape's TEXT is the same slug either way; the reading
 * that separates them is the tape anchor's own x against the two cells' boxes.
 *
 * usage: node strand-arm.mjs <baseURL> <engine> <width> <height> [framePrefix]
 */
import {
  chromium,
  webkit,
} from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';

const [, , BASE, ENGINE = 'chromium', W = '390', H = '844', FRAMES] = process.argv;
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

/**
 * The tape's own anchor is a zero-size box pinned to the top edge of the cell it names, so
 * "which cell is the tape over" is the anchor's x against each cell's box — the slug text
 * cannot tell two cells of the same author apart.
 */
async function read(page) {
  const tape = page.locator('.attribution-tape');
  const count = await tape.count();
  const geom = await page.evaluate(() => {
    const cells = [...document.querySelectorAll('.sudoku-cell')].map((c) => {
      const r = c.getBoundingClientRect();
      return { l: r.left, r: r.right, t: r.top, b: r.bottom };
    });
    const el = document.querySelector('.attribution-tape');
    const label = document.querySelector('.attribution-tape .washi-label');
    const a = el ? el.getBoundingClientRect() : null;
    // The anchor sits ON the cell's top EDGE, which is also the row above's bottom edge, so a
    // containment test on the point alone is ambiguous by one row. The COLUMN is not: the
    // anchor's x is the cell's own horizontal centre band, and A and B are column neighbours.
    const cols = cells.slice(0, 9).map((c, i) => ({ i, l: c.l, r: c.r }));
    const over =
      a === null ? null : cols.findIndex((c) => a.left >= c.l - 1 && a.left <= c.r + 1);
    const act = document.activeElement;
    const cell = act && act.closest ? act.closest('.sudoku-cell') : null;
    return {
      anchorX: a ? Math.round(a.left * 100) / 100 : null,
      anchorY: a ? Math.round(a.top * 100) / 100 : null,
      tapeOverCol: over === -1 ? null : over,
      label: label
        ? {
            w: Math.round(label.getBoundingClientRect().width * 100) / 100,
            h: Math.round(label.getBoundingClientRect().height * 100) / 100,
          }
        : null,
      focusedCell: cell ? [...document.querySelectorAll('.sudoku-cell')].indexOf(cell) : null,
    };
  });
  return {
    count,
    text: count ? (await tape.first().innerText()).trim() : '',
    display: count ? await tape.first().evaluate((el) => getComputedStyle(el).display) : '',
    ...geom,
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
  base: BASE,
  viewport: `${W}x${H}`,
  pointerCoarse: await b.evaluate(() => matchMedia('(pointer: coarse)').matches),
  hoverNone: await b.evaluate(() => matchMedia('(hover: none)').matches),
};

// TWO adjacent empty cells in the same row, both written by the peer: A and B.
const before = await values(a);
let cellA = -1;
for (let i = 0; i < before.length; i++) {
  if (before[i] || i % 9 === 8) continue;
  if (!before[i + 1]) {
    cellA = i;
    break;
  }
}
if (cellA < 0) throw new Error('no adjacent empty pair');
const cellB = cellA + 1;
for (const [i, d] of [
  [cellA, '5'],
  [cellB, '6'],
]) {
  await cellInput(a, i).click();
  await cellInput(a, i).fill(d);
  await a.waitForTimeout(900);
}
out.sheet = await shutTheSheet(b);
out.cellA = cellA;
out.cellB = cellB;

// F1 — the tap that gives focus, and the tape it raises
await cellInput(b, cellA).tap();
await b.waitForTimeout(700);
out.F1_tapA = await read(b);
if (FRAMES) {
  const box = await b.locator('.sudoku-cell').nth(cellA).boundingBox();
  if (box)
    await b.screenshot({
      path: `${FRAMES}-F1.png`,
      clip: {
        x: Math.max(0, box.x - 80),
        y: Math.max(0, box.y - 55),
        width: Math.min(Number(W), box.width + 220),
        height: box.height + 115,
      },
    });
}

// F2 — a hover-in that will never be withdrawn, dispatched on A's root
out.F2_hoverIn = await b.evaluate((i) => {
  const el = document.querySelectorAll('.sudoku-cell')[i];
  el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
  return el.className;
}, cellA);
await b.waitForTimeout(400);
out.F2_afterHoverIn = await read(b);

// F3 — ArrowRight onto B. No pointer event of any kind is fired.
await b.keyboard.press('ArrowRight');
await b.waitForTimeout(600);
out.F3_arrowToB = await read(b);
if (FRAMES) {
  const box = await b.locator('.sudoku-cell').nth(cellB).boundingBox();
  if (box)
    await b.screenshot({
      path: `${FRAMES}-F3.png`,
      clip: {
        x: Math.max(0, box.x - 80),
        y: Math.max(0, box.y - 55),
        width: Math.min(Number(W), box.width + 220),
        height: box.height + 115,
      },
    });
}

out.VERDICT =
  out.F3_arrowToB.tapeOverCol === cellB % 9
    ? `PASS — the tape followed the keyboard to B (column ${cellB % 9})`
    : `STRANDED — tape over column ${out.F3_arrowToB.tapeOverCol} (cell A), focus on cell ${out.F3_arrowToB.focusedCell} (column ${cellB % 9})`;

console.log(JSON.stringify(out, null, 1));
await browser.close();
