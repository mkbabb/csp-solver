import { test, expect, type Page } from '@playwright/test';
import { encodeSudoku } from '../e2e/wire';
import { MOTION } from '../src/pencil/config/pencilConfig';

// PRM: live, because the print row asserts the print stylesheet strips animation to `none`—a
//   freeze would hand it that answer for free—and the wrapper's 500ms box-shadow transition is
//   settled on its terminal value here, not abolished.

// T2-W6 affordances — one spec per affordance, plus the composed keyboard spec
// (Q7: cross-handler regressions pass isolated specs and fail only the composed
// one — this suite is the FIRST keyboard codification; 0 keyboard assertions
// existed pre-W6).
//
// Selector discipline (session-proven): scope every control query to
// `.controls-card`. A bare aria-label ALSO resolves the hidden mobile panel's
// twin and the test hangs.

// ── Helpers ─────────────────────────────────────────────────────────

async function loadSudoku(page: Page, query = '?size=3&difficulty=EASY') {
  await page.goto('./' + query);
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
  // Wait for the auto-dealt board (givens render glyphs).
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 15000 })
    .toBeGreaterThan(0);
  // Grid draw-in → boil steady-state handoff: `.is-active` exists only once the grid
  // finished drawing in, so it's the board's settle (generalizes the suite's `.is-active`
  // grid handoff) — the reveal wave rides it. Replaces the fixed reveal-wave sleep.
  // the g stays attached in both baked (display:none) & filtered steady forms.
  await page.waitForSelector('g.boil-frame-layer.is-active', {
    state: 'attached',
    timeout: 15000,
  });
}

// ── Deterministic conflict board (the stale-note test) ──────────────
// A pinned `?board=` that guarantees the first blank row holds ≥2 blanks, so the stale-
// note test never rides deal luck. Rows 1–8 are the canonical solved 9×9 seeded as
// givens; row 0 is left entirely blank → firstBlank = cell 0, its row-mate blank = cell
// 1. Duplicating a value across them is a guaranteed row conflict; the board (only row 0
// open, uniquely forced) still solves trivially for the gold-star half.
//
// Encoded via wire.ts — NOT hand-rolled. This board's first cut re-rolled the wire
// grammar without the version byte (the dead v0 form the W2 ratchet refuses), so every
// load was silently stripped at decode and dealt fresh: the 72-given settle poll below
// went red on the runner with deal-luck censuses (24–35) that read exactly like an
// auto-deal race. The replaceState ledger that settled it lives in the pass-8 record.
// prettier-ignore
const SOLVED_9 = [
  5, 3, 4, 6, 7, 8, 9, 1, 2,
  6, 7, 2, 1, 9, 5, 3, 4, 8,
  1, 9, 8, 3, 4, 2, 5, 6, 7,
  8, 5, 9, 7, 6, 1, 4, 2, 3,
  4, 2, 6, 8, 5, 3, 7, 9, 1,
  7, 1, 3, 9, 2, 4, 8, 5, 6,
  9, 6, 1, 5, 3, 7, 2, 8, 4,
  2, 8, 7, 4, 1, 9, 6, 3, 5,
  3, 4, 5, 2, 8, 6, 1, 7, 9,
];
// Row 0 zeroed (blank), rows 1–8 as their canonical digit.
const CONFLICT_BOARD = encodeSudoku(
  3,
  Object.fromEntries(SOLVED_9.map((v, i) => [i, i < 9 ? 0 : v])),
  81,
);

// ── The PURE-COLUMN conflict board (T9-W1 §1.2) ─────────────────────
// Four cells of the canonical grid are blanked and the row below plants a 5 in two of them:
// cell 0 (row 1, column 1) and cell 36 (row 5, column 1). 5 is column 1's own answer at row 1,
// so it repeats in NO row and NO box — the blanks at 28 (row 4, column 2) and 40 (row 5,
// column 5) are what clear 5 out of row 5 and out of its box. The only thing wrong with the
// finished board is that column 1 holds two fives, which is the whole point: a board with one
// column fault and nothing else is the shape the old derivation reported as a ROW.
// 77 givens; verified unit by unit in the derivation's own terms, never left to deal luck.
const COLUMN_BLANKS = new Set([0, 28, 36, 40]);
const COLUMN_CONFLICT_BOARD = encodeSudoku(
  3,
  Object.fromEntries(SOLVED_9.map((v, i) => [i, COLUMN_BLANKS.has(i) ? 0 : v])),
  81,
);

/** Index of the first blank cell (no glyph). */
async function firstBlank(page: Page, cellSel: string): Promise<number> {
  const idx = await page.evaluate((sel) => {
    const cells = document.querySelectorAll(sel);
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].querySelector('.glyph-svg')) return i;
    }
    return -1;
  }, cellSel);
  expect(idx).toBeGreaterThanOrEqual(0);
  return idx;
}

/** Which cell input currently holds focus (index within the board), or -1. */
function focusedCellIndex(page: Page): Promise<number> {
  return page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('.board-cells input'));
    return inputs.indexOf(document.activeElement as HTMLInputElement);
  });
}

function cellInput(page: Page, idx: number) {
  return page.locator('.board-cells input').nth(idx);
}

/** Set a cell through the app's own input path (native setter + input event). */
async function setCellValue(page: Page, idx: number, val: string) {
  await page.evaluate(
    ([i, v]) => {
      const input = document.querySelectorAll('.board-cells input')[Number(i)] as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
      setter.call(input, v);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    },
    [String(idx), val],
  );
}
type LeaveRecord = {
  el?: Element;
  t0?: number;
  t1?: number;
  transitionDuration?: string;
  animationName?: string;
  animationDuration?: string;
};
const ADV: Record<string, string> = {
  spec: '#app .margin-note-ink { transition: color 1000ms linear !important; }',
  rungOverride: '.margin-note { --motion-whisper: 900ms; }',
  animImportant: '.margin-note-ink.note-leave-active { animation-duration: 900ms !important; }',
};
for (const [name, css] of Object.entries(ADV))
  test(`erasecrit6 adversary ${name}`, async ({ page }, info) => {
    await page.goto(process.env.BASE + '/?board=' + CONFLICT_BOARD);
    await expect.poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 20000 }).toBe(72);
    const js = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s)));
    await page.addStyleTag({ content: css });
    await setCellValue(page, 0, '9');
    await setCellValue(page, 1, '9');
    await page.locator('.controls-card button[aria-label="Solve puzzle"]').click();
    await expect(page.locator('.margin-note')).toHaveClass(/teacher-red/, { timeout: 15000 });
    await expect(page.locator('.margin-note-ink')).toHaveCount(1);
    await page.waitForTimeout(1500);
    await page.evaluate(() => {
      const host = document.querySelector('.margin-note')!;
      const rec: LeaveRecord = {};
      (window as unknown as { __leave: LeaveRecord }).__leave = rec;
      new MutationObserver(() => {
        const el = rec.el ?? host.querySelector('.margin-note-ink.note-leave-active');
        if (el && !rec.el) {
          const cs = getComputedStyle(el);
          Object.assign(rec, { el, t0: performance.now(), transitionDuration: cs.transitionDuration, animationName: cs.animationName, animationDuration: cs.animationDuration });
        }
        if (rec.el && rec.t1 === undefined && !rec.el.isConnected) rec.t1 = performance.now();
      }).observe(host, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
    });
    await setCellValue(page, 1, '');
    const read = () => page.evaluate(() => {
      const r = (window as unknown as { __leave: LeaveRecord }).__leave;
      return r.t1 === undefined || r.t0 === undefined ? null : { ms: +(r.t1 - r.t0).toFixed(1), td: r.transitionDuration, an: r.animationName, ad: r.animationDuration };
    });
    await expect.poll(read, { timeout: 5000 }).not.toBeNull();
    console.log(`ERASECRIT6|${info.project.name}|${process.env.BASE}|${js}|${name}|${JSON.stringify(await read())}`);
  });
