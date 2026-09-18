/**
 * T9-W7 exec 3B-1 — the DELTA arm, driven through the product's own invite path.
 *
 * ONE context, `?wire=local` (BroadcastChannel is origin-scoped WITHIN a context — the
 * multiplayer suite's mechanism, not a convenience). Page A mints the room from the well's
 * verb; page B opens the link A wrote into its own address bar.
 *
 * Then A does two different things to two different cells, and B hovers both:
 *   · A TYPES a digit        → op `solved:0` → B's cell is a peer's live digit  → tape TRUE
 *   · A presses Fill         → op `solved:1` → B's cell is the SOLVER's digit   → tape FALSE
 *
 * usage: node tape-delta.mjs <baseURL> <label> <framesDir> [engine=chromium|webkit]
 *
 * The engine is a parameter because the tape is a rendered surface and one engine is a claim
 * about one engine (repair r1).
 */
import {
  chromium,
  webkit,
} from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';

const [, , BASE, LABEL, FRAMES, ENGINE = 'chromium'] = process.argv;
const ENGINES = { chromium, webkit };
if (!ENGINES[ENGINE]) throw new Error(`unknown engine: ${ENGINE}`);
mkdirSync(FRAMES, { recursive: true });

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
  p.evaluate(() =>
    [...document.querySelectorAll('.sudoku-cell input')].map((i) => i.value),
  );

const browser = await ENGINES[ENGINE].launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  reducedMotion: 'reduce',
});

const a = await ctx.newPage();
await a.goto(new URL('./' + SOLO, BASE).href);
await settled(a);

const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
await verb.waitFor({ state: 'visible', timeout: 30000 });
for (let i = 0; i < 60 && (await verb.isDisabled()); i++) await a.waitForTimeout(500);
await verb.click();
for (let i = 0; i < 60 && !new URL(a.url()).searchParams.get('s'); i++)
  await a.waitForTimeout(500);
const link = a.url();

const b = await ctx.newPage();
await b.goto(link);
await settled(b);

// ── 1. A TYPES into the first empty cell: a peer's own live digit on B.
const before = await values(a);
const liveCell = before.findIndex((v) => !v);
await cellInput(a, liveCell).click();
await cellInput(a, liveCell).fill('5');
await a.waitForTimeout(600);

// ── 2. A presses Fill: the SOLVER writes, stamped to A, carried to B with `solved:1`.
const fill = a.locator(
  '.controls-card button[aria-label="Fill in every cell that has only one possible number"]',
);
await fill.click();
await a.waitForTimeout(1500);
const after = await values(a);
const solvedCell = after.findIndex((v, i) => v && !before[i] && i !== liveCell);

const seen = { label: LABEL, engine: ENGINE, liveCell, solvedCell };

async function hoverRead(page, idx, name) {
  await page.mouse.move(5, 5);
  await page.waitForTimeout(250);
  await page.locator('.sudoku-cell').nth(idx).hover();
  await page.waitForTimeout(600);
  const tape = page.locator('.attribution-tape');
  const count = await tape.count();
  const text = count ? (await tape.first().innerText()).trim() : '';
  // The crop is the hovered cell and the berth the tape hangs in — numbers and text carry the
  // proof, so the frame shows the one square it is about rather than a viewport.
  const cell = await page.locator('.sudoku-cell').nth(idx).boundingBox();
  await page.screenshot({
    path: `${FRAMES}/${LABEL}-${name}.png`,
    clip: {
      x: Math.round(cell.x - cell.width * 1.6),
      y: Math.round(cell.y - cell.height * 1.6),
      width: Math.round(cell.width * 4.2),
      height: Math.round(cell.height * 4.2),
    },
  });
  return { count, text };
}

seen.solvedHover = await hoverRead(b, solvedCell, 'solved-cell');
seen.liveHover = await hoverRead(b, liveCell, 'live-digit');

// The roster's own read of who A is, so the slug in the tape is checkable rather than assumed.
seen.peerSlug = await b
  .locator('.players-roster .player-row:not(:has(.player-self)) .player-name')
  .first()
  .innerText()
  .catch(() => '');

console.log(JSON.stringify(seen, null, 1));
await browser.close();
