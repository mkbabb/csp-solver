import { test, expect, type Page } from '@playwright/test';
import { encodeSudoku } from './wire';

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

// ── 1. Print — CSS-only, computed-style probe ───────────────────────

test('print: chrome hidden, black strokes, washes stripped (CSS-only)', async ({ page }) => {
  await loadSudoku(page);

  await page.emulateMedia({ media: 'print' });
  // The wrapper carries a 500ms box-shadow transition; a computed-style read straight
  // after the media flip catches the mid-transition value. Settle on the terminal print
  // paint — the box-shadow reaches `none` — instead of a fixed delay.
  await expect
    .poll(() => page.locator('.board-wrapper').evaluate((el) => getComputedStyle(el).boxShadow), {
      timeout: 5000,
    })
    .toBe('none');
  const probe = await page.evaluate(() => {
    const d = (sel: string) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el).display : 'MISSING';
    };
    const wrapper = document.querySelector('.board-wrapper')!;
    const ws = getComputedStyle(wrapper);
    const gridLine = document.querySelector('path.grid-line');
    return {
      controls: d('.controls-card'),
      masthead: d('.masthead'),
      margin: d('.board-margin'),
      cornerRight: d('.corner-right'),
      background: ws.backgroundColor,
      boxShadow: ws.boxShadow,
      animation: ws.animationName,
      gridStroke: gridLine ? getComputedStyle(gridLine).stroke : 'MISSING',
    };
  });
  // Chrome hidden
  expect(probe.controls).toBe('none');
  expect(probe.masthead).toBe('none');
  expect(probe.margin).toBe('none');
  expect(probe.cornerRight).toBe('none');
  // Paper goes white, washes/shadows stripped
  expect(probe.background).toBe('rgb(255, 255, 255)');
  expect(probe.boxShadow).toBe('none');
  expect(probe.animation).toBe('none');
  // Glyph/grid strokes go black ink
  expect(probe.gridStroke).toBe('rgb(0, 0, 0)');

  // CSS-only: flipping back restores the screen chrome (no state involved).
  await page.emulateMedia({ media: 'screen' });
  const restored = await page
    .locator('.controls-card')
    .evaluate((el) => getComputedStyle(el).display);
  expect(restored).not.toBe('none');
});

// ── 2. Stale-note — any non-graphite tone clears when the grade reverts ──

test('stale-note: teacher-red and gold-star notes clear on the next edit', async ({ page }) => {
  // Pinned board (no deal luck): row 0 is entirely blank, so the first blank row always
  // holds ≥2 blanks — firstBlank = cell 0, its row-mate blank = cell 1. The old random
  // deal test.skip'd (asserted nothing) when it happened to give <2 blanks in that row.
  await loadSudoku(page, '?board=' + CONFLICT_BOARD);

  // The pinned board carries exactly 72 givens (rows 1–8). `firstBlank` reads "no glyph yet"
  // as blank, so a scan during the draw-in can misread a still-mounting given — the CH-63
  // trigger-1 red (b2 === -1, runner webkit, twice). A settle is polled, never slept: the
  // given census reaches 72 before any blank is derived.
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 15000 })
    .toBe(72);

  // Force a provable conflict in the first blank row across two blank cells, then grade it.
  const b1 = await firstBlank(page, '.sudoku-cell');
  const b2 = await page.evaluate((from) => {
    const cells = document.querySelectorAll('.sudoku-cell');
    const row = Math.floor(from / 9);
    for (let i = from + 1; i < (row + 1) * 9; i++) {
      if (!cells[i].querySelector('.glyph-svg')) return i;
    }
    return -1;
  }, b1);
  // The pinned board guarantees it — a hard assertion now, never a runtime skip.
  expect(b2).toBeGreaterThanOrEqual(0);

  // A value that already appears in neither cell: 9 duplicated in one row is
  // UNSAT regardless of the rest of the deal only if neither cell is a given —
  // both are blanks, so duplicating ANY value in one row is a hard conflict.
  await setCellValue(page, b1, '9');
  await setCellValue(page, b2, '9');
  await page.locator('.controls-card button[aria-label="Solve puzzle"]').click();

  const note = page.locator('.margin-note');
  await expect(note).toHaveClass(/teacher-red/, { timeout: 15000 });
  await expect(note).toContainText(/not quite/, { timeout: 15000 });

  // The next edit reverts the grade to idle — the red note goes stale and clears.
  await setCellValue(page, b2, '');
  await expect(note).not.toContainText(/not quite/, { timeout: 5000 });
  await expect(note).not.toHaveClass(/teacher-red/, { timeout: 5000 });

  // Gold-star path (verify-14's widening): solve to success, then edit — the
  // "solved it!" note goes stale by the SAME path. Clear the other probe digit
  // first: an arbitrary 9 may be globally wrong even without a row conflict.
  await setCellValue(page, b1, '');
  await page.locator('.controls-card button[aria-label="Solve puzzle"]').click();
  await expect(note).toContainText('solved it!', { timeout: 20000 });
  await setCellValue(page, b1, '');
  await expect(note).not.toContainText('solved it!', { timeout: 5000 });
});

// ── 3. The tally — backtracks + elapsed under the voice after a solve ──
// T3-W9 §2: the W6 `.stat-line` twins were deleted; the tally now arrives as
// MarginNote's `meta` line (`.margin-note-meta`, outside the live region) inside
// the completion block. Same lifecycle, new DOM truth.

test('tally: solve writes "N backtracks — Xms" in the note meta; the next edit clears it', async ({
  page,
}) => {
  await loadSudoku(page, '?size=3&difficulty=MEDIUM');

  await expect(page.locator('.margin-note-meta')).toHaveCount(0); // idle → no tally
  await page.locator('.controls-card button[aria-label="Solve puzzle"]').click();

  const stat = page.locator('.margin-note-meta');
  await expect(stat).toBeVisible({ timeout: 20000 });
  await expect(stat).toHaveText(/^\d+ backtracks?( — (\d+ms|\d+\.\d+s))?$/);

  // The tally goes stale with the grade.
  const blank = await page.evaluate(() => {
    const cells = document.querySelectorAll('.sudoku-cell');
    for (let i = 0; i < cells.length; i++) if (!cells[i].querySelector('.glyph-svg')) return i;
    return 0; // solved board: overwrite cell 0 instead
  });
  await setCellValue(page, blank, '1');
  await expect(page.locator('.margin-note-meta')).toHaveCount(0, { timeout: 5000 });
});

// ── 4. Undo — bounded, Ctrl AND Meta gated, plain z never swallowed ──

test('undo: Ctrl+Z reverts, Ctrl+Shift+Z redoes, Meta+Z works, plain z is not swallowed', async ({
  page,
}) => {
  await loadSudoku(page);
  const blank = await firstBlank(page, '.sudoku-cell');

  await cellInput(page, blank).click();
  await page.keyboard.type('5');
  await expect(cellInput(page, blank)).toHaveValue('5');

  await page.keyboard.press('Control+z');
  await expect(cellInput(page, blank)).toHaveValue('');

  await page.keyboard.press('Control+Shift+z');
  await expect(cellInput(page, blank)).toHaveValue('5');

  // The Mac gate (Q7): metaKey must be honored — the original native-undo
  // phantom was reproduced via Cmd+Z; app undo must intercept it.
  await page.keyboard.press('Meta+z');
  await expect(cellInput(page, blank)).toHaveValue('');
  await page.keyboard.press('Meta+Shift+z');
  await expect(cellInput(page, blank)).toHaveValue('5');

  // A plain 'z' is NOT an undo (and the numeric input strips it — no write).
  await page.keyboard.press('z');
  await expect(cellInput(page, blank)).toHaveValue('5');
});

// ── 4b. Fill batch (T4-WU) — one Fill sweep is ONE gesture = ONE undo ──
// The conflict board leaves row 0 entirely blank and uniquely forced (each open cell is a naked
// single off its filled column), so ONE Fill press inks the whole row in one sweep. Born-RED: the
// sweep was app-ink off-log, so Ctrl+Z rewound the action UNDER the fill, never the fill itself.
// After: one undo returns EVERY filled cell to empty in one step; redo re-fills in one step.

test('fill batch: one Fill sweep undoes as ONE gesture, redo re-fills', async ({
  page,
}) => {
  await loadSudoku(page, '?board=' + CONFLICT_BOARD);
  // Same settle as the stale-note row: 72 givens polled before any blank is derived.
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 15000 })
    .toBe(72);
  const anchor = await firstBlank(page, '.sudoku-cell'); // cell 0 — blank on the conflict board

  const filledBefore = await page.locator('.sudoku-cell .glyph-svg').count();
  await page.locator('.controls-card button[aria-label="Fill in the forced cells"]').click();
  // The sweep inks every forced cell (all of the blank row) in one press.
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 20000 })
    .toBeGreaterThan(filledBefore);
  const filledAfter = await page.locator('.sudoku-cell .glyph-svg').count();

  // Focus the board (the desktop undo path is keyboard-only — the coarse Undo hides on fine
  // pointers). ONE Ctrl+Z returns EVERY filled cell to empty — one gesture, one undo.
  await cellInput(page, anchor).click();
  await page.keyboard.press('Control+z');
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 20000 })
    .toBe(filledBefore);

  // Redo re-fills the whole sweep in one step.
  await page.keyboard.press('Control+Shift+z');
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 20000 })
    .toBe(filledAfter);
});

// ── 5. Permalink — the explicit share act round-trips the board ──────

test('permalink: share writes ?board= and a reload reproduces the exact board', async ({
  page,
}) => {
  await loadSudoku(page);
  expect(new URL(page.url()).searchParams.has('board')).toBe(false);

  // Personalize the board so the round-trip is distinguishable from a re-deal.
  const blank = await firstBlank(page, '.sudoku-cell');
  await setCellValue(page, blank, '7');

  await page.locator('.controls-card button[aria-label="Share board link"]').click();
  await expect
    .poll(() => new URL(page.url()).searchParams.has('board'), { timeout: 5000 })
    .toBe(true);

  const before = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.board-cells input'), (i) => (i as HTMLInputElement).value).join(','),
  );

  await page.reload();
  await page.waitForSelector('.sudoku-cell', { timeout: 15000 });
  await expect
    .poll(
      () =>
        page.evaluate(() =>
          Array.from(document.querySelectorAll('.board-cells input'), (i) => (i as HTMLInputElement).value).join(','),
        ),
      { timeout: 15000 },
    )
    .toBe(before);
  // URL wins over storage; the shared param survives the reload.
  expect(new URL(page.url()).searchParams.has('board')).toBe(true);
});

// ── 6. Hint (T4-W7) — two presses: name the technique, THEN ink the digit ──
// The answer-reveal-with-no-name is retired. First H names the cheapest human deduction in
// the margin and lights its becauseCells in the peek-laminate tone; only the SECOND H inks
// the digit through the existing reveal draw-in (born-RED: one press revealed, no name).

test('hint: first H names the technique + highlights, second H inks the digit', async ({ page }) => {
  await loadSudoku(page);
  const blank = await firstBlank(page, '.sudoku-cell');

  await cellInput(page, blank).click();

  // First press — reasoning, not the answer: the margin NAMES the cheapest single and the
  // becauseCells light up. No digit inks yet (the two-press semantics).
  await page.keyboard.press('h');
  await expect(page.locator('.margin-note')).toContainText('single');
  await expect(page.locator('.sudoku-cell.is-because').first()).toBeVisible();

  // Second press — the digit inks in through the reveal draw-in: one more solver-ink glyph.
  const filledBefore = await page.locator('.sudoku-cell .glyph-svg').count();
  await page.keyboard.press('h');
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 20000 })
    .toBe(filledBefore + 1);
  // The highlight lifts once the reasoning is spent (the transaction closed).
  await expect(page.locator('.sudoku-cell.is-because')).toHaveCount(0);
});

// ── 7. Marks gesture — engine-domains marks ride the peek, never ambient ──

test('marks-gesture: no marks pre-peek, K shows them, Esc clears them', async ({ page }) => {
  await loadSudoku(page, '?size=3&difficulty=HARD');

  // Never ambient (the P4 spoiler finding): zero marks before the gesture.
  await expect(page.locator('.board-cells .pencil-marks')).toHaveCount(0);

  await page.keyboard.press('k'); // focus is outside the board — peek toggles on
  await expect
    .poll(() => page.locator('.board-cells .pencil-marks').count(), { timeout: 15000 })
    .toBeGreaterThan(0);

  await page.keyboard.press('Escape'); // release — the marks can never outlive the gesture
  await expect.poll(() => page.locator('.board-cells .pencil-marks').count(), { timeout: 5000 }).toBe(0);
});

// ── 8. THE COMPOSED KEYBOARD SPEC (Q7) — K-peek + roving tabindex + undo,
//        one page session. Cross-handler regressions pass the isolated specs
//        above and fail only here. ──────────────────────────────────────

test('composed keyboard: K-peek from cell focus + roving tabindex (Ctrl+Home/End) + undo in one session', async ({
  page,
}) => {
  await loadSudoku(page);
  const blank = await firstBlank(page, '.sudoku-cell');

  // — Roving tabindex: click seats focus; arrows move it —
  await cellInput(page, blank).click();
  expect(await focusedCellIndex(page)).toBe(blank);
  // Walk toward a neighbour that EXISTS. `blank` is wherever the dig left the first hole, and
  // on the last column ArrowRight is a no-op: the old `right = blank % 9 < 8 ? blank + 1 :
  // blank` asserted that no-op as a pass, then walked ArrowLeft OFF the cell and expected to
  // be back where it started (CI run 30687323601, `Expected: 8  Received: 7` — the dig had put
  // the first hole in column 8). Deterministic in the board, not in the host: it fires for
  // every board whose first blank lands on the right edge, ~1 draw in 9, which is why it read
  // as a one-off. Both directions are the same roving contract, so take the one with room —
  // and the step is now always a REAL move, in and back.
  const rightward = blank % 9 < 8;
  const neighbour = rightward ? blank + 1 : blank - 1;
  await page.keyboard.press(rightward ? 'ArrowRight' : 'ArrowLeft');
  expect(await focusedCellIndex(page)).toBe(neighbour);
  await page.keyboard.press(rightward ? 'ArrowLeft' : 'ArrowRight');
  expect(await focusedCellIndex(page)).toBe(blank);

  // Ctrl+Home / Ctrl+End — board corners.
  await page.keyboard.press('Control+Home');
  expect(await focusedCellIndex(page)).toBe(0);
  await page.keyboard.press('Control+End');
  expect(await focusedCellIndex(page)).toBe(80);

  // — K-peek from a focused board cell (UI-7a): the roving resting state is the normal
  //   place a keyboard player sits, so K MUST toggle the peek there (it can't collide with
  //   digit entry — a cell input reverts non-digits and the handler preventDefaults K).
  //   Release it so the from-outside check below starts from a clean, un-peeked board —
  await page.keyboard.press('k');
  await expect(page.locator('.answer-key-laminate.is-shown')).toHaveCount(1, { timeout: 20000 });
  await expect
    .poll(() => page.locator('.board-cells .pencil-marks').count(), { timeout: 15000 })
    .toBeGreaterThan(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('.answer-key-laminate.is-shown')).toHaveCount(0, { timeout: 5000 });

  // — K-peek from outside the board (pristine deal, so marks render — an
  //   arbitrary user digit could be UNSAT one round deeper, which clears the
  //   marks by design): laminate + marks; Esc releases both —
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.keyboard.press('k');
  await expect(page.locator('.answer-key-laminate.is-shown')).toHaveCount(1, { timeout: 20000 });
  await expect
    .poll(() => page.locator('.board-cells .pencil-marks').count(), { timeout: 15000 })
    .toBeGreaterThan(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('.answer-key-laminate.is-shown')).toHaveCount(0, { timeout: 5000 });
  await expect.poll(() => page.locator('.board-cells .pencil-marks').count(), { timeout: 5000 }).toBe(0);

  // — Write a value (recorded edit) AFTER the peek cycle —
  await cellInput(page, blank).click();
  await page.keyboard.type('5');
  await expect(cellInput(page, blank)).toHaveValue('5');

  // — Undo/redo still function AFTER the peek cycle (cross-handler net) —
  await page.keyboard.press('Control+z');
  await expect(cellInput(page, blank)).toHaveValue('');
  await page.keyboard.press('Control+Shift+z');
  await expect(cellInput(page, blank)).toHaveValue('5');

  // — And the roving tabindex still functions AFTER undo (the Q7 interlock) —
  await page.keyboard.press('Control+Home');
  expect(await focusedCellIndex(page)).toBe(0);
  await page.keyboard.press('Control+End');
  expect(await focusedCellIndex(page)).toBe(80);

  // — K still toggles the peek from cell focus at the end of the session (cross-handler net) —
  await page.keyboard.press('k');
  await expect(page.locator('.answer-key-laminate.is-shown')).toHaveCount(1, { timeout: 20000 });
  await page.keyboard.press('Escape');
  await expect(page.locator('.answer-key-laminate.is-shown')).toHaveCount(0, { timeout: 5000 });
});

// ── 9. The futoshiki composed twin (D16 — both games carry the same
//        three-layer keyboard model) ─────────────────────────────────

test('composed keyboard (futoshiki twin): K-peek from cell focus + roving + undo in one session', async ({
  page,
}) => {
  await page.goto('./?game=futoshiki');
  await page.waitForSelector('.futoshiki-cell', { timeout: 20000 });
  await expect
    .poll(() => page.locator('.futoshiki-cell .glyph-svg').count(), { timeout: 20000 })
    .toBeGreaterThan(0);
  // Grid draw-in → boil steady-state handoff (same HandDrawnGrid as sudoku): the settle,
  // never a fixed sleep.
  // the g stays attached in both baked (display:none) & filtered steady forms.
  await page.waitForSelector('g.boil-frame-layer.is-active', {
    state: 'attached',
    timeout: 20000,
  });

  const n = Math.sqrt(await page.locator('.futoshiki-cell').count());
  const blank = await firstBlank(page, '.futoshiki-cell');

  // Roving tabindex.
  await cellInput(page, blank).click();
  expect(await focusedCellIndex(page)).toBe(blank);
  await page.keyboard.press('Control+Home');
  expect(await focusedCellIndex(page)).toBe(0);
  await page.keyboard.press('Control+End');
  expect(await focusedCellIndex(page)).toBe(n * n - 1);

  // K-peek from a focused board cell (UI-7a) — toggles the peek; release for the next step.
  await page.keyboard.press('k');
  await expect(page.locator('.answer-key-laminate.is-shown')).toHaveCount(1, { timeout: 20000 });
  await page.keyboard.press('Escape');
  await expect(page.locator('.answer-key-laminate.is-shown')).toHaveCount(0, { timeout: 5000 });

  // Peek from outside the board (pristine deal — see the sudoku twin note):
  // laminate + marks; Esc releases.
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.keyboard.press('k');
  await expect(page.locator('.answer-key-laminate.is-shown')).toHaveCount(1, { timeout: 20000 });
  await expect
    .poll(() => page.locator('.board-cells .pencil-marks').count(), { timeout: 15000 })
    .toBeGreaterThan(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('.answer-key-laminate.is-shown')).toHaveCount(0, { timeout: 5000 });

  // Edit + undo + redo, after the peek cycle.
  await cellInput(page, blank).click();
  await page.keyboard.type('1');
  await expect(cellInput(page, blank)).toHaveValue('1');
  await page.keyboard.press('Control+z');
  await expect(cellInput(page, blank)).toHaveValue('');
  await page.keyboard.press('Meta+Shift+z');
  await expect(cellInput(page, blank)).toHaveValue('1');

  // Roving still functions after the whole cycle.
  await page.keyboard.press('Control+Home');
  expect(await focusedCellIndex(page)).toBe(0);
});
