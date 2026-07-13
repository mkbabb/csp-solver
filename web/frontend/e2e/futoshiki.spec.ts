import { test, expect, type Page } from '@playwright/test';

// First-coverage smoke suite for the Futoshiki scene (previously zero e2e coverage).
// KISS: reach the game via the wordmark listbox, prove the board renders with its
// inequality furniture, that size switching across N=4..7 changes board dimensions,
// that a blank cell accepts input, and that a solve reaches a terminal UI state.
//
// Selector discipline (session-proven): scope every control query to `.controls-card`.
// A bare aria-label selector ALSO resolves the hidden mobile panel's twin control and the
// test hangs on a non-actionable element — always the desktop sidebar's `.controls-card`.
// NO keyboard-interaction assertions here — a later wave owns the first keyboard spec.

// ── Helpers ─────────────────────────────────────────────────────────

async function loadApp(page: Page) {
  // './' so Playwright resolves relative to baseURL (subpath-deploy safe).
  await page.goto('./');
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
}

// Switch from the default Sudoku scene to Futoshiki via the wordmark-as-game-picker
// (the ARIA listbox on the handwritten logo), then wait for the async Futoshiki scene to
// mount and its auto-randomized board to paint its inequality carets.
async function switchToFutoshiki(page: Page) {
  await page.locator('button.logo-trigger').click();
  await page.getByRole('option', { name: 'futoshiki' }).click();
  // The Futoshiki scene is an async chunk that spins up its own Worker + auto-randomizes.
  await page.waitForSelector('.futoshiki-cell', { timeout: 15000 });
  // Inequality furniture appears once the randomized board resolves off-thread.
  await expect(page.locator('.futoshiki-caret').first()).toBeVisible({ timeout: 15000 });
}

async function cellCount(page: Page): Promise<number> {
  return page.locator('.futoshiki-cell').count();
}

// ── Test 1: Game Switch + Default Board Renders With Inequality Glyphs ──

test('wordmark listbox switches to futoshiki: default board renders with inequality carets', async ({
  page,
}) => {
  await loadApp(page);

  // Sudoku is the default scene.
  await expect(page.locator('.sudoku-cell').first()).toBeVisible({ timeout: 15000 });

  await switchToFutoshiki(page);

  // The wordmark now reads 'futoshiki' and the Sudoku scene is gone.
  // (first pose of the T3-W13 §1-P3 stack — every pose renders the label)
  await expect(
    page.locator('svg.handwritten-logo text.logo-text').first(),
  ).toHaveText('futoshiki');
  await expect(page.locator('.sudoku-cell')).toHaveCount(0);

  // Default board is 5×5 (25 cells) with inequality carets present in the DOM.
  await expect.poll(() => cellCount(page)).toBe(25);
  expect(await page.locator('.futoshiki-caret').count()).toBeGreaterThan(0);

  // Each caret wraps a hand-drawn glyph SVG — the actual inequality mark.
  expect(await page.locator('.futoshiki-caret .glyph-svg').count()).toBeGreaterThan(0);
});

// ── Test 2: Size Switching Across N=4..7 Changes Board Dimensions ────

test('size switching: 4×4/5×5/6×6/7×7 each change the board cell count', async ({ page }) => {
  await loadApp(page);
  await switchToFutoshiki(page);

  const sizes: Array<{ label: string; cells: number }> = [
    { label: '4×4', cells: 16 },
    { label: '6×6', cells: 36 },
    { label: '7×7', cells: 49 },
    { label: '5×5', cells: 25 },
  ];

  for (const { label, cells } of sizes) {
    // Desktop-sidebar selector only — a bare :has-text twin lives in the hidden mobile panel.
    await page.locator(`.controls-card button:has-text("${label}")`).click();
    // T4-WU/U2 arm-not-live: the size chip STAGES the pending board-size; only Deal commits the
    // new dimensions (the live re-deal `watch(boardSize)` was retired — a chip tap wipes nothing).
    await page.locator('.controls-card button[aria-label="Deal a new board"]').click();
    await expect.poll(() => cellCount(page)).toBe(cells);
    // Carets re-render for the new size's freshly-generated board.
    await expect(page.locator('.futoshiki-caret').first()).toBeVisible({ timeout: 15000 });
  }
});

// ── Test 3: Blank Cell Accepts Pointer Input ────────────────────────

test('blank cell accepts input via pointer + on-screen affordance', async ({ page }) => {
  await loadApp(page);
  await switchToFutoshiki(page);

  // Find the first blank cell (no glyph SVG → value 0).
  const firstBlankIdx = await page.evaluate(() => {
    const cells = document.querySelectorAll('.futoshiki-cell');
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].querySelector('.glyph-svg')) return i;
    }
    return -1;
  });
  expect(firstBlankIdx).toBeGreaterThanOrEqual(0);

  const targetCell = page.locator('.futoshiki-cell').nth(firstBlankIdx);

  // Pointer focus the cell (the cell's own click handler focuses its hidden input).
  await targetCell.click();

  // Drive the on-screen affordance exactly as the sudoku spec does: native value setter
  // + a bubbling input event, so Vue's @input handler runs (default 5×5 → '1' is in range).
  await page.evaluate((idx) => {
    const input = document.querySelectorAll('.futoshiki-cell input')[idx] as HTMLInputElement;
    const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
    nativeSetter.call(input, '1');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, firstBlankIdx);

  // The accepted value renders a glyph in that cell.
  await expect(targetCell.locator('.glyph-svg')).toHaveCount(1);
});

// ── Test 4: Solve Reaches A Terminal UI State ───────────────────────

test('solve: a fresh generated board solves to solve-success', async ({ page }) => {
  await loadApp(page);
  await switchToFutoshiki(page);

  const board = page.locator('.board-wrapper');

  // Solve the freshly-generated (solver-authored, uniquely-solvable) board.
  await page.locator('.controls-card button[aria-label="Solve puzzle"]').click();

  // Terminal UI state: the board carries solve-success once the Worker completes.
  await expect(board).toHaveClass(/solve-success/, { timeout: 15000 });

  // Every cell is now filled — no blanks remain after a successful solve.
  const total = await cellCount(page);
  const filled = await page.locator('.futoshiki-cell:has(.glyph-svg)').count();
  expect(filled).toBe(total);
});
