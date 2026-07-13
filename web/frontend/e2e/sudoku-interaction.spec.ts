import { test, expect, type Page } from '@playwright/test';

// ── Helpers ─────────────────────────────────────────────────────────

async function loadApp(page: Page) {
  await page.goto('./');
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
  // Initial auto-deal settled: the givens have rendered their glyphs (useSudoku init
  // fires randomize() on mount). Replaces the fixed reveal-wave sleep every caller kept
  // after loadApp — a board on the desk is the real precondition for every act below.
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 15000 })
    .toBeGreaterThan(0);
}

/** The board's value signature — every cell input joined. It flips iff a fresh puzzle is
 *  dealt, so it's the condition the async worker deal handshakes on (never a sleep). */
function boardSignature(page: Page): Promise<string> {
  return page.evaluate(() =>
    Array.from(
      document.querySelectorAll('.sudoku-cell input'),
      (i) => (i as HTMLInputElement).value,
    ).join(','),
  );
}

async function randomizeBoard(page: Page) {
  const before = await boardSignature(page);
  await page.locator('.controls-card button[aria-label="Deal a new board"]').click();
  // Settle on the fresh deal arriving: the worker re-deals async and the value signature
  // flips once the new givens land (randomize updates in place — the grid doesn't redraw,
  // so the board signature, not a grid handoff, is the real settle condition).
  await expect.poll(() => boardSignature(page), { timeout: 15000 }).not.toBe(before);
}

async function solveBoard(page: Page) {
  await page.locator('.controls-card button[aria-label="Solve puzzle"]').click();
  // Settle on the graded terminal state: solve-success | solve-failure lands on the board
  // once the Worker returns (both terminal — the caller asserts the specific verdict).
  await expect(page.locator('.board-wrapper')).toHaveClass(/solve-(success|failure)/, {
    timeout: 20000,
  });
}

// ── Test 1: Valid Solution ──────────────────────────────────────────

test('valid solution: randomize → solve → success state + all cells filled', async ({ page }) => {
  await loadApp(page);

  await randomizeBoard(page);
  await solveBoard(page);

  // Board should have solve-success class
  const board = page.locator('.board-wrapper');
  await expect(board).toHaveClass(/solve-success/);

  // All cells should be filled (no empty cells — every cell has a glyph SVG)
  const totalCells = await page.locator('.sudoku-cell').count();
  const filledCells = await page.locator('.sudoku-cell:has(.glyph-svg)').count();
  expect(filledCells).toBe(totalCells);
});

// ── Test 2: Invalid Solution — Edit After Solve ─────────────────────

test('invalid solution: solve → edit cell → state reverts to idle', async ({ page }) => {
  await loadApp(page);

  await randomizeBoard(page);
  await solveBoard(page);

  // Verify solved state
  const board = page.locator('.board-wrapper');
  await expect(board).toHaveClass(/solve-success/);

  // Override a solved cell by clicking a cell and typing a different value
  // Find the first cell input and change its value
  const firstCell = page.locator('.sudoku-cell input').first();
  await firstCell.click();
  await firstCell.fill('1');

  // Solve state should revert (no longer solve-success). The negative class assertion
  // auto-waits for solveState to fall back to idle on the edit — the settle, no sleep.
  await expect(board).not.toHaveClass(/solve-success/);
});

// ── Test 3: Consecutive Solve — Values Unchanged ────────────────────

test('consecutive solve: values remain unchanged on second solve', async ({ page }) => {
  await loadApp(page);

  await randomizeBoard(page);
  await solveBoard(page);

  // Record all cell values after first solve
  const valuesAfterFirstSolve = await page.evaluate(() => {
    const cells = document.querySelectorAll('.sudoku-cell input');
    return Array.from(cells).map((c) => (c as HTMLInputElement).value);
  });

  // All cells should be filled
  expect(valuesAfterFirstSolve.every((v) => v !== '')).toBe(true);

  // Solve again
  await solveBoard(page);

  // Record values after second solve
  const valuesAfterSecondSolve = await page.evaluate(() => {
    const cells = document.querySelectorAll('.sudoku-cell input');
    return Array.from(cells).map((c) => (c as HTMLInputElement).value);
  });

  // Values should be identical — consecutive solve doesn't change filled cells
  expect(valuesAfterSecondSolve).toEqual(valuesAfterFirstSolve);
});

// ── Test 4: Given Cells Use Foreground Ink, Solved Cells Use Solver-Ink ──
// T3-W9 UI-10: solver digits moved from the chrome #sparkle-rainbow to the
// theme-resolved #solver-ink gradient (light deepens to AA ink pressure, dark
// keeps the pastels). The sparkle icon alone still rides #sparkle-rainbow.

test('given cells use foreground ink, solved cells use solver-ink', async ({ page }) => {
  await loadApp(page);

  await randomizeBoard(page);

  // Given cells should use foreground color (not sparkle-rainbow, not user-ink)
  const givenStrokes = await page.evaluate(() => {
    const paths = document.querySelectorAll('.sudoku-cell .glyph-svg path');
    return Array.from(paths).map((p) => p.getAttribute('stroke'));
  });
  // All given cells should have foreground stroke (var(--color-foreground))
  expect(givenStrokes.length).toBeGreaterThan(0);
  expect(givenStrokes.every((s) => s?.includes('foreground'))).toBe(true);

  // Solve to introduce solver cells
  await solveBoard(page);

  // Solver-introduced cells should have the solver-ink stroke (UI-10, T3-W9)
  const solverInkCount = await page.locator('.sudoku-cell .glyph-svg path[stroke="url(#solver-ink)"]').count();
  expect(solverInkCount).toBeGreaterThan(0);
});

// ── Test 4b: Given Cell Override → User-Ink ─────────────────────────

test('given cell override: foreground stroke reverts to user-ink on override', async ({ page }) => {
  await loadApp(page);

  await randomizeBoard(page);

  // Find first given cell (foreground stroke)
  const givenCellIdx = await page.evaluate(() => {
    const cells = document.querySelectorAll('.sudoku-cell');
    for (let i = 0; i < cells.length; i++) {
      const path = cells[i].querySelector('.glyph-svg path');
      if (path?.getAttribute('stroke')?.includes('foreground')) return i;
    }
    return -1;
  });
  expect(givenCellIdx).toBeGreaterThanOrEqual(0);

  // Override the cell
  await page.evaluate((idx) => {
    const input = document.querySelectorAll('.sudoku-cell input')[idx] as HTMLInputElement;
    const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
    nativeSetter.call(input, '2');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, givenCellIdx);

  // That cell's glyph re-inks to user-ink on the override — poll the stroke attribute
  // until it reflects the re-render (the settle condition), never a fixed sleep.
  await expect
    .poll(
      () =>
        page
          .locator('.sudoku-cell')
          .nth(givenCellIdx)
          .locator('.glyph-svg path')
          .getAttribute('stroke'),
      { timeout: 5000 },
    )
    .toMatch(/user-ink/);
});

// ── Test 5b: Solve Failure — Conflicting Values → Failure State ─────

test('solve failure: conflicting user values produce solve-failure state', async ({ page }) => {
  await loadApp(page);

  await randomizeBoard(page);

  // Override two cells in the same row with the same value to create a conflict
  // Find first row: cells 0..8 for a 9x9 board. Find two empty cells in that row.
  const emptyCells = await page.evaluate(() => {
    const inputs = document.querySelectorAll('.sudoku-cell input');
    const empty: number[] = [];
    // Check first row (cells 0-8)
    for (let i = 0; i < 9; i++) {
      if ((inputs[i] as HTMLInputElement).value === '') empty.push(i);
    }
    return empty;
  });

  if (emptyCells.length >= 2) {
    // Set both empty cells to the same value to guarantee a conflict
    for (const idx of emptyCells.slice(0, 2)) {
      await page.evaluate((i) => {
        const input = document.querySelectorAll('.sudoku-cell input')[i] as HTMLInputElement;
        const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
        nativeSetter.call(input, '1');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }, idx);
    }
    // Both probe cells show their conflicting glyph before we solve — settle on the
    // render (value 1 draws a glyph) rather than a fixed delay.
    for (const idx of emptyCells.slice(0, 2)) {
      await expect(
        page.locator('.sudoku-cell').nth(idx).locator('.glyph-svg'),
      ).toHaveCount(1, { timeout: 5000 });
    }

    // Solve — should fail because of the duplicate
    await solveBoard(page);

    // Board should have solve-failure class (not solve-success)
    const board = page.locator('.board-wrapper');
    await expect(board).toHaveClass(/solve-failure/);
    await expect(board).not.toHaveClass(/solve-success/);
  }
});

// ── Test 6: Noise Animation — Multiple Unique Reveal Delays ────────

test('noise animation: randomize produces multiple unique reveal delays', async ({ page }) => {
  await loadApp(page);

  await randomizeBoard(page);

  // Collect all --reveal-delay values from cells with cell-reveal-animated class
  const delays = await page.evaluate(() => {
    const cells = document.querySelectorAll('.cell-reveal-animated');
    return Array.from(cells).map((c) => {
      return (c as HTMLElement).style.getPropertyValue('--reveal-delay');
    }).filter(Boolean);
  });

  // Should have multiple cells animating
  expect(delays.length).toBeGreaterThan(3);

  // Should have multiple unique delay values (noise-shuffled, not all the same)
  const uniqueDelays = new Set(delays);
  expect(uniqueDelays.size).toBeGreaterThan(1);
});
