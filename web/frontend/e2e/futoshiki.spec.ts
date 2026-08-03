import { test, expect, type Page } from '@playwright/test';
import { pressCommitted } from './committed-press';

// PRM: live, because the smoke path freezes nothing—it waits on the pose stack's first rendered
//   label and on a solve reaching a terminal state, both of which hold with the beat running.

// First-coverage smoke suite for the Futoshiki scene (previously zero e2e coverage).
// KISS: reach the game via the gallery carousel (T4-W12 Wave D — the wordmark dropdown
// listbox is retired; the wordmark now OPENS THE GALLERY), prove the board renders with its
// inequality furniture, that size switching across N=4..7 changes board dimensions, that a
// blank cell accepts input, and that a solve reaches a terminal UI state.
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

// THE DECK OPENS ON A PRESS, AND WEBKIT CAN DROP THE PRESS (T7-W3 §8, generalized at §9).
//
// Root cause of the wandering row this file carried: a single `.click()` on the wordmark is NOT
// a reliable open. The wordmark's pose stack TEARS OUT the live `<g class="logo-pose">` filter
// stack when its bake lands and puts baked `<image>` siblings in its place; a mouse pair that
// straddles the swap loses the half whose target was destroyed, WebKit synthesizes no `click`,
// and Vue's `@click.stop` never runs. Measured 2/30 unaided on darwin WebKit, 0/25 chromium.
// It is NOT contention (one worker, no neighbour) and NOT the F3 cold-chunk waterfall (the deck
// is a static import; on every red `?view=gallery` was absent and `html.gallery-leaving` never
// appeared, so `enterGallery` had not run — no chunk was ever in the path). The full forensics
// live at `evidence/w3/futoshiki-coldchunk-forensics.txt`; the mechanism and the criterion for
// which presses need this live in `committed-press.ts`.
//
// WHY THIS FILE AND NOT THE OTHERS, originally: `loadApp` waits on `svg.handwritten-logo` — the
// earliest instant the wordmark exists — so these rows press squarely inside the bake window,
// while the specs that first wait out a dealt board spent it. That shield was a timing accident
// rather than a contract, so the guard is now shared and every wordmark press in the estate
// takes it (T7-W3 §9).
async function openDeck(page: Page) {
  const viewport = page.locator('.gallery-viewport');
  await pressCommitted(page.locator('button.logo-trigger'), viewport, {
    what: 'the gallery deck',
  });
  return viewport;
}

// Switch from the default Sudoku scene to Futoshiki via the GALLERY (T4-W12 Wave D): the
// wordmark opens the carousel; the futoshiki card is centered (←/→) then selected (Enter) —
// the listbox-over-carousel contract. A pristine (auto-dealt) sudoku switches freely, so no
// mid-game guard ribbon intervenes. Then wait for the async Futoshiki scene to mount and its
// auto-randomized board to paint its inequality carets.
async function switchToFutoshiki(page: Page) {
  const viewport = await openDeck(page);
  await viewport.press('ArrowRight'); // sudoku (centered) → futoshiki
  // SETTLED, NOT SLEPT — a11y.spec.ts's W3 cure, which this file never inherited. `Enter`
  // selects whatever the deck has COMMITTED, so the precondition is the commit itself: the
  // listbox's own `aria-activedescendant` and the flank's `aria-selected`, both auto-retrying.
  // A press sent into a deck that hasn't committed selects sudoku, and every row here then
  // waits out `.futoshiki-cell` that will never come.
  await expect(viewport).toHaveAttribute('aria-activedescendant', 'gallery-card-1');
  await expect(page.locator('#gallery-card-1')).toHaveAttribute('aria-selected', 'true');
  await viewport.press('Enter'); // select the centered futoshiki card
  // The Futoshiki scene is an async chunk that spins up its own Worker + auto-randomizes.
  await page.waitForSelector('.futoshiki-cell', { timeout: 15000 });
  // Inequality furniture appears once the randomized board resolves off-thread.
  await expect(page.locator('.futoshiki-caret').first()).toBeVisible({ timeout: 15000 });
}

async function cellCount(page: Page): Promise<number> {
  return page.locator('.futoshiki-cell').count();
}

// ── Test 1: Game Switch + Default Board Renders With Inequality Glyphs ──

test('gallery switches to futoshiki: default board renders with inequality carets', async ({
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
