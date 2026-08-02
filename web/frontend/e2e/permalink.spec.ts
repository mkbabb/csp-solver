import { test, expect, type Page } from '@playwright/test';
import { encodeSudoku, encodeFutoshiki, encodeUntagged } from './wire';

// Share-on-demand permalink (T2-W6 · item 6). Proves the four load-bearing branches
// of the `?board=` codec + resolver:
//   1. a board-only URL (no ?size=) loads the encoded board (URL wins over storage);
//   2. a length/size mismatch between ?board= and ?size= FAILS CLOSED (never a corrupt board);
//   3. a game switch strips the outgoing game's board/size params (no ~256-char blob rides along);
//   4. Randomize drops ?board= (the shared configuration is stale once a new board is dealt);
//   5. the share affordance writes ?board= on the explicit act;
//   6. an UNTAGGED body fails closed (T5-W2 2.4d — the v0 ratchet is dead).
//
// Selector discipline (session-proven): scope every control query to `.controls-card`.
// A bare aria-label ALSO resolves the hidden mobile panel's twin and the test hangs.

// Encoders live in wire.ts — ONE copy for every spec (T5-W4 pass 8: four hand-rolled
// copies had forked, two of them untagged; the history is written on that module).
// Row 6 asserts the dead v0 arm from the other side via `encodeUntagged`.

function boardParam(page: Page): boolean {
  return new URL(page.url()).searchParams.has('board');
}

// ── 1. Board-only URL loads the encoded board (sudoku) ──────────────────────

test('board-only ?board= URL loads the encoded board (sudoku)', async ({ page }) => {
  // A 9×9 (size 3) board carrying a single sentinel given: cell 0 = 5.
  const enc = encodeSudoku(3, { 0: 5 }, 81);
  await page.goto('./?board=' + enc);
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });

  // The full 9×9 renders from the URL alone — no ?size= needed.
  await expect.poll(() => page.locator('.sudoku-cell').count(), { timeout: 15000 }).toBe(81);
  // The sentinel proves it's the SHARED board, not an auto-randomized one.
  await expect(page.locator('.sudoku-cell input').first()).toHaveValue('5');
});

// ── 2. Length/size mismatch fails closed (sudoku) ───────────────────────────

test('mismatched ?board=/?size= falls closed to the size path (sudoku)', async ({ page }) => {
  // A 4×4 (size 2, 16-cell) board handed a conflicting ?size=3 (81-cell) param.
  const enc = encodeSudoku(2, { 0: 3 }, 16);
  await page.goto('./?size=3&board=' + enc);
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });

  // Fails closed: renders the 81-cell ?size=3 board, NEVER the 16-cell shared blob.
  await expect.poll(() => page.locator('.sudoku-cell').count(), { timeout: 15000 }).toBe(81);
});

// ── 3. Game switch strips foreign board/size params ─────────────────────────

test('game switch leaves no foreign board/size params in the URL', async ({ page }) => {
  const enc = encodeSudoku(3, { 0: 5 }, 81);
  await page.goto('./?board=' + enc);
  await page.waitForSelector('.sudoku-cell', { timeout: 15000 });

  // Switch to Futoshiki via the GALLERY (T4-W12 Wave D — the wordmark opens the carousel).
  // A permalink-restored board is pristine (clearUndo on restore), so the switch is free —
  // no mid-game guard ribbon. The setGame cut still strips the outgoing board/size params.
  await page.locator('button.logo-trigger').click();
  const viewport = page.locator('.gallery-viewport');
  await viewport.waitFor({ state: 'visible', timeout: 15000 });
  await viewport.press('ArrowRight'); // sudoku (centered) → futoshiki
  await viewport.press('Enter'); // select the centered futoshiki card
  await page.waitForSelector('.futoshiki-cell', { timeout: 15000 });

  const params = new URL(page.url()).searchParams;
  expect(params.get('game')).toBe('futoshiki');
  // The sudoku ~256-char board blob and its `?size=` must NOT ride into futoshiki's URL.
  expect(params.has('board')).toBe(false);
  expect(params.has('size')).toBe(false);
  // T4-WU/U2 — futoshiki now owns `?difficulty=` too (the W6 residue closed, crit #10). The game
  // switch strips the outgoing sudoku tier (App.vue) and futoshiki writes its OWN default, so the
  // KEY is present but the foreign value never rides along.
  expect(params.get('difficulty')).toBe('EASY');
});

// ── 4. Randomize drops ?board= (sudoku) ─────────────────────────────────────

test('randomize drops ?board= from the URL (sudoku)', async ({ page }) => {
  const enc = encodeSudoku(3, { 0: 5 }, 81);
  await page.goto('./?board=' + enc);
  await page.waitForSelector('.sudoku-cell', { timeout: 15000 });
  expect(boardParam(page)).toBe(true);

  await page.locator('.controls-card button[aria-label="Deal a new board"]').click();
  // The freshly-dealt board voids the shared permalink.
  await expect.poll(() => boardParam(page), { timeout: 15000 }).toBe(false);
});

// ── 5. The share affordance writes ?board= (sudoku) ─────────────────────────

test('the share affordance writes ?board= on the explicit act (sudoku)', async ({ page }) => {
  await page.goto('./');
  await page.waitForSelector('.sudoku-cell', { timeout: 15000 });
  // Let the auto-dealt board settle so Share has a real board to encode: givens rendered
  // (the settle condition) rather than a fixed delay.
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 15000 })
    .toBeGreaterThan(0);
  expect(boardParam(page)).toBe(false);

  await page.locator('.controls-card button[aria-label="Share board link"]').click();
  await expect.poll(() => boardParam(page), { timeout: 5000 }).toBe(true);
});

// ── 6. Futoshiki: board-only load carries inequalities; randomize drops it ───

test('board-only ?board= loads a futoshiki board with its inequalities, randomize drops it', async ({
  page,
}) => {
  // A 5×5 (25-cell) board: sentinel given cell 0 = 3, plus one printed inequality [1,2].
  const enc = encodeFutoshiki(5, { 0: 3 }, 25, [[1, 2]]);
  await page.goto('./?game=futoshiki&board=' + enc);
  await page.waitForSelector('.futoshiki-cell', { timeout: 15000 });

  await expect.poll(() => page.locator('.futoshiki-cell').count(), { timeout: 15000 }).toBe(25);
  // The shared inequality furniture survives the round-trip — a caret renders.
  await expect(page.locator('.futoshiki-caret').first()).toBeVisible({ timeout: 15000 });
  // The sentinel given proves it's the shared board, not an auto-randomized one.
  await expect(page.locator('.futoshiki-cell input').first()).toHaveValue('3');
  expect(boardParam(page)).toBe(true);

  await page.locator('.controls-card button[aria-label="Deal a new board"]').click();
  await expect.poll(() => boardParam(page), { timeout: 15000 }).toBe(false);
});

// ── 7. An untagged body fails closed — the dead v0 ratchet (T5-W2 2.4d) ─────

test('an untagged ?board= body fails closed, never a board (sudoku)', async ({ page }) => {
  // Byte-for-byte what rows 1–6 used to send, and what the ratchet used to accept: the same
  // 9×9 body carrying the same sentinel given, minus the version byte.
  const enc = encodeUntagged(3, { 0: 5 }, 81);
  await page.goto('./?board=' + enc);
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });

  // A board still renders — the corrupt link degrades to the size/difficulty path, which is
  // what every other fail-closed arm does — but it is NOT the shared one.
  await expect.poll(() => page.locator('.sudoku-cell').count(), { timeout: 15000 }).toBe(81);
  // THE DISCRIMINATOR IS GIVEN-NESS, NOT A DIGIT (T5-W2 finisher row 5). This asserted that
  // cell 0 did not hold `5` — but a fresh deal is nondeterministic and puts a `5` in cell 0
  // roughly one board in nine, so the row could red on a correct build. What separates the two
  // boards structurally is how many cells are GIVEN: the shared body carries exactly one
  // (cell 0), while every dealt 9×9 carries dozens. A count above one is only reachable by a
  // board this link did not describe.
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 15000 })
    .toBeGreaterThan(1);
  // And the stale link is dropped rather than left in the bar claiming to describe the board.
  expect(boardParam(page)).toBe(false);
});

// ── 8. The three newly-real permalinks: thermo, killer, kenken (T5-W2 2.4d, 5/5) ──
//
// These three shipped a Share button over an EMPTY codec: `writeShareUrl` was a no-op,
// `dropBoardParam` was a no-op and `boardLink` was hard-coded 'absent', so the affordance
// promised a link the app could not write and could not read back. One codec serves all five
// now, and what it carries for these three is the clue furniture — a thermometer, a cage —
// which is the half a board alone does not describe.
//
// The round trip is asserted end to end rather than by digits: share, reload the URL the app
// itself wrote, and require the SAME givens back. A dealt board is nondeterministic; a shared
// one is not, and that is the whole claim.

const CLUED = [
  { game: 'thermo', cell: '.sudoku-cell', clue: 'g.thermo-tube' },
  { game: 'killer', cell: '.sudoku-cell', clue: 'g.killer-cage' },
  { game: 'kenken', cell: '.futoshiki-cell', clue: 'g.kenken-cage' },
] as const;

/** The board as the URL must describe it: every cell's value, and how many clue figures. */
async function signature(page: Page, cell: string, clue: string): Promise<string> {
  const values = await page
    .locator(`${cell} input`)
    .evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value).join(','));
  return `${await page.locator(clue).count()}|${values}`;
}

for (const { game, cell, clue } of CLUED) {
  test(`share writes a REAL ?board= and it round-trips the board (${game})`, async ({ page }) => {
    await page.goto(`./?game=${game}`);
    await page.waitForSelector(cell, { timeout: 15000 });
    // Settle on the CLUE, not on givens: a KenKen board is dealt with no given digits at all —
    // its cages are the whole puzzle — so a glyph count would be a deal-luck settle for one of
    // the three and a real one for the other two.
    await expect
      .poll(() => page.locator(clue).count(), { timeout: 20000 })
      .toBeGreaterThan(0);
    expect(boardParam(page)).toBe(false); // never ambient

    await page.locator('.controls-card button[aria-label="Share board link"]').click();
    await expect.poll(() => boardParam(page), { timeout: 5000 }).toBe(true);

    const shared = page.url();
    const before = await signature(page, cell, clue);

    // Reload the link the app itself wrote. It must open, and open the SAME board.
    await page.goto(shared);
    await page.waitForSelector(cell, { timeout: 15000 });
    await expect
      .poll(() => signature(page, cell, clue), { timeout: 20000 })
      .toBe(before);
    // And the link the app just honoured stays in the bar (only a REFUSED one is stripped).
    expect(boardParam(page)).toBe(true);
  });
}
