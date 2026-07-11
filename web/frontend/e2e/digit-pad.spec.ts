import { test, expect, devices, type Page } from '@playwright/test';

// T3-W11 U-A — the touch cluster probe: the DigitPad (ratified BUILD) + the coarse-
// pointer affordances (UI-4 peek washi/target, UI-5 sublabels + Clear confirm beat).
//
// Touch emulation: a real phone descriptor (isMobile + hasTouch) makes Chromium match
// `(pointer: coarse)` — the exact media the affordances key on — and the stacked
// (<lg) regime, so `padActive` is live end-to-end. The pad writes through the board's
// exposed `enterValue` → the SAME onCellUpdate path as typing, so the "given" probe
// asserts PATH IDENTITY: a pad digit on a given produces exactly the keyboard's
// override transition (given → your entry), never a divergent rule of its own.

test.use({ ...devices['iPhone SE'] }); // 375×667 — the audit's mobile viewport

/** The dev-only FilterTuner toggle (env-gated OUT of prod builds) floats over the
 *  mobile panel at 375 and intercepts taps on the pad's lower row — dev chrome, not
 *  product surface, so the probe hides it. */
async function hideDevChrome(page: Page) {
  await page.addStyleTag({ content: '.tuner-toggle { display: none !important; }' });
}

async function loadSudoku(page: Page, query = '?size=3&difficulty=EASY') {
  await page.goto('./' + query);
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
  await hideDevChrome(page);
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

function cellInput(page: Page, idx: number) {
  return page.locator('.board-cells input').nth(idx);
}

test('digit pad: tap cell → tap digit lands, erase clears, given inherits the keyboard override rule', async ({
  page,
}) => {
  await loadSudoku(page);

  // The device descriptor must land us on the coarse-pointer branch, or every
  // assertion below tests the wrong input class.
  expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);

  // The tray is already on the desk (always-present composition), keys dimmed until
  // a cell is chosen — the hint says so in the hand.
  const pad = page.locator('.digit-pad');
  await expect(pad).toBeVisible();
  await expect(pad.locator('.pad-hint.is-waiting')).toBeVisible();
  await expect(pad.getByRole('button', { name: 'Enter 5' })).toBeDisabled();

  // The pad is the entry surface: cells suppress the OS virtual keyboard
  // (inputmode="none") exactly while the pad is live.
  await expect(cellInput(page, 0)).toHaveAttribute('inputmode', 'none');

  // Tap a blank cell → the keys wake.
  const blank = await firstBlank(page, '.sudoku-cell');
  await cellInput(page, blank).tap();
  await expect(pad.getByRole('button', { name: 'Enter 5' })).toBeEnabled();
  await expect(pad.locator('.pad-hint.is-waiting')).toHaveCount(0);

  // Tap a digit → the value lands in the focused cell (through the board's own path);
  // the pad key's pointerdown.prevent keeps the cell focused, so a second digit
  // overrides in place just like typing.
  await pad.getByRole('button', { name: 'Enter 5' }).tap();
  await expect(cellInput(page, blank)).toHaveValue('5');
  await pad.getByRole('button', { name: 'Enter 3' }).tap();
  await expect(cellInput(page, blank)).toHaveValue('3');

  // Erase clears it.
  await pad.getByRole('button', { name: 'Erase cell' }).tap();
  await expect(cellInput(page, blank)).toHaveValue('');

  // Given-cell rule is INHERITED, not reinvented: the keyboard's semantics for a
  // given is the override transition (given clue → your entry, undoable). Prove the
  // pad produces the identical transition on a given cell. Positional handle, NOT the
  // aria-label query — the override flips the label, and a label-keyed locator would
  // silently re-resolve to the next still-given cell.
  const givenIdx = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('.board-cells input'));
    return inputs.findIndex((i) => i.getAttribute('aria-label')?.includes('given clue'));
  });
  expect(givenIdx).toBeGreaterThanOrEqual(0);
  const givenInput = cellInput(page, givenIdx);
  const givenLabel = (await givenInput.getAttribute('aria-label'))!;
  const givenChar = givenLabel.split(' ').pop()!;
  await givenInput.tap();
  const digit = givenChar === '1' ? '2' : '1';
  await pad.getByRole('button', { name: `Enter ${digit}` }).tap();
  await expect(givenInput).toHaveValue(digit);
  await expect(givenInput).toHaveAttribute('aria-label', /your entry/);
  // ...and the same edit is one Cmd/Ctrl+Z from gone (undo recording rode along).
  // Undo restores the VALUE; the cell stays "overridden" — applyCellValue's documented
  // rule ("undo/redo never writes into a live given"), identical for keyboard entry.
  await page.keyboard.press('Control+z');
  await expect(givenInput).toHaveValue(givenChar);
});

test('digit pad (futoshiki twin): tap cell → tap digit lands', async ({ page }) => {
  await page.goto('./?game=futoshiki');
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
  await hideDevChrome(page);
  await expect
    .poll(() => page.locator('.futoshiki-cell .glyph-svg').count(), { timeout: 15000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(800);

  const pad = page.locator('.digit-pad');
  await expect(pad).toBeVisible();

  const blank = await firstBlank(page, '.futoshiki-cell');
  await cellInput(page, blank).tap();
  await pad.getByRole('button', { name: 'Enter 2' }).tap();
  await expect(cellInput(page, blank)).toHaveValue('2');
  await pad.getByRole('button', { name: 'Erase cell' }).tap();
  await expect(cellInput(page, blank)).toHaveValue('');
});

test('coarse affordances: persistent peek washi on a ≥44px target, icon sublabels, Clear confirm beat', async ({
  page,
}) => {
  await loadSudoku(page);

  // Selector discipline (suite header of affordances.spec.ts): scope to the MOBILE
  // panel — the desktop twin is display:none here but still in the DOM, and a bare
  // query trips strict mode against it.
  const panel = page.locator('.mobile-control-panel');

  // UI-4 — the peek affordance is honest on touch: the washi is laid down at rest
  // (no hover exists here) and the hold surface clears the 44px tap floor.
  const peek = panel.locator('.peek-hold-surface');
  const washi = peek.locator('.washi-label');
  await expect(washi).toBeVisible();
  await expect(washi).toHaveText('hold to peek');
  const box = (await peek.boundingBox())!;
  expect(box.height).toBeGreaterThanOrEqual(44);

  // UI-5 — the four icon actions carry written names on coarse pointers.
  for (const label of ['Randomize', 'Clear', 'Solve', 'Share']) {
    await expect(
      panel.locator('.icon-sublabel', { hasText: label }).first(),
    ).toBeVisible();
  }

  // UI-5 confirm beat — Clear is destructive (board + undo history): first tap arms
  // ("sure?" in rose), the second within the window clears. Board stays intact after
  // the first tap; the givens vanish only after the second.
  const givenCount = await page.locator('.sudoku-cell .glyph-svg').count();
  expect(givenCount).toBeGreaterThan(0);
  // One regex locator matches the button through its arm-rename (Clear board ⇄ Tap
  // again to clear board).
  const clearBtn = panel.getByRole('button', { name: /clear board/i });
  await clearBtn.tap();
  await expect(
    panel.getByRole('button', { name: 'Tap again to clear board' }),
  ).toBeVisible();
  await expect(panel.locator('.icon-sublabel', { hasText: 'sure?' })).toBeVisible();
  expect(await page.locator('.sudoku-cell .glyph-svg').count()).toBe(givenCount); // armed ≠ cleared
  // Confirm inside the 2.5s window. Under parallel-run load the window can lapse
  // between taps (the tap then re-ARMS — by design); the poll re-taps until the
  // arm+confirm pair lands inside one window, which converges in ≤2 rounds.
  await expect
    .poll(
      async () => {
        await clearBtn.tap();
        await page.waitForTimeout(250);
        return page.locator('.sudoku-cell .glyph-svg').count();
      },
      { timeout: 15000 },
    )
    .toBe(0);
});
