import { test, expect, type Page } from '@playwright/test';

// ── Helpers ─────────────────────────────────────────────────────────

async function loadApp(page: Page) {
  // Use './' so Playwright resolves relative to baseURL (works with subpath deployments).
  await page.goto('./');
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
}

async function setDarkMode(page: Page, dark: boolean) {
  const html = page.locator('html');
  const isDark = await html.evaluate((el) => el.classList.contains('dark'));
  if (isDark !== dark) {
    // Use dispatchEvent to avoid pointer-event interception from overlapping elements
    await page.locator('button.sun-moon-toggle').dispatchEvent('click');
    if (dark) {
      await expect(html).toHaveClass(/dark/, { timeout: 3000 });
    } else {
      await expect(html).not.toHaveClass(/dark/, { timeout: 3000 });
    }
  }
}

// ── Test 1: SVG Filter Registry Completeness ────────────────────────

test('filter registry: all 6 FILTER_PRESETS + sparkle-rainbow exist', async ({
  page,
}) => {
  await loadApp(page);

  const filterIds = [
    'grain-static',
    'wobble-logo',
    'wobble-celestial',
    'wobble-heart',
    'stroke-light',
    'stroke-dark',
  ];

  for (const id of filterIds) {
    await expect(page.locator(`filter#${id}`)).toHaveCount(1);
  }

  await expect(page.locator('linearGradient#sparkle-rainbow')).toHaveCount(1);
});

// ── Test 2: Light Mode — Layout, Styles, Filters, Visual ───────────

test('light mode: layout, styles, filters, visual snapshot', async ({ page }) => {
  await loadApp(page);
  await setDarkMode(page, false);

  // Sun SVG active in light mode
  const sunSvg = page.locator('svg.toggle-sun.is-active');
  await expect(sunSvg).toHaveCount(1);

  // Moon not active in light mode
  const moonActive = page.locator('svg.toggle-moon.is-active');
  await expect(moonActive).toHaveCount(0);

  // Board has cartoon-shadow-md + border
  const board = page.locator('.board-wrapper');
  await expect(board).toHaveClass(/cartoon-shadow-md/);
  const boxShadow = await board.evaluate((el) => getComputedStyle(el).boxShadow);
  expect(boxShadow).not.toBe('none');
  const borderWidth = await board.evaluate((el) => getComputedStyle(el).borderWidth);
  expect(borderWidth).toBe('2px');

  // app-layout aligns items to flex-start
  const alignItems = await page
    .locator('.app-layout')
    .evaluate((el) => getComputedStyle(el).alignItems);
  expect(alignItems).toBe('flex-start');

  // Crayon CSS vars exist on :root
  const crayonVars = await page.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    return {
      green: s.getPropertyValue('--color-crayon-green').trim(),
      orange: s.getPropertyValue('--color-crayon-orange').trim(),
      rose: s.getPropertyValue('--color-crayon-rose').trim(),
      blue: s.getPropertyValue('--color-crayon-blue').trim(),
    };
  });
  expect(crayonVars.green).toBeTruthy();
  expect(crayonVars.orange).toBeTruthy();
  expect(crayonVars.rose).toBeTruthy();
  expect(crayonVars.blue).toBeTruthy();

  // Control panel uses Fraunces font (desktop sidebar)
  const fontFamily = await page
    .locator('.controls-card .control-panel-wrap')
    .evaluate((el) => getComputedStyle(el).fontFamily);
  expect(fontFamily).toMatch(/Fraunces/i);

  // Bigger touch targets
  const iconBtnWidth = await page
    .locator('.icon-btn')
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).width));
  expect(iconBtnWidth).toBeGreaterThanOrEqual(46);

  const ctrlBtnFontSize = await page
    .locator('.ctrl-btn')
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(ctrlBtnFontSize).toBeGreaterThanOrEqual(19);

  // Logo renders with Fraunces font
  const logoText = page.locator('svg.handwritten-logo text.logo-text');
  await expect(logoText).toHaveCount(1);
  await expect(logoText).toHaveText('sudoku');
  const logoFontFamily = await logoText.evaluate((el) => getComputedStyle(el).fontFamily);
  expect(logoFontFamily).toMatch(/Fraunces/i);

  // Irregular sun rays — 20 coordinate pairs (10 rays x outer+inner)
  const outerRayPoints = await page
    .locator('.sun-rays polygon')
    .first()
    .getAttribute('points');
  expect(outerRayPoints).toBeTruthy();
  const pairs = outerRayPoints!.trim().split(/\s+/);
  expect(pairs.length).toBe(20);

  // Controls card has transition
  const transition = await page
    .locator('.controls-card')
    .evaluate((el) => getComputedStyle(el).transition);
  expect(transition).toBeTruthy();

  // Screenshot
  await page.screenshot({ path: 'e2e/screenshots/round11-light.png', fullPage: false });
});

// ── Test 3: Dark Mode — Filter Swap + Visual ────────────────────────

test('dark mode: filter swap, control panel filter, visual snapshot', async ({ page }) => {
  await loadApp(page);
  await setDarkMode(page, true);

  // Moon SVG active in dark mode
  const moonSvg = page.locator('svg.toggle-moon.is-active');
  await expect(moonSvg).toHaveCount(1);

  // Sun not active in dark mode
  const sunInactive = page.locator('svg.toggle-sun.is-active');
  await expect(sunInactive).toHaveCount(0);

  // Control panel filter should reference stroke-dark in dark mode (desktop sidebar)
  const cpFilter = await page
    .locator('.controls-card .control-panel-filtered')
    .evaluate((el) => getComputedStyle(el).filter);
  expect(cpFilter).toMatch(/stroke-dark/);

  // Screenshot
  await page.screenshot({ path: 'e2e/screenshots/round11-dark.png', fullPage: false });
});

// ── Test 4: Grid Draw-In + Path-Based Boil ──────────────────────────

test('grid draw-in completes and path-based boil activates', async ({ page }) => {
  await loadApp(page);

  // Wait for draw-in animation to finish (grid lines ~800ms + stagger)
  await page.waitForTimeout(2000);

  // All grid-line paths should have strokeDasharray=none, strokeDashoffset=0
  const allComplete = await page.evaluate(() => {
    const lines = document.querySelectorAll('path.grid-line');
    if (lines.length === 0) return false;
    return Array.from(lines).every((el) => {
      const s = (el as SVGPathElement).style;
      return (
        (s.strokeDasharray === 'none' || s.strokeDasharray === '') &&
        (s.strokeDashoffset === '0' || s.strokeDashoffset === '' || s.strokeDashoffset === '0px')
      );
    });
  });
  expect(allComplete).toBe(true);

  // Grid lines should exist in three tiers: frame, subgrid, cell
  const frameLines = await page.locator('path.frame-line').count();
  const subgridLines = await page.locator('path.subgrid-line').count();
  const cellLines = await page.locator('path.cell-line').count();
  expect(frameLines).toBe(1);        // one closed frame rect
  expect(subgridLines).toBeGreaterThan(0);
  expect(cellLines).toBeGreaterThan(0);

  // Logo text renders after draw-in
  await expect(page.locator('svg.handwritten-logo text.logo-text')).toHaveText('sudoku');
});

// ── Test 5: Board Interaction — Randomize + Cell Input ──────────────

test('randomize populates board and blank cells accept input', async ({ page }) => {
  await loadApp(page);
  await page.waitForTimeout(1500);

  // Click randomize (desktop sidebar button)
  await page.locator('.controls-card button[aria-label="Randomize board"]').click();
  await page.waitForTimeout(2000);

  // Some cells should be populated (given cells have glyph SVGs with sparkle-rainbow stroke)
  const givenGlyphs = await page.locator('.sudoku-cell .glyph-svg path[stroke="url(#sparkle-rainbow)"]').count();
  expect(givenGlyphs).toBeGreaterThan(0);

  // Find a blank cell and fill it via native value setter + input event
  const firstBlankIdx = await page.evaluate(() => {
    const cells = document.querySelectorAll('.sudoku-cell');
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].querySelector('.glyph-svg')) return i;
    }
    return -1;
  });
  expect(firstBlankIdx).toBeGreaterThanOrEqual(0);

  await page.evaluate((idx) => {
    const input = document.querySelectorAll('.sudoku-cell input')[idx] as HTMLInputElement;
    const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
    nativeSetter.call(input, '5');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, firstBlankIdx);
  await page.waitForTimeout(500);

  // Verify the cell now has a glyph (value was accepted)
  const targetCell = page.locator('.sudoku-cell').nth(firstBlankIdx);
  await expect(targetCell.locator('.glyph-svg')).toHaveCount(1);
});

// ── Test 6: Graceful Degradation Without Backend ────────────────────

test('graceful degradation: UI renders without backend API', async ({ page }) => {
  // Abort all API requests
  await page.route('**/api/**', (route) => route.abort());

  await loadApp(page);

  // Core UI elements render even without backend
  await expect(page.locator('svg.handwritten-logo')).toBeVisible();
  await expect(page.locator('button.sun-moon-toggle')).toBeVisible();
  await expect(page.locator('.board-wrapper')).toBeVisible();
  await expect(page.locator('.controls-card')).toBeVisible();
  await expect(page.locator('filter#grain-static')).toHaveCount(1);
});

// ── Test 7: Size Switching ──────────────────────────────────────────

test('size switching: 4x4, 9x9, 16x16 all render grid lines', async ({ page }) => {
  await loadApp(page);
  await page.waitForTimeout(1500);

  // Switch to 4x4 (use desktop sidebar buttons)
  await page.locator('.controls-card button:has-text("4×4")').click();
  await page.waitForTimeout(2000);
  let cellLines4 = await page.locator('path.cell-line').count();
  // 4x4 with subgridSize=2: vertical non-subgrid lines = 1 (col 2 is subgrid), horizontal = 1 → 2
  expect(cellLines4).toBeGreaterThanOrEqual(2);
  let frameLines4 = await page.locator('path.frame-line').count();
  expect(frameLines4).toBe(1);

  // Switch to 16x16
  await page.locator('.controls-card button:has-text("16×16")').click();
  await page.waitForTimeout(2500);
  let cellLines16 = await page.locator('path.cell-line').count();
  expect(cellLines16).toBeGreaterThan(10); // 16x16 has many cell lines
  let subgridLines16 = await page.locator('path.subgrid-line').count();
  expect(subgridLines16).toBeGreaterThan(0);

  // Switch back to 9x9
  await page.locator('.controls-card button:has-text("9×9")').click();
  await page.waitForTimeout(2000);
  let cellLines9 = await page.locator('path.cell-line').count();
  // 9x9: 6 vertical cell lines + 6 horizontal = 12
  expect(cellLines9).toBe(12);

  // Screenshot final state
  await page.screenshot({ path: 'e2e/screenshots/round11-9x9.png', fullPage: false });
});
