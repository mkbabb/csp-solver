import { test, expect, type Page } from '@playwright/test';

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
  await page.waitForTimeout(800); // reveal wave settles
}

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
  // The wrapper carries `transition-all duration-500`; a computed-style read
  // straight after the media flip sees the mid-transition value. Real print
  // rendering is static — let the emulated transition settle first.
  await page.waitForTimeout(700);
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
  await loadSudoku(page);

  // Force a provable conflict in row 1 of two blank cells, then grade it.
  const b1 = await firstBlank(page, '.sudoku-cell');
  const b2 = await page.evaluate((from) => {
    const cells = document.querySelectorAll('.sudoku-cell');
    const row = Math.floor(from / 9);
    for (let i = from + 1; i < (row + 1) * 9; i++) {
      if (!cells[i].querySelector('.glyph-svg')) return i;
    }
    return -1;
  }, b1);
  test.skip(b2 === -1, 'no two blank cells share the first blank row on this deal');

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

// ── 6. Hint — H fills the focused cell from the peek cache, solver-ink ──

test('hint: H fills the focused blank cell in solver ink', async ({ page }) => {
  await loadSudoku(page);
  const blank = await firstBlank(page, '.sudoku-cell');

  await cellInput(page, blank).click();
  await page.keyboard.press('h');

  // The peek solve is async on first use — poll for the reveal.
  await expect.poll(() => cellInput(page, blank).inputValue(), { timeout: 20000 }).not.toBe('');
  // Solver-ink: the revealed cell renders a glyph like any solver answer.
  await expect(page.locator('.sudoku-cell').nth(blank).locator('.glyph-svg')).toHaveCount(1);
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

test('composed keyboard: K-peek exemption + roving tabindex (Ctrl+Home/End) + undo in one session', async ({
  page,
}) => {
  await loadSudoku(page);
  const blank = await firstBlank(page, '.sudoku-cell');

  // — Roving tabindex: click seats focus; arrows move it —
  await cellInput(page, blank).click();
  expect(await focusedCellIndex(page)).toBe(blank);
  const right = blank % 9 < 8 ? blank + 1 : blank;
  await page.keyboard.press('ArrowRight');
  expect(await focusedCellIndex(page)).toBe(right);
  await page.keyboard.press('ArrowLeft');
  expect(await focusedCellIndex(page)).toBe(blank);

  // Ctrl+Home / Ctrl+End — board corners.
  await page.keyboard.press('Control+Home');
  expect(await focusedCellIndex(page)).toBe(0);
  await page.keyboard.press('Control+End');
  expect(await focusedCellIndex(page)).toBe(80);

  // — K-peek input-exemption: K typed while a board cell holds focus must NOT
  //   toggle the peek (the roving resting state is exactly what the guard blocks) —
  await page.keyboard.press('k');
  await page.waitForTimeout(700);
  await expect(page.locator('.answer-key-laminate.is-shown')).toHaveCount(0);
  await expect(page.locator('.board-cells .pencil-marks')).toHaveCount(0);

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

  // — The exemption still holds at the end of the session —
  await page.keyboard.press('k');
  await page.waitForTimeout(700);
  await expect(page.locator('.answer-key-laminate.is-shown')).toHaveCount(0);
});

// ── 9. The futoshiki composed twin (D16 — both games carry the same
//        three-layer keyboard model) ─────────────────────────────────

test('composed keyboard (futoshiki twin): K-peek exemption + roving + undo in one session', async ({
  page,
}) => {
  await page.goto('./?game=futoshiki');
  await page.waitForSelector('.futoshiki-cell', { timeout: 20000 });
  await expect
    .poll(() => page.locator('.futoshiki-cell .glyph-svg').count(), { timeout: 20000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(800);

  const n = Math.sqrt(await page.locator('.futoshiki-cell').count());
  const blank = await firstBlank(page, '.futoshiki-cell');

  // Roving tabindex.
  await cellInput(page, blank).click();
  expect(await focusedCellIndex(page)).toBe(blank);
  await page.keyboard.press('Control+Home');
  expect(await focusedCellIndex(page)).toBe(0);
  await page.keyboard.press('Control+End');
  expect(await focusedCellIndex(page)).toBe(n * n - 1);

  // K-peek exemption while a cell holds focus.
  await page.keyboard.press('k');
  await page.waitForTimeout(700);
  await expect(page.locator('.answer-key-laminate.is-shown')).toHaveCount(0);

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
