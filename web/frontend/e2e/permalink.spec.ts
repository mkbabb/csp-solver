import { test, expect, type Page } from '@playwright/test';

// Share-on-demand permalink (T2-W6 · item 6). Proves the four load-bearing branches
// of the `?board=` codec + resolver:
//   1. a board-only URL (no ?size=) loads the encoded board (URL wins over storage);
//   2. a length/size mismatch between ?board= and ?size= FAILS CLOSED (never a corrupt board);
//   3. a game switch strips the outgoing game's board/size params (no ~256-char blob rides along);
//   4. Randomize drops ?board= (the shared configuration is stale once a new board is dealt);
//   5. the share affordance writes ?board= on the explicit act.
//
// Selector discipline (session-proven): scope every control query to `.controls-card`.
// A bare aria-label ALSO resolves the hidden mobile panel's twin and the test hangs.

// ── Encoders (byte-identical to the composables' `encodeBoard`) ─────────────
function b64url(s: string): string {
  return Buffer.from(s, 'binary')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
function encodeSudoku(size: number, cells: Record<number, number>, total: number): string {
  let c = '';
  for (let i = 0; i < total; i++) c += (cells[i] ?? 0).toString(36);
  return b64url(`${size}.${c}`);
}
function encodeFutoshiki(
  size: number,
  cells: Record<number, number>,
  total: number,
  ineqs: [number, number][],
): string {
  let c = '';
  for (let i = 0; i < total; i++) c += (cells[i] ?? 0).toString(36);
  const iq = ineqs.map(([a, b]) => `${a}-${b}`).join(',');
  return b64url(`${size}.${c}.${iq}`);
}

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

  // Switch to Futoshiki via the wordmark-as-game-picker.
  await page.locator('button.logo-trigger').click();
  await page.getByRole('option', { name: 'futoshiki' }).click();
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
