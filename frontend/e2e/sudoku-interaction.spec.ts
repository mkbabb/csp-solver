import { test, expect, type Page } from '@playwright/test';

// ── Helpers ─────────────────────────────────────────────────────────

async function loadApp(page: Page) {
  await page.goto('./');
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
}

async function randomizeBoard(page: Page) {
  await page.locator('.controls-card button[aria-label="Randomize board"]').click();
  // Wait for API response + animation start
  await page.waitForTimeout(2000);
}

async function solveBoard(page: Page) {
  await page.locator('.controls-card button[aria-label="Solve puzzle"]').click();
  // Wait for API response + animation
  await page.waitForTimeout(2000);
}

// ── Test 1: Valid Solution ──────────────────────────────────────────

test('valid solution: randomize → solve → success state + all cells filled', async ({ page }) => {
  await loadApp(page);
  await page.waitForTimeout(1500);

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
  await page.waitForTimeout(1500);

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
  await page.waitForTimeout(500);

  // Solve state should revert (no longer solve-success)
  await expect(board).not.toHaveClass(/solve-success/);
});

// ── Test 3: Consecutive Solve — Values Unchanged ────────────────────

test('consecutive solve: values remain unchanged on second solve', async ({ page }) => {
  await loadApp(page);
  await page.waitForTimeout(1500);

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

// ── Test 4: Given Cells Use Foreground Ink, Solved Cells Use Sparkle-Rainbow ──

test('given cells use foreground ink, solved cells use sparkle-rainbow', async ({ page }) => {
  await loadApp(page);
  await page.waitForTimeout(1500);

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

  // Solver-introduced cells should have sparkle-rainbow stroke
  const sparkleCount = await page.locator('.sudoku-cell .glyph-svg path[stroke="url(#sparkle-rainbow)"]').count();
  expect(sparkleCount).toBeGreaterThan(0);
});

// ── Test 4b: Given Cell Override → User-Ink ─────────────────────────

test('given cell override: foreground stroke reverts to user-ink on override', async ({ page }) => {
  await loadApp(page);
  await page.waitForTimeout(1500);

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
  await page.waitForTimeout(500);

  // That cell's glyph should now use user-ink
  const overriddenStroke = await page.locator('.sudoku-cell').nth(givenCellIdx).locator('.glyph-svg path').getAttribute('stroke');
  expect(overriddenStroke).toMatch(/user-ink/);
});

// ── Test 5b: Solve Failure — Conflicting Values → Failure State ─────

test('solve failure: conflicting user values produce solve-failure state', async ({ page }) => {
  await loadApp(page);
  await page.waitForTimeout(1500);

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
    await page.waitForTimeout(300);

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
  await page.waitForTimeout(1500);

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
