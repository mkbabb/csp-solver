import { test, expect, devices, type Page } from "@playwright/test";
import { MOTION } from "../src/pencil/config/pencilConfig";

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
  // SETTLE IS POLLED, NEVER READ ONCE (CH-63 trigger-1 order for :235 — the row redded
  // `layerCount 0 vs ≥2` at the formation CI and again at the T5 close seal, webkit
  // both times). `.is-active` matching and the census's evaluate are not the same frame:
  // under load the bake's generation swap unmounts the filter layers before the bitmaps
  // append, and an instantaneous read catches the empty window. The settled invariant —
  // ≥2 layers, exactly one visible — is what every caller asserts anyway, so the census
  // waits for it (bounded by the poll's own timeout) and returns the settled read; a
  // genuinely broken boil (0 layers forever, 2 visible forever) still times out RED.
  await page
    .waitForFunction(
      () => {
        const baked = document.querySelectorAll("image.boil-frame-bitmap");
        const filtered = document.querySelectorAll("g.boil-frame-layer");
        const layers = baked.length ? baked : filtered;
        if (layers.length < 2) return false;
        let visible = 0;
        for (const l of layers)
          if (parseFloat(getComputedStyle(l).opacity) > 0) visible += 1;
        return visible === 1;
      },
      undefined,
      { timeout: 15000 },
    )
    .catch(() => {}); // the returned census still tells the truth; the assertions red on it
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
  //
  // POLLED, not read once (T4-P1: this spec runs webkit now). The `.is-active` handoff and
  // the transition layer's own cleanup are not the same frame in WebKit under load, so an
  // instantaneous read catches paths mid-draw and reds a settle that arrives a beat later.
  // The property asserted is unchanged — the paths SETTLE — and it is now bounded by the
  // config's expect timeout instead of by one sampling instant.
  await expect
    .poll(() =>
      page.evaluate(() => {
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
      }),
    )
    .toBe(true);

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

// ── Test 8: Deal's box — the crushed-die cascade row ────────────────

test("the Deal die is not crushed: the commit verb's box fits its own content", async ({
  page,
}) => {
  await loadApp(page);

  // Nothing in this estate asserted Deal's geometry, which is how a 28px die rendered at
  // 17.63 for the life of the T4 panel: `.deal-btn` was authored ABOVE `.icon-btn` and tied it
  // at (0,1,0), so the base block's fixed 2.75rem square won on source order, the column
  // content overflowed by 10.38px, and a text item cannot shrink below min-content — the die
  // absorbed all of it. The cure is the `.icon-btn.deal-btn` selector (order-proof); THIS is
  // the row that would have caught it, and would catch any future re-break however it arrives.
  const geom = await page.evaluate(() => {
    const btn = document.querySelector(
      ".controls-card .deal-btn",
    ) as HTMLElement | null;
    if (!btn) return null;
    const die = btn.querySelector("svg") as SVGElement | null;
    const label = btn.querySelector(".icon-sublabel") as HTMLElement | null;
    const r = (el: Element | null) => (el ? el.getBoundingClientRect() : null);
    const b = r(btn)!;
    const d = r(die);
    const l = r(label);
    // The box's OWN spacing, read rather than hardcoded: a padding or gap change must
    // re-price the bound below, not quietly widen it.
    const cs = getComputedStyle(btn);
    const px = (v: string) => parseFloat(v) || 0;
    return {
      btn: { w: b.width, h: b.height },
      die: d ? { w: d.width, h: d.height } : null,
      labelH: l ? l.height : 0,
      padY: px(cs.paddingTop) + px(cs.paddingBottom),
      gap: px(cs.rowGap) || px(cs.gap),
    };
  });

  expect(geom).not.toBeNull();
  expect(geom!.die).not.toBeNull();

  // SOFT, all three: under the defect every one of these is wrong, and a hard first assertion
  // means the negative control only ever proves the row it stops at. Pass 3 shipped a
  // durability bound nobody could see fail because the squareness row fired ahead of it.
  //
  // The die is square — the defect's whole signature was a squashed height against an intact
  // width. Half a pixel of tolerance for sub-pixel layout, no more.
  expect.soft(Math.abs(geom!.die!.h - geom!.die!.w)).toBeLessThanOrEqual(0.5);
  expect.soft(geom!.die!.h).toBeGreaterThanOrEqual(27);

  // …and the button's box is big enough for its own content. The bound is written against the
  // die's WIDTH, which is the dimension the defect leaves intact — `btn.h ≥ die.h + labelH`
  // (the pass-3 spelling) cannot fail under a column flex box: pin the height and the items
  // shrink until they fit, so at the broken pose 44 ≥ 17.62 + 14.38 passed with 12px to spare.
  // Against the die's own square footprint the same pose reads 44 < 28 + 14.38 + 9.6 + 2.4 =
  // 54.38 and reds. GATE-1 control run at the pass-4 close: patched back to the bare
  // `.deal-btn` selector this row goes RED on exactly this line (44.00 for 54.38 demanded),
  // green on the fix.
  //
  // AND THE SLACK BELOW IS NOT HEADROOM. `btn.h` is `auto`, so at the healthy pose the box IS
  // its own content and the bound is an identity, not a margin: at this config's 1280×800 the
  // sum re-derives to 54.05 against a delivered 54.03 — minus 0.02px, chromium and webkit
  // alike, n=3 (T5-W4 pass 6, Lane D, `pass6/D/rig/ship1-margin.mjs`). The row passes on the
  // 0.5 TOLERANCE, not on slack. The bound has real range only in the direction the defect
  // travels — height pinned, die squashed, width intact — which is why it's written against
  // `die.w`, and the GATE-1 control is what proves it can fail. Anyone reading
  // "54.03 ≥ 54.05 − 0.5" as room to spare is reading a tolerance as evidence. (The 54.38
  // above is a 1440-wide reading; `labelH` tracks the viewport — 14.05 here, 14.39 there.)
  const demanded = geom!.die!.w + geom!.labelH + geom!.padY + geom!.gap;
  expect
    .soft(
      geom!.btn.h,
      `Deal's box is ${geom!.btn.h.toFixed(2)}px for content demanding ${demanded.toFixed(2)}px ` +
        `(die ${geom!.die!.w.toFixed(2)} square + label ${geom!.labelH.toFixed(2)} + ` +
        `padding ${geom!.padY.toFixed(2)} + gap ${geom!.gap.toFixed(2)})`,
    )
    .toBeGreaterThanOrEqual(demanded - 0.5);
});

// ── Test 8a: the house glass curve is one curve ─────────────────────

test("the glass curve is the same curve in both layers", async ({ page }) => {
  await loadApp(page);

  // The F3 charter's `drawerGlide ≡ vaul` row, gated (T4-P1 pass 4). One monotone glass curve
  // carries the drawer's glide, the carousel card step, the board fold and the laminate
  // lay-down — but it necessarily lives in two layers: `<style>`-layer consumers cannot read a
  // TS constant, so index.css mints `--ease-glassGlide` as a byte copy of MOTION.curves
  // .drawerGlide with a comment promising the two agree. A promise in a comment is not a gate:
  // re-time either literal alone and every consumer of the other keeps the old curve, silently.
  // Read off the SHIPPED cascade, compared against the TS home the JS movers actually run.
  const shipped = await page.evaluate(() =>
    getComputedStyle(document.documentElement)
      .getPropertyValue("--ease-glassGlide")
      .trim(),
  );
  // Engines re-serialise the value (whitespace, and `0.32` → `.32`), so compare the numbers,
  // not the spelling — the drift this row exists for moves a control point, never a zero.
  const norm = (s: string) =>
    (s.match(/-?[\d.]+/g) ?? []).map((n) => String(parseFloat(n))).join(",");
  expect(norm(shipped)).toBe(norm(MOTION.curves.drawerGlide));
  expect(norm(shipped)).not.toBe(""); // an unresolved var must not read as agreement
});

// ── Test 8b: the receipt sits UNDER the verb, on its axis ───────────

test("the deal receipt keeps off the commit verb, hover included", async ({ page }) => {
  await loadApp(page);

  // Mark 6 moved the difficulty tally out of the board's margin into the ticket's deal row,
  // where it SHARED one grid cell with Deal — verb centred, receipt end-aligned, 7.53px of
  // horizontal clearance between them. This row read that gap in x, and T6 mark 8 spent it:
  // a 36px die and a 1.9em tally leave no room to be side by side, so the receipt takes its
  // own grid row beneath the verb.
  //
  // THE READ IS RE-AIMED, NOT RELAXED. In x the two boxes now overlap by construction — the
  // old assertion would red on the cure and its old control (a child growing on hover) can no
  // longer cross anything, so it had inverted into a row that greened on the defect. The
  // clearance that carries the same claim is VERTICAL: the receipt's top at or below the
  // verb's bottom, and both centred on the well's one spine. It still fails for any growth of
  // either box toward the other, which is what the row is for.
  const clearance = async () =>
    page.evaluate(() => {
      const row = document.querySelector(".controls-card .deal-row");
      const verb = row?.querySelector(".deal-btn");
      const receipt = row?.querySelector(".difficulty-tally");
      if (!verb || !receipt) return null;
      const v = verb.getBoundingClientRect();
      const t = receipt.getBoundingClientRect();
      return {
        gap: +(t.top - v.bottom).toFixed(2),
        axis: +Math.abs((t.left + t.right) / 2 - (v.left + v.right) / 2).toFixed(2),
        receiptW: +t.width.toFixed(2),
      };
    });

  const rest = await clearance();
  expect(rest).not.toBeNull();
  expect(rest!.gap).toBeGreaterThanOrEqual(0);
  expect(rest!.axis, "verb and receipt share one centre").toBeLessThanOrEqual(1);

  await page.locator(".controls-card .deal-row .difficulty-tally").hover();
  await page.waitForTimeout(320); // longer than any reveal transition the estate has owned
  const hovered = await clearance();
  expect(hovered!.gap).toBeGreaterThanOrEqual(0);
  expect(hovered!.axis).toBeLessThanOrEqual(1);
  // …and the receipt is the same receipt. A reveal that grows it is the defect even when the
  // gap happens to survive on a wide rail.
  expect(hovered!.receiptW).toBeCloseTo(rest!.receiptW, 1);

  // CONTROL: put the SHARED CELL back — mark 6's own two declarations, verbatim — and the same
  // probe must see the clearance collapse and the axes part.
  //
  // The audit rider named `grid-area: auto` for this injection. It cannot red and the reason
  // is auto-placement: Deal keeps its explicit `1 / 1`, so an auto-placed receipt takes the
  // first free cell, which IS row 2 column 1 — the cure, spelled differently. The injection
  // that actually inverts the assertion is the state the cure replaced, so that is the one
  // written here; it is the stronger control of the two, because it reproduces a shape this
  // estate has really shipped rather than one it never could.
  await page.addStyleTag({
    content:
      ".controls-card .deal-row > .difficulty-tally { grid-area: 1 / 1; justify-self: end; }",
  });
  await page.locator(".controls-card .deal-row .difficulty-tally").hover();
  await page.waitForTimeout(320);
  const broken = await clearance();
  expect(broken!.gap).toBeLessThan(0);
  expect(broken!.axis).toBeGreaterThan(1);
});

// ── Test 9: chip separation — the seam between adjacent option chips ─

/** The neighbour gap between adjacent `.ctrl-btn` boxes, per group, along the group's OWN
 *  axis (a row separates in x, a column in y). Returned per group so a failure names which
 *  one closed. Groups of one contribute no pair and are reported as such, never as a pass. */
const CHIP_SEPARATION = () => {
  const panel = document.querySelector(
    // pass 6: one card at every width — `.mobile-board-width` was the deleted twin's name.
    ".controls-card .control-panel-wrap",
  );
  const vis = (el: Element) => el.getClientRects().length > 0;
  const out: { axis: string | null; n: number; gap: number | null; first: string }[] =
    [];
  const parents = new Set(
    [...(panel?.querySelectorAll(".ctrl-btn") ?? [])]
      .filter(vis)
      .map((b) => b.parentElement!),
  );
  for (const p of parents) {
    const kids = [...p.children].filter(
      (k) => k.classList.contains("ctrl-btn") && vis(k),
    );
    const first = kids[0]?.textContent?.trim() ?? "";
    if (kids.length < 2) {
      out.push({ axis: null, n: kids.length, gap: null, first });
      continue;
    }
    const r = kids.map((k) => k.getBoundingClientRect());
    const axis =
      Math.abs(r[1].left - r[0].left) >= Math.abs(r[1].top - r[0].top)
        ? "row"
        : "column";
    let gap = Infinity;
    for (let i = 1; i < r.length; i++) {
      gap = Math.min(
        gap,
        axis === "row" ? r[i].left - r[i - 1].right : r[i].top - r[i - 1].bottom,
      );
    }
    out.push({ axis, n: kids.length, gap: +gap.toFixed(2), first });
  }
  return out;
};

test("option chips keep their separation: ≥6px between neighbours, both axes", async ({
  page,
  browser,
}) => {
  // The floor is F1's own, and it was failing in the SHIPPED estate on both axes at once:
  // the coarse row sat at 4px (`.options-row { gap: 0.25rem }`) and the rail column at
  // exactly **0** — two 44px coarse targets sharing an edge, no seam for an eye or a thumb.
  // The pass-2 diff that noticed it LOOSENED the guarding font floor in the same commit
  // instead of adding this row; the floor below is left at its authored 19 and this row is
  // the addition it should have been.
  const FLOOR = 6;

  const check = async (p: Page, label: string) => {
    const groups = await p.evaluate(CHIP_SEPARATION);
    // The card must actually have chip groups — an empty probe passes vacuously otherwise.
    const paired = groups.filter((g) => g.gap !== null);
    expect(
      paired.length,
      `${label}: no paired chip group found`,
    ).toBeGreaterThanOrEqual(3);
    for (const g of paired) {
      expect(
        g.gap!,
        `${label}: ${g.axis} group "${g.first}" (n=${g.n})`,
      ).toBeGreaterThanOrEqual(FLOOR);
    }
    return Math.min(...paired.map((g) => g.gap!));
  };

  // ── the rail column (default fine 1280 viewport) ──
  await loadApp(page);
  const colGap = await check(page, "rail column");

  // NEGATIVE CONTROL, in the same run: collapse the seam and the probe must SEE it. A gate
  // that cannot go red is a decoration (the GATE-1 pattern, adopted estate-wide this pass).
  await page.addStyleTag({ content: ".ctrl-options { gap: 0 !important }" });
  const collapsed = await page.evaluate(CHIP_SEPARATION);
  const worst = Math.min(...collapsed.filter((g) => g.gap !== null).map((g) => g.gap!));
  expect(
    worst,
    "negative control: the collapsed seam must fall under the floor",
  ).toBeLessThan(FLOOR);
  expect(colGap).toBeGreaterThan(worst);

  // ── the coarse row (a phone: the other axis, where a thumb is the instrument) ──
  const ctx = await browser.newContext({
    ...devices["iPhone 13"],
    baseURL: test.info().project.use.baseURL,
  });
  const phone = await ctx.newPage();
  try {
    await phone.goto("./");
    await phone.waitForSelector("svg.handwritten-logo", { timeout: 15000 });
    await phone.waitForSelector(".ctrl-btn", { state: "attached", timeout: 15000 });
    // The regime witness: a number taken at `pointer: fine` on phone geometry is a different
    // number (the pass-1 harness). Refuse it rather than bank it.
    expect(await phone.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(
      true,
    );
    // pass 6: the chips are between-moves controls and live behind the door on the portrait
    // dock. `CHIP_SEPARATION` counts only PAINTED chips (`getClientRects`), so an unopened
    // sheet yields zero pairs and `check` reds on its own vacuity guard — which is the guard
    // doing its job, not a reason to loosen it.
    await phone.locator(".drawer-tab").tap();
    await expect(phone.locator("#controls-drawer .drawer-case")).toBeVisible();
    await phone.waitForTimeout(700);
    await check(phone, "coarse row");
  } finally {
    await ctx.close();
  }
});

// ── Test 10: the iPad coarse card against the P1 seal ────────────────

/** The rail panel's own box at the cell that owns the price. */
const PANEL_H = () => {
  const panel = document.querySelector(
    // pass 6: one card at every width — `.mobile-board-width` was the deleted twin's name.
    ".controls-card .control-panel-wrap",
  );
  return panel ? +panel.getBoundingClientRect().height.toFixed(2) : null;
};

test("the iPad coarse card stays under the P1 seal: the chip seam is PAID for", async ({
  browser,
}) => {
  // 1280×800 at `pointer: coarse` is the one cell where the estate stacks fourteen
  // tap-floored (44px) chips in a 165px column, so it is the cell every vertical price
  // lands on hardest — and it is the cell the sealed P1 patch was measured at: **1098.25**.
  // The chip seam costs 7.2px per neighbour there (nine neighbours, +64.8px), which is
  // exactly why the seam has to be paid for somewhere instead of simply added: a cure that
  // pushes the card past its own seal is a regression wearing a fix's name. The two payments
  // are the binary laid out as a pair (`.options-pair`) and the divider's un-doubled margin.
  //
  // T6 RE-PRICES THE SEAL, AND SAYS WHAT IT BOUGHT. The P1 number carried 32.39px of unclaimed
  // slack (head measured 1065.86 at this cell, both engines) and the owner's marks 3 · 8 spend
  // 76.52 of deliberate vertical: the size/difficulty rule +18.60, the receipt onto its own
  // row +32.79, Deal's box +12.36, the sticky bar's own padding +8.79, the strip's icons
  // 26 → 30px +4.00. Every figure is an in-page ablation of the one declaration, measured on
  // the built dist at this cell, chromium and webkit within 0.04px of each other
  // (`t6/controls/probe-ipad.mjs`). Shipped read 1142.38 chromium / 1142.34 webkit; the seal
  // was that with 2.6px of engine slack and NO slack for a mark nobody ordered. The card is a
  // scrollport here (`scene.css:60`), so this bounds DRIFT, never a clipping hazard — and the
  // negative control below still has to break it, which is what keeps the number a gate.
  //
  // MARK 13 RE-PRICES IT ONCE MORE, and pays the same way: named, measured, ablated. The
  // players compartment is the tranche's one ordered FEATURE, and a compartment is what the
  // zone grammar charges for it — **82.42px chromium / 82.43px webkit**, split by in-page
  // ablation into the tap-floored invite verb (52.03) and the well's own frame and daylight
  // (30.39, of which 16.00 is the `margin-block` every well pays so consecutive drawn frames
  // don't cross). Nothing here is slack: the 44px floor is the estate's, and a well that
  // charged less would be a compartment that didn't read as one. Base is UNMOVED at
  // 1142.38 / 1142.34 with the well ablated, which is the other half of the reading — the
  // feature costs what it costs and nothing else drifted underneath it.
  const SEAL = 1227.5;

  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    hasTouch: true,
    isMobile: true,
    baseURL: test.info().project.use.baseURL,
  });
  const p = await ctx.newPage();
  try {
    await p.goto("./");
    await p.waitForSelector("svg.handwritten-logo", { timeout: 15000 });
    await p.waitForSelector(".ctrl-btn", { timeout: 15000 });
    // A number without its regime is not a number: this must be the coarse ROW regime
    // (the rail), not a fine desktop and not the phone's in-flow card.
    const regime = await p.evaluate(() => ({
      coarse: matchMedia("(pointer: coarse)").matches,
      row: matchMedia("(min-width: 1024px)").matches,
      rail: !!document.querySelector(".controls-card .control-panel-wrap"),
    }));
    expect(regime, "iPad coarse row regime").toEqual({
      coarse: true,
      row: true,
      rail: true,
    });

    const shipped = await p.evaluate(PANEL_H);
    expect(
      shipped,
      `iPad coarse card is ${shipped}px against the P1 seal ${SEAL}px`,
    ).toBeLessThanOrEqual(SEAL);

    // NEGATIVE CONTROL, in the same run: revert both payments in-page and the same probe
    // must break the seal. Without this the bound is arithmetic about a number nobody can
    // move — the GATE-1 pattern, and the reason this row exists at all.
    await p.addStyleTag({
      content: `.ctrl-options.options-pair { flex-direction: column !important }
                .ctrl-options.options-pair > .ctrl-btn { flex: 0 0 auto !important }
                .peek-hold-surface { margin-block: 0.5rem !important }`,
    });
    await p.waitForTimeout(120);
    const reverted = await p.evaluate(PANEL_H);
    expect(
      reverted,
      "negative control: the unpaid layout must break the seal",
    ).toBeGreaterThan(SEAL);
    expect(reverted! - shipped!).toBeGreaterThan(30);
  } finally {
    await ctx.close();
  }
});

// ── Test 11: The Bloom's warp rest pose (T3-W13 §2) ─────────────────

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
