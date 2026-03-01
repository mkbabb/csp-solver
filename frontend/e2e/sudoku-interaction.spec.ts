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

// ── Test 4: Given Cell Override — Sparkle-Rainbow → User-Ink ────────

test('given cell override: sparkle-rainbow stroke reverts to user-ink on override', async ({ page }) => {
  await loadApp(page);
  await page.waitForTimeout(1500);

  await randomizeBoard(page);

  // Given cells should have sparkle-rainbow stroke
  const sparkleCount = await page.locator('.sudoku-cell .glyph-svg path[stroke="url(#sparkle-rainbow)"]').count();
  expect(sparkleCount).toBeGreaterThan(0);

  // Override the first given cell by programmatically setting a new value
  const givenCellIdx = await page.evaluate(() => {
    const cells = document.querySelectorAll('.sudoku-cell');
    for (let i = 0; i < cells.length; i++) {
      const path = cells[i].querySelector('.glyph-svg path');
      if (path?.getAttribute('stroke') === 'url(#sparkle-rainbow)') return i;
    }
    return -1;
  });
  expect(givenCellIdx).toBeGreaterThanOrEqual(0);

  // Use native value setter + input event to reliably override the cell
  await page.evaluate((idx) => {
    const input = document.querySelectorAll('.sudoku-cell input')[idx] as HTMLInputElement;
    const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
    nativeSetter.call(input, '2');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, givenCellIdx);
  await page.waitForTimeout(500);

  // That cell's glyph should now use user-ink (not sparkle-rainbow)
  const overriddenStroke = await page.locator('.sudoku-cell').nth(givenCellIdx).locator('.glyph-svg path').getAttribute('stroke');
  expect(overriddenStroke).not.toBe('url(#sparkle-rainbow)');
  expect(overriddenStroke).toMatch(/user-ink/);
});

// ── Test 5: Noise Animation — Multiple Unique Reveal Delays ────────

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
