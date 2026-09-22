/**
 * COPY of `evidence/w7/exec/3C-4/probe/coarse-tape-delta.mjs`, re-pointed for T9-W7 pass 3 ·
 * MRK-LIVE · G-LIVE-17. The original is the fold's record and is not re-cut; this copy adds one
 * read — the painted geometry of the tape's label against the painted geometry of tier 2's ring
 * on the SAME focused cell — and prints it beside the original's rows. 16×16 runs from the same
 * entry with `?size=4`.
 *
 * T9-W7 exec 3C-4 — the DELTA arm, on a COARSE pointer, driven through the product's own
 * invite path.
 *
 * ONE context, `?wire=local` (BroadcastChannel is origin-scoped WITHIN a context — the
 * multiplayer suite's mechanism, 3B-1's arm borrowed whole). The context is a touch context
 * (`hasTouch` + `isMobile`), so `(pointer: coarse)` matches and the cure's arm is the one under
 * test; the arm PRINTS that match rather than assuming it.
 *
 * Page A is widened to 1280x800 so the invite verb sits on the card where 3B-1 found it; page B
 * keeps the phone's viewport and is the surface the frames are of. A types a digit; B taps that
 * cell with a finger and the tape must rise. B taps a cell B wrote itself and it must not.
 *
 * usage: node coarse-tape-delta.mjs <baseURL> <label> <framesDir> <engine> <width> <height>
 */
import {
  chromium,
  webkit,
} from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';

const [, , BASE, LABEL, FRAMES, ENGINE = 'chromium', W = '390', H = '844', SIZE = '3'] =
  process.argv;
const ENGINES = { chromium, webkit };
if (!ENGINES[ENGINE]) throw new Error(`unknown engine: ${ENGINE}`);
mkdirSync(FRAMES, { recursive: true });

const SOLO = `?size=${SIZE}&difficulty=EASY&wire=local`;
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

/** The dock sheet SLIDES; shut it and poll the settled pose, never the tween. */
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
for (let i = 0; i < 60 && !new URL(a.url()).searchParams.get('s'); i++)
  await a.waitForTimeout(500);
const link = a.url();

const b = await ctx.newPage();
await b.goto(link);
await settled(b);

const seen = {
  label: LABEL,
  engine: ENGINE,
  viewport: `${W}x${H}`,
  pointerCoarse: await b.evaluate(() => matchMedia('(pointer: coarse)').matches),
  hoverNone: await b.evaluate(() => matchMedia('(hover: none)').matches),
};

// A types into the first empty cell: a peer's own live digit as B sees it. A SECOND digit goes
// into an interior row, because the tape flips below the cell on row 0 and G-LIVE-17 reads both.
const before = await values(a);
const N = Number(SIZE) ** 2;
const peerCell = before.findIndex((v) => !v);
await cellInput(a, peerCell).click();
await cellInput(a, peerCell).fill('5');
await a.waitForTimeout(800);
const peerInterior = before.findIndex((v, i) => !v && i >= N * 2 && i !== peerCell);
if (peerInterior >= 0) {
  await cellInput(a, peerInterior).click();
  await cellInput(a, peerInterior).fill('5');
  await a.waitForTimeout(800);
}

seen.sheet = await shutTheSheet(b);
seen.peerCell = peerCell;

async function tapRead(page, idx, name, shoot) {
  await page.locator('.sudoku-cell input').nth(idx).tap();
  await page.waitForTimeout(700);
  const tape = page.locator('.attribution-tape');
  const count = await tape.count();
  const text = count ? (await tape.first().innerText()).trim() : '';
  const display = count
    ? await tape.first().evaluate((el) => getComputedStyle(el).display)
    : '';
  const painted = count
    ? await page.evaluate(() => {
        const el = document.querySelector('.attribution-tape .washi-label');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          w: Math.round(r.width * 100) / 100,
          h: Math.round(r.height * 100) / 100,
          opacity: getComputedStyle(el).opacity,
          display: getComputedStyle(el).display,
        };
      })
    : null;
  if (shoot) {
    const cell = await page.locator('.sudoku-cell').nth(idx).boundingBox();
    await page.screenshot({
      path: `${FRAMES}/${LABEL}-${name}.png`,
      clip: {
        x: Math.max(0, Math.round(cell.x - cell.width * 1.6)),
        y: Math.max(0, Math.round(cell.y - cell.height * 1.8)),
        width: Math.round(cell.width * 4.2),
        height: Math.round(cell.height * 4.0),
      },
    });
  }
  // G-LIVE-17 (MRK-LIVE, pass 3): the two inks on one cell. The label names who WROTE the
  // digit; tier 2's ring says where YOUR pencil is. They must never share a pixel.
  const collision = await page.evaluate(() => {
    const el = document.activeElement;
    const cell = el?.closest?.('.game-cell');
    const label = document.querySelector('.attribution-tape .washi-label');
    if (!cell || !label) return { cell: !!cell, label: !!label };
    const ghost = cell.querySelector('.cell-ghost-path');
    const gb = ghost?.getBoundingClientRect();
    const cb = cell.getBoundingClientRect();
    const lb = label.getBoundingClientRect();
    const cs = ghost ? getComputedStyle(ghost) : null;
    const tape = document.querySelector('.attribution-tape');
    return {
      cell: true,
      label: true,
      below: !!tape?.classList.contains('is-below'),
      cellTop: +cb.top.toFixed(2),
      cellH: +cb.height.toFixed(2),
      ringOuterTop: gb ? +gb.top.toFixed(2) : null,
      ringAboveCell: gb ? +(cb.top - gb.top).toFixed(2) : null,
      strokeWidth: cs?.strokeWidth ?? null,
      strokeOpacity: cs?.strokeOpacity ?? null,
      labelBottom: +lb.bottom.toFixed(2),
      labelTop: +lb.top.toFixed(2),
      // The air the gate reads: the ring's outer ink minus the label's bottom edge. When the
      // tape flips BELOW (row 0), the pair to read is the ring's bottom against the label's top.
      airAbove: gb ? +(gb.top - lb.bottom).toFixed(2) : null,
      airBelow: gb ? +(lb.top - gb.bottom).toFixed(2) : null,
    };
  });
  // W2 §2.5 as chair §6.1 restated it is a CLASS law about COVERING, read against the tape's
  // own painted `<path>` bbox: the pair above reads the label against the ring on its OWN cell,
  // this reads it against every OTHER interactive box it lies over, and asks the surface who
  // answers a tap at the label's own centre.
  const neighbours = await page.evaluate(() => {
    const label = document.querySelector('.attribution-tape .washi-label');
    if (!label) return null;
    const p = label.querySelector('path') ?? label;
    const lb = p.getBoundingClientRect();
    const own = document.activeElement?.closest?.('[role="gridcell"]') ?? null;
    const cells = [...document.querySelectorAll('[role="gridcell"]')];
    const area = (a, b) =>
      Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
      Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    const hits = cells
      .filter((c) => c !== own)
      .map((c) => +area(lb, c.getBoundingClientRect()).toFixed(2))
      .filter((a) => a > 0);
    const cb = own?.getBoundingClientRect();
    const name = (e) =>
      e ? e.tagName.toLowerCase() + '.' + String(e.className).split(/\s+/)[0] : null;
    return {
      paintedW: +lb.width.toFixed(2),
      paintedH: +lb.height.toFixed(2),
      pointerEvents: getComputedStyle(label).pointerEvents,
      tapePointerEvents: getComputedStyle(
        document.querySelector('.attribution-tape'),
      ).pointerEvents,
      othersCovered: hits.length,
      coveredPx2: +hits.reduce((s, a) => s + a, 0).toFixed(2),
      cellPx2: cb ? +(cb.width * cb.height).toFixed(2) : null,
      cellsWide: cb ? +(lb.width / cb.width).toFixed(2) : null,
      rowsTall: cb ? +(lb.height / cb.height).toFixed(2) : null,
      // The standing trap: `elementFromPoint` is blinded by `inert`, not by pointer-events —
      // this asks who actually answers a finger at the label's own middle.
      answersAtLabelCentre: name(
        document.elementFromPoint(lb.left + lb.width / 2, lb.top + lb.height / 2),
      ),
    };
  });
  return { count, text, display, painted, collision, neighbours };
}

seen.size = `${N}x${N}`;
seen.peerTap = await tapRead(b, peerCell, 'peer-cell-focused', true);
seen.peerInterior = peerInterior;
if (peerInterior >= 0)
  seen.peerInteriorTap = await tapRead(b, peerInterior, 'peer-interior-focused', false);

// B writes its own digit, then taps it: your own hand is never named.
const own = (await values(b)).findIndex((v, i) => !v && i !== peerCell);
await cellInput(b, own).tap();
await cellInput(b, own).fill('7');
await b.waitForTimeout(600);
seen.ownCell = own;
seen.ownTap = await tapRead(b, own, 'own-cell-focused', false);

seen.peerSlug = await b
  .locator('.players-roster .player-row:not(:has(.player-self)) .player-name')
  .first()
  .innerText()
  .catch(() => '');

console.log(JSON.stringify(seen, null, 1));
await browser.close();
