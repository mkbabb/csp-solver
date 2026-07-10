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

/**
 * Steady-state grid DOM shape — the grain hoist (design-union prototype 9).
 *
 * Once draw-in completes ('drawn'), HandDrawnGrid unmounts its transition
 * layer and mounts BOIL_CONFIG.frameCount sibling `g.boil-frame-layer`
 * groups, each a full pre-baked boil variant (1 frame-line + subgrid/cell
 * lines) with grain-static rasterized once per layer. The boil then ticks by
 * toggling which sibling is `.is-active` (opacity 0→1, compositor-only —
 * measured −72.9% RasterTask vs re-rasterizing the filtered group per tick).
 *
 * So mounted-variant multiplicity (frameCount copies of every grid path) IS
 * the designed steady state; the invariant to assert is per-layer shape +
 * exactly one visible variant, never a global element count.
 */
async function steadyGridCounts(page: Page) {
  // `.is-active` only exists on the steady-state layers — waiting for it also
  // proves the transition layer has handed off (draw-in completed).
  await page.waitForSelector('g.boil-frame-layer.is-active', { timeout: 10000 });
  return page.evaluate(() => {
    const layers = Array.from(document.querySelectorAll('g.boil-frame-layer'));
    const visible = layers.filter(
      (l) => parseFloat(getComputedStyle(l).opacity) > 0,
    );
    const active = visible[0] ?? null;
    return {
      layerCount: layers.length,
      visibleLayerCount: visible.length,
      frameLinesPerLayer: layers.map(
        (l) => l.querySelectorAll('path.frame-line').length,
      ),
      activeFrameLines: active ? active.querySelectorAll('path.frame-line').length : 0,
      activeSubgridLines: active
        ? active.querySelectorAll('path.subgrid-line').length
        : 0,
      activeCellLines: active ? active.querySelectorAll('path.cell-line').length : 0,
    };
  });
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
  expect(iconBtnWidth).toBeGreaterThanOrEqual(36);

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

  // Steady-state grid: frameCount pre-baked boil layers, each with the three
  // tiers (frame, subgrid, cell), exactly one visible at a time. A global
  // `path.frame-line` count is frameCount (4), by design — see steadyGridCounts.
  const grid = await steadyGridCounts(page);
  expect(grid.layerCount).toBeGreaterThanOrEqual(2); // boil needs ≥2 variants
  expect(grid.frameLinesPerLayer.every((n) => n === 1)).toBe(true); // one closed frame rect per variant
  expect(grid.visibleLayerCount).toBe(1); // exactly one variant visible
  expect(grid.activeSubgridLines).toBeGreaterThan(0);
  expect(grid.activeCellLines).toBeGreaterThan(0);

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

  // Some cells should be populated (given cells have glyph SVGs with foreground stroke)
  const givenGlyphs = await page.locator('.sudoku-cell .glyph-svg path[stroke="var(--color-foreground)"]').count();
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

  // All counts below are per visible boil variant (steadyGridCounts) — global
  // counts would be frameCount× larger by design (grain hoist, see helper doc).

  // Switch to 4x4 (use desktop sidebar buttons)
  await page.locator('.controls-card button:has-text("4×4")').click();
  await page.waitForTimeout(2000);
  const grid4 = await steadyGridCounts(page);
  // 4x4 with subgridSize=2: vertical non-subgrid lines at cols 1,3 + same horizontal → 4
  expect(grid4.activeCellLines).toBeGreaterThanOrEqual(2);
  expect(grid4.activeFrameLines).toBe(1); // one closed frame rect in the visible variant
  expect(grid4.visibleLayerCount).toBe(1);

  // Switch to 16x16
  await page.locator('.controls-card button:has-text("16×16")').click();
  await page.waitForTimeout(2500);
  const grid16 = await steadyGridCounts(page);
  expect(grid16.activeCellLines).toBeGreaterThan(10); // 16x16 has many cell lines
  expect(grid16.activeSubgridLines).toBeGreaterThan(0);

  // Switch back to 9x9
  await page.locator('.controls-card button:has-text("9×9")').click();
  await page.waitForTimeout(2000);
  const grid9 = await steadyGridCounts(page);
  // 9x9: 6 vertical cell lines + 6 horizontal = 12
  expect(grid9.activeCellLines).toBe(12);
  expect(grid9.activeFrameLines).toBe(1);
  expect(grid9.visibleLayerCount).toBe(1);

  // Screenshot final state
  await page.screenshot({ path: 'e2e/screenshots/round11-9x9.png', fullPage: false });
});
