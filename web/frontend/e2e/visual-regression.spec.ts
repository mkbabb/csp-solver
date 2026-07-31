import { test, expect, type Page } from "@playwright/test";

// SVG-filter / theme / grid-boil DOM-contract register for the default (Sudoku) scene.
//
// T4-W2: the WRITE-ONLY screenshot half of this file (three `page.screenshot()` PNGs
// that were never compared — a solid-black board passed green) is RETIRED and re-founded
// as a real capture-compare-review golden system in visual-golden.spec.ts (Playwright
// `toHaveScreenshot` at DPR2, settled, against committed small-crop references at the
// ≥0.98 / 0.983-soul floors).
//
// The pure DOM-contract asserts that never needed a browser have MIGRATED to jsdom units
// (T4-W2 FE-unit layer): the SVG-filter registry → src/pencil/chrome/SvgFilters.test.ts
// (mounts SvgFilters, asserts every preset def + one frozen pose variant per declared pose
// frequency + the sparkle-rainbow/solver-ink gradients), and the dark-mode class-toggle
// mechanism → src/composables/useTheme.test.ts (html gains/loses `.dark`). What STAYS below
// is TRUE integration only — asserts that need a real browser's CSS cascade (crayon vars,
// font-family, box-shadow, computed `filter`), the live pose-stack / grid steady-state
// machinery, and real interaction.

// ── Helpers ─────────────────────────────────────────────────────────

async function loadApp(page: Page) {
  // Use './' so Playwright resolves relative to baseURL (works with subpath deployments).
  await page.goto("./");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 15000 });
}

async function setDarkMode(page: Page, dark: boolean) {
  const html = page.locator("html");
  const isDark = await html.evaluate((el) => el.classList.contains("dark"));
  if (isDark !== dark) {
    // Use dispatchEvent to avoid pointer-event interception from overlapping elements
    await page.locator("button.sun-moon-toggle").dispatchEvent("click");
    if (dark) {
      await expect(html).toHaveClass(/dark/, { timeout: 3000 });
    } else {
      await expect(html).not.toHaveClass(/dark/, { timeout: 3000 });
    }
  }
}

/**
 * Steady-state grid DOM shape — the T4-W1 bitmap pose cache.
 *
 * Once draw-in completes ('drawn'), HandDrawnGrid mounts BOIL_CONFIG.frameCount sibling
 * boil layers and ticks by toggling which one is `.is-active` (opacity 0→1,
 * compositor-only). W1 replaced the resident grain-static filtered groups
 * (`g.boil-frame-layer`) with baked `image.boil-frame-bitmap` siblings — each pose is
 * captured to a bitmap ONCE and no filter re-executes at steady state (the WebKit cure).
 * The live-filter groups remain as the during-bake fallback, so steady state is the
 * bitmap stack once the async bake resolves, or the filter fallback while it is in flight.
 *
 * The invariant to assert is the boil-stack shape (≥2 layers, exactly one visible) — a
 * global element count is meaningless (frameCount copies by design). The per-tier
 * geometry (frame/subgrid/cell line counts) only lives in the filter fallback; once baked
 * the geometry is pixels, and its π/DELTA soul golden lives in visual-golden.spec.ts.
 */
async function steadyGridCounts(page: Page) {
  // Either steady form has exactly one `.is-active` layer — waiting for it also proves the
  // transition layer has handed off (draw-in completed).
  await page.waitForSelector(
    "image.boil-frame-bitmap.is-active, g.boil-frame-layer.is-active",
    { timeout: 10000 },
  );
  return page.evaluate(() => {
    const baked = Array.from(document.querySelectorAll("image.boil-frame-bitmap"));
    const filtered = Array.from(document.querySelectorAll("g.boil-frame-layer"));
    const layers = baked.length ? baked : filtered;
    const visible = layers.filter((l) => parseFloat(getComputedStyle(l).opacity) > 0);
    // Per-tier path counts only exist in the live-filter fallback; once baked they are 0
    // (the geometry is pixels — asserted by the visual-golden soul golden).
    const active =
      filtered.find((l) => parseFloat(getComputedStyle(l).opacity) > 0) ?? null;
    return {
      mode: baked.length ? "baked" : "filtered",
      layerCount: layers.length,
      visibleLayerCount: visible.length,
      activeFrameLines: active ? active.querySelectorAll("path.frame-line").length : 0,
      activeSubgridLines: active
        ? active.querySelectorAll("path.subgrid-line").length
        : 0,
      activeCellLines: active ? active.querySelectorAll("path.cell-line").length : 0,
    };
  });
}

// (Test 1 — the SVG filter-registry completeness check — MIGRATED to the jsdom unit
// src/pencil/chrome/SvgFilters.test.ts. It was a pure existence contract on SvgFilters'
// rendered defs, needing no live app; the unit mounts the same component and asserts every
// preset + pose variant + gradient. Test 6 below still proves grain-static is wired into the
// running app. The app-integration asserts that DO need a browser continue below.)

// ── Test 2: Light Mode — Layout, Styles, Filters ───────────────────

test("light mode: layout, styles, filters, DOM contract", async ({ page }) => {
  await loadApp(page);
  await setDarkMode(page, false);

  // Sun SVG active in light mode
  const sunSvg = page.locator("svg.toggle-sun.is-active");
  await expect(sunSvg).toHaveCount(1);

  // Moon not active in light mode
  const moonActive = page.locator("svg.toggle-moon.is-active");
  await expect(moonActive).toHaveCount(0);

  // Board has cartoon-shadow-md + border
  const board = page.locator(".board-wrapper");
  await expect(board).toHaveClass(/cartoon-shadow-md/);
  const boxShadow = await board.evaluate((el) => getComputedStyle(el).boxShadow);
  expect(boxShadow).not.toBe("none");
  const borderWidth = await board.evaluate((el) => getComputedStyle(el).borderWidth);
  expect(borderWidth).toBe("2px");

  // app-layout aligns items to center at >=md (H8-centering-only, T2-W5)
  const alignItems = await page
    .locator(".app-layout")
    .evaluate((el) => getComputedStyle(el).alignItems);
  expect(alignItems).toBe("center");

  // Crayon CSS vars exist on :root
  const crayonVars = await page.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    return {
      green: s.getPropertyValue("--color-crayon-green").trim(),
      orange: s.getPropertyValue("--color-crayon-orange").trim(),
      rose: s.getPropertyValue("--color-crayon-rose").trim(),
      blue: s.getPropertyValue("--color-crayon-blue").trim(),
    };
  });
  expect(crayonVars.green).toBeTruthy();
  expect(crayonVars.orange).toBeTruthy();
  expect(crayonVars.rose).toBeTruthy();
  expect(crayonVars.blue).toBeTruthy();

  // Control panel uses Fraunces font (desktop sidebar)
  const fontFamily = await page
    .locator(".controls-card .control-panel-wrap")
    .evaluate((el) => getComputedStyle(el).fontFamily);
  expect(fontFamily).toMatch(/Fraunces/i);

  // Bigger touch targets
  const iconBtnWidth = await page
    .locator(".icon-btn")
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).width));
  expect(iconBtnWidth).toBeGreaterThanOrEqual(36);

  const ctrlBtnFontSize = await page
    .locator(".ctrl-btn")
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(ctrlBtnFontSize).toBeGreaterThanOrEqual(19);

  // Logo renders with Fraunces font. T4-W1: the wordmark is a 4-pose stack baked to
  // bitmaps (image.logo-pose-bmp, opacity-swapped) with the live filter stack as the
  // during-bake fallback; the measuring text.logo-text (Fraunces, invisible) sizes the
  // variable-width box and survives the bake. Exactly one pose layer is active at a time.
  const logoMeasure = page.locator("svg.handwritten-logo text.logo-text.logo-measure");
  await expect(logoMeasure).toHaveText("sudoku");
  const logoFontFamily = await logoMeasure.evaluate(
    (el) => getComputedStyle(el).fontFamily,
  );
  expect(logoFontFamily).toMatch(/Fraunces/i);
  // The pose stack is frameCount layers (baked bitmaps once ready, filtered groups while
  // baking) with exactly one active.
  await expect(
    page.locator(
      "svg.handwritten-logo image.logo-pose-bmp, svg.handwritten-logo g.logo-pose",
    ),
  ).toHaveCount(4);
  await expect(
    page.locator(
      "svg.handwritten-logo image.logo-pose-bmp.is-active, svg.handwritten-logo g.logo-pose.is-active",
    ),
  ).toHaveCount(1);

  // The rendered-pixel assertion for this surface lives in visual-golden.spec.ts
  // (`logo-light`, the ≥0.983 baked-pose-stack soul golden). This test owns the DOM
  // contract only.

  // Irregular sun rays — 20 coordinate pairs (10 rays x outer+inner)
  const outerRayPoints = await page
    .locator(".sun-rays polygon")
    .first()
    .getAttribute("points");
  expect(outerRayPoints).toBeTruthy();
  const pairs = outerRayPoints!.trim().split(/\s+/);
  expect(pairs.length).toBe(20);

  // Controls card has transition
  const transition = await page
    .locator(".controls-card")
    .evaluate((el) => getComputedStyle(el).transition);
  expect(transition).toBeTruthy();

  // (Rendered-pixel capture retired to visual-golden.spec.ts — see file header.)
});

// ── Test 3: Dark Mode — the celestial swap + the panel's DOM contract ───────

test("dark mode: celestial swap, control panel carries no filter, DOM contract", async ({
  page,
}) => {
  await loadApp(page);
  await setDarkMode(page, true);

  // Moon SVG active in dark mode
  const moonSvg = page.locator("svg.toggle-moon.is-active");
  await expect(moonSvg).toHaveCount(1);

  // Sun not active in dark mode
  const sunInactive = page.locator("svg.toggle-sun.is-active");
  await expect(sunInactive).toHaveCount(0);

  // P1-W3: the panel's theme-swapped `url(#stroke-dark)` / `-light` reference filter is
  // DELETED (G2.4 ruled **C**) — a 3-pass 4-octave turbulence chain on an HTML box, WebKit's
  // software filter path. This assertion is inverted rather than removed: the element is still
  // the structural grouping hook, and it must now carry no paint of its own. The population of
  // record is `src/pencil/config/filterBudget.ts`, enforced by `e2e/filter-census.spec.ts`
  // against the built dist; this line is the cheap local guard in the theme test that used to
  // assert the opposite.
  const cpFilter = await page
    .locator(".controls-card .control-panel-filtered")
    .evaluate((el) => getComputedStyle(el).filter);
  expect(cpFilter).toBe("none");

  // (Rendered-pixel capture retired to visual-golden.spec.ts — the `toggle-crest-dark`
  // soul golden asserts the dark-mode crest pixels.)
});

// ── Test 4: Grid Draw-In + Path-Based Boil ──────────────────────────

test("grid draw-in completes and path-based boil activates", async ({ page }) => {
  await loadApp(page);

  // Draw-in complete = the grid handed off to its boil steady-state layers (`.is-active`
  // exists only then — baked bitmap or the live-filter fallback). The settle, not a sleep.
  await page.waitForSelector(
    "image.boil-frame-bitmap.is-active, g.boil-frame-layer.is-active",
    { timeout: 15000 },
  );

  // Any remaining grid-line paths (the transition layer, or the live-filter fallback
  // while the bake is in flight) should have settled: strokeDasharray=none,
  // strokeDashoffset=0. Once the steady bitmaps are baked there are no paths — that IS
  // the completed state (the transition layer has handed off), so 0 paths passes.
  const allComplete = await page.evaluate(() => {
    const lines = document.querySelectorAll("path.grid-line");
    if (lines.length === 0) return true;
    return Array.from(lines).every((el) => {
      const s = (el as SVGPathElement).style;
      return (
        (s.strokeDasharray === "none" || s.strokeDasharray === "") &&
        (s.strokeDashoffset === "0" ||
          s.strokeDashoffset === "" ||
          s.strokeDashoffset === "0px")
      );
    });
  });
  expect(allComplete).toBe(true);

  // Steady-state grid: frameCount boil layers (baked bitmaps once ready, filter fallback
  // while baking), exactly one visible at a time. The per-tier geometry is baked into the
  // pixels (asserted by visual-golden's grid soul golden); the filter fallback still
  // carries the tiers when it holds the surface.
  const grid = await steadyGridCounts(page);
  expect(grid.layerCount).toBeGreaterThanOrEqual(2); // boil needs ≥2 variants
  expect(grid.visibleLayerCount).toBe(1); // exactly one variant visible
  if (grid.mode === "filtered") {
    expect(grid.activeFrameLines).toBe(1);
    expect(grid.activeSubgridLines).toBeGreaterThan(0);
    expect(grid.activeCellLines).toBeGreaterThan(0);
  }

  // Logo text renders after draw-in (first pose of the T3-W13 stack)
  await expect(page.locator("svg.handwritten-logo text.logo-text").first()).toHaveText(
    "sudoku",
  );
});

// ── Test 5: Board Interaction — Randomize + Cell Input ──────────────

test("randomize populates board and blank cells accept input", async ({ page }) => {
  await loadApp(page);
  // Initial auto-deal settled: the grid drew in and handed off to steady state.
  await page.waitForSelector(
    "image.boil-frame-bitmap.is-active, g.boil-frame-layer.is-active",
    { timeout: 15000 },
  );

  // Randomize deals a fresh board (async worker); it updates the values in place (no grid
  // redraw), so settle on the board's value signature flipping — never a fixed sleep.
  const before = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(".sudoku-cell input"),
      (i) => (i as HTMLInputElement).value,
    ).join(","),
  );
  await page.locator('.controls-card button[aria-label="Deal a new board"]').click();
  await expect
    .poll(
      () =>
        page.evaluate(() =>
          Array.from(
            document.querySelectorAll(".sudoku-cell input"),
            (i) => (i as HTMLInputElement).value,
          ).join(","),
        ),
      { timeout: 15000 },
    )
    .not.toBe(before);

  // Some cells should be populated (given cells have glyph SVGs with foreground stroke)
  const givenGlyphs = await page
    .locator('.sudoku-cell .glyph-svg path[stroke="var(--color-foreground)"]')
    .count();
  expect(givenGlyphs).toBeGreaterThan(0);

  // Find a blank cell and fill it via native value setter + input event
  const firstBlankIdx = await page.evaluate(() => {
    const cells = document.querySelectorAll(".sudoku-cell");
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].querySelector(".glyph-svg")) return i;
    }
    return -1;
  });
  expect(firstBlankIdx).toBeGreaterThanOrEqual(0);

  await page.evaluate((idx) => {
    const input = document.querySelectorAll(".sudoku-cell input")[
      idx
    ] as HTMLInputElement;
    const nativeSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )!.set!;
    nativeSetter.call(input, "5");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, firstBlankIdx);

  // Verify the cell now has a glyph (value accepted) — toHaveCount auto-waits for the
  // render, the settle condition, so no fixed sleep is needed.
  const targetCell = page.locator(".sudoku-cell").nth(firstBlankIdx);
  await expect(targetCell.locator(".glyph-svg")).toHaveCount(1);
});

// ── Test 6: Graceful Degradation Without Backend ────────────────────

test("graceful degradation: UI renders without backend API", async ({ page }) => {
  // Abort all API requests
  await page.route("**/api/**", (route) => route.abort());

  await loadApp(page);

  // Core UI elements render even without backend
  await expect(page.locator("svg.handwritten-logo")).toBeVisible();
  await expect(page.locator("button.sun-moon-toggle")).toBeVisible();
  await expect(page.locator(".board-wrapper")).toBeVisible();
  await expect(page.locator(".controls-card")).toBeVisible();
  await expect(page.locator("filter#grain-static")).toHaveCount(1);
});

// ── Test 7: Size Switching ──────────────────────────────────────────

test("size switching: 4x4, 9x9, 16x16 all render grid lines", async ({ page }) => {
  await loadApp(page);
  // Initial auto-deal settled: the grid drew in and handed off to steady state, so the
  // first size switch starts from a settled surface. The settle, never a fixed sleep.
  await page.waitForSelector(
    "image.boil-frame-bitmap.is-active, g.boil-frame-layer.is-active",
    { timeout: 15000 },
  );

  // Each size re-bakes the boil stack: ≥2 layers, exactly one visible (steadyGridCounts).
  // The per-size line geometry is baked into the pixels — its per-size soul golden lives
  // in visual-golden.spec.ts (`grid-corner-*`). While the live-filter fallback holds the
  // surface (bake in flight) the per-tier counts are still assertable and are checked.

  // Switch to 4x4 (use desktop sidebar buttons). T4-WU/U2 arm-not-live: the size chip STAGES
  // the pending size; the board re-deals only when Deal commits it (no live re-deal on the chip).
  await page.locator('.controls-card button:has-text("4×4")').click();
  await page.locator('.controls-card button[aria-label="Deal a new board"]').click();
  // Settle on the re-rendered board at the new size (16 cells) — the grid re-bakes off it.
  await expect
    .poll(() => page.locator(".sudoku-cell").count(), { timeout: 15000 })
    .toBe(16);
  const grid4 = await steadyGridCounts(page);
  expect(grid4.layerCount).toBeGreaterThanOrEqual(2);
  expect(grid4.visibleLayerCount).toBe(1);
  if (grid4.mode === "filtered") {
    // 4x4 with subgridSize=2: vertical non-subgrid lines at cols 1,3 + same horizontal → 4
    expect(grid4.activeCellLines).toBeGreaterThanOrEqual(2);
    expect(grid4.activeFrameLines).toBe(1);
  }

  // Switch to 16x16 (stage the chip, then Deal to commit — arm-not-live).
  await page.locator('.controls-card button:has-text("16×16")').click();
  await page.locator('.controls-card button[aria-label="Deal a new board"]').click();
  await expect
    .poll(() => page.locator(".sudoku-cell").count(), { timeout: 15000 })
    .toBe(256);
  const grid16 = await steadyGridCounts(page);
  expect(grid16.layerCount).toBeGreaterThanOrEqual(2);
  expect(grid16.visibleLayerCount).toBe(1);
  if (grid16.mode === "filtered") {
    expect(grid16.activeCellLines).toBeGreaterThan(10); // 16x16 has many cell lines
    expect(grid16.activeSubgridLines).toBeGreaterThan(0);
  }

  // Switch back to 9x9 (stage the chip, then Deal to commit — arm-not-live).
  await page.locator('.controls-card button:has-text("9×9")').click();
  await page.locator('.controls-card button[aria-label="Deal a new board"]').click();
  await expect
    .poll(() => page.locator(".sudoku-cell").count(), { timeout: 15000 })
    .toBe(81);
  const grid9 = await steadyGridCounts(page);
  expect(grid9.layerCount).toBeGreaterThanOrEqual(2);
  expect(grid9.visibleLayerCount).toBe(1);
  if (grid9.mode === "filtered") {
    expect(grid9.activeCellLines).toBe(12); // 9x9: 6 vertical + 6 horizontal cell lines
    expect(grid9.activeFrameLines).toBe(1);
  }
});

// ── Test 8: The Bloom's warp rest pose (T3-W13 §2) ──────────────────

test("toggle warp rest pose: wrung into the page, no carousel travel", async ({
  page,
}) => {
  await loadApp(page);

  // The parked live instance's warp rests wrung into the page — scale 0.06,
  // rotate +12deg — and carries NO translateX: the -270° whirl and the
  // translateX(-50%) slide are dead (owner finding 5). Light mode parks the moon.
  const m = await page
    .locator("svg.toggle-moon:not(.is-active) .warp")
    .evaluate((el) => getComputedStyle(el).transform);
  expect(m).toMatch(/^matrix\(/);
  const [a, b, , , e] = m
    .slice("matrix(".length, -1)
    .split(",")
    .map((v) => parseFloat(v));
  const scale = Math.hypot(a, b);
  expect(scale).toBeGreaterThan(0.05); // wrung-scrap scale ≈ 0.06
  expect(scale).toBeLessThan(0.07);
  const rotateDeg = (Math.atan2(b, a) * 180) / Math.PI;
  expect(rotateDeg).toBeGreaterThan(8); // +12deg press twist
  expect(rotateDeg).toBeLessThan(16);
  expect(Math.abs(e)).toBeLessThan(2); // no slide (the old -50% ≈ -104px)

  // The rest stage belongs to the frozen P3 stack: live instances parked,
  // exactly one pose visible per active sub-stack.
  const rest = await page.evaluate(() => {
    const vis = (sel: string) =>
      Array.from(document.querySelectorAll(sel)).map(
        (el) => getComputedStyle(el).visibility,
      );
    const activePoses = Array.from(
      document.querySelectorAll(".toggle-rest.is-active .rest-pose"),
    ).filter((el) => parseFloat(getComputedStyle(el).opacity) > 0);
    return {
      liveVisibility: vis(".toggle-icon"),
      sunStackActive: document
        .querySelector(".rest-sun")
        ?.classList.contains("is-active"),
      activePoses: activePoses.map((el) => ({
        tag: el.tagName.toLowerCase(),
        filter: el.getAttribute("filter"),
        src: el.getAttribute("src"),
      })),
    };
  });
  expect(rest.liveVisibility).toEqual(["hidden", "hidden"]);
  expect(rest.sunStackActive).toBe(true);
  // sun = whole-icon 4-pose stack (the moon's proven shape) — exactly one pose visible.
  // T4-W1: the pose is a baked <img> bitmap once ready (filter removed — the WebKit cure)
  // or the live wobble-celestial-p <svg> while the async bake is in flight.
  // T4-WM (rasterPose.ts ranks 2/4): the bake retired the synchronous toDataURL for
  // URL.createObjectURL(await …toBlob()) — a pointer handle, not a retained ~1.3 MB base64
  // string — so a ready pose's src is a `blob:` URL, never `data:image/png`.
  expect(rest.activePoses).toHaveLength(1);
  for (const p of rest.activePoses) {
    if (p.tag === "img") {
      expect(p.src).toMatch(/^blob:/);
    } else {
      expect(p.filter).toMatch(/wobble-celestial-p\d/);
    }
  }
});
