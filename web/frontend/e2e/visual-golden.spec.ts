import { test, expect, type Page, type Locator } from '@playwright/test';

/**
 * T4-W2 — the visual golden system (the π/DELTA MINT).
 *
 * REPLACES the write-only screenshot half of visual-regression.spec.ts (whose
 * `page.screenshot()` PNGs were never compared — a solid-black board passed green).
 * Here every capture is COMPARED against a committed reference crop via Playwright's
 * `toHaveScreenshot` at the ≥0.98 floor; a regression (theme inversion, grain→black,
 * a baked pose drifting below the SSIM soul floor) REDS the compare.
 *
 * Run with the golden config (never the default e2e config — see playwright-golden.config.ts):
 *   npm run test:golden           # compare against committed goldens
 *   npm run test:golden:update    # reviewed re-baseline (the only way a golden changes)
 *   npm run test:golden:bytes     # the FAM-15 per-image byte-ceiling gate
 *
 * Determinism contract:
 *   - reducedMotion:'reduce' freezes the ~8 Hz boil beat at pose 0 (boilBeat.ts:
 *     `driver.start()` self-guards on PRM), so the logo / toggle / grid pose stacks
 *     rest on their baked pose-0 variant. Verified stable across 900 ms.
 *   - The board auto-randomizes on mount (useSudoku.ts:342), so board-region goldens
 *     PIN the board with a fixed `?board=` permalink (URL wins over the deal).
 *   - Settle is the `.is-active` handoff + a poll on the given glyph — never a sleep.
 *
 * W13 SSIM soul gates (T3-W13:38,125,131 — "SSIM ≥ 0.983 vs live-filter reference
 * @DPR2", recorded once, wired NOWHERE) are wired here as goldens. W13 retired the
 * per-beat feTurbulence write (pencilConfig.ts:315): a wobble is now N *baked* poses,
 * so at runtime there is no separate live-filter render to diff against — the live
 * render IS the baked pose. The executable descendant of the one-shot soul measurement
 * is therefore the REGRESSION form: the committed reference is the blessed baked-surface
 * render, and the gate reds if the live baked pose diverges beyond the 0.983 SSIM floor
 * (`SOUL_FLOOR` below). That standing gate is what the "soul discipline" becomes.
 */

// DPR2 + PRM travel WITH the spec (redundant with the config's `use`, but the spec
// carries its own capture contract so it's correct under any runner).
test.use({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
});

// ── Tolerance floors ────────────────────────────────────────────────
// The general identity floor (spec §comparison-tool): a bitmap capture vs live
// render legitimately diverges ~2% at edges; equality would false-red.
const FLOOR = { maxDiffPixelRatio: 0.02 } as const;
// The W13 baked-surface SSIM soul floor: SSIM ≥ 0.983 → ≤ 1.7% divergent pixels. Held on
// the raster-STABLE baked surfaces (the black wordmark; the grid frame/grain, whose
// low-contrast feTurbulence grain shifts stay under the per-pixel `threshold`).
const SOUL_FLOOR = { maxDiffPixelRatio: 0.017 } as const;

// ── MAGNITUDE REPORT (T5-W1.13) ─────────────────────────────────────
// The blind band: darwin soul floor 0.017 · every drift the campaign has ever measured
// 0.03 · linux clause floor 0.05 (r3/goldens-estate §5.2 H3). On the ubuntu-only lane the
// two clause-relaxed goldens are green for anything under 0.05 and print NOTHING when
// green — Playwright emits the ratio only on failure — so a real 0.03 drift is invisible
// on the only platform CI runs. The cure is VISIBILITY, not a floor change and not a new
// baseline family: GOLDEN_MAGNITUDE=1 asserts the two at ratio 0 so every capture reports
// its measured ratio. It only ever TIGHTENS — report mode cannot manufacture a green — and
// the floors CI enforces are untouched below. Driver: scripts/golden-magnitude.mjs.
const REPORT_MAGNITUDE = process.env.GOLDEN_MAGNITUDE === '1';
const MAGNITUDE_FLOOR = { maxDiffPixelRatio: 0 } as const;

// ── Pinned board (deterministic board-region goldens) ───────────────
// Byte-identical to the composables' encodeBoard (see permalink.spec.ts): base64url
// of `${size}.${base36 cells}`. size=3 → 9×9 (81 cells). A fixed given set in the
// top-left box makes the grid-corner + first-cell goldens deterministic.
function b64url(s: string): string {
  return Buffer.from(s, 'binary')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
function encodeSudoku(size: number, cells: Record<number, number>, total: number): string {
  let c = '';
  for (let i = 0; i < total; i++) c += (cells[i] ?? 0).toString(36);
  return b64url(`${size}.${c}`);
}
// A stable 9×9 with givens seeded across the top-left 3×3 box (cell 0 = 5 anchors the
// single-cell golden). Not necessarily a solvable puzzle — deterministic PIXELS are all
// a golden needs.
const PINNED_GIVENS = { 0: 5, 2: 8, 11: 3, 18: 6, 20: 9 } as const;
const PINNED_BOARD = encodeSudoku(3, PINNED_GIVENS, 81);

// ── Settle helper ───────────────────────────────────────────────────
async function loadSettled(page: Page, { pinBoard = false, dark = false } = {}) {
  if (dark) {
    // Boot straight into dark mode via the persisted color-scheme (vueuse `useDark`'s
    // namespaced storage key, T4-W10) — so the moon rest pose renders from FIRST paint with no
    // toggle click and no turn animation. Clicking to switch mid-test left the crest in
    // a borderline settle that flaked the ≤0.017 soul floor across runs (the exact
    // flaky-gate class this wave prunes). The rest content is deterministic either way
    // (twinkles are TWINKLE_BY_FRAME[0], frozen under PRM — no per-mount randomness).
    await page.addInitScript(() => localStorage.setItem('sudoku-color-scheme', 'dark'));
  }
  await page.goto(pinBoard ? `./?board=${PINNED_BOARD}` : './');
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
  // The `.is-active` handoff, baked-aware: steady state is the bitmap pose stack —
  // the filtered layers stay mounted as the during-bake fallback but go display:none
  // (baked-hidden) once the bake lands, so the pixel-truth settle is the ACTIVE BITMAP.
  // A golden captured mid-bake (fallback filter) would diverge from the shipped steady
  // state; if the bake ever breaks, this times out — the gate biting, not a flake.
  await page.waitForSelector('image.boil-frame-bitmap.is-active', { timeout: 15000 });
  await expect
    .poll(() => page.locator('image.boil-frame-bitmap.is-active').count(), { timeout: 15000 })
    .toBe(1);
  if (dark) {
    await expect(page.locator('html')).toHaveClass(/dark/, { timeout: 5000 });
    await expect(page.locator('.toggle-rest.rest-moon.is-active')).toHaveCount(1);
    await expect(page.locator('button.sun-moon-toggle.is-turning')).toHaveCount(0);
    // Baked-aware (W1): the crest's steady state is the baked <img> pose — without this
    // the capture races the toggle's own bake and lands on the live-filter fallback,
    // shifting twinkle frames and crescent edges between runs.
    await page.waitForSelector('.toggle-rest.rest-moon img.rest-pose.is-pose-active', {
      timeout: 15000,
    });
  }
  if (pinBoard) {
    // The pinned given renders its hand-drawn glyph — the board-region settle condition.
    await expect
      .poll(() => page.locator('.sudoku-cell').first().locator('.glyph-svg').count(), {
        timeout: 15000,
      })
      .toBe(1);
  }
  // Web fonts resolved before capturing any text/glyph surface (no FOUT in the crop).
  await page.evaluate(() => document.fonts.ready);

  // ── SELF-DELTA hook (the machinery's own acceptance test) ──────────
  // A deliberate, reproducible visual regression injected on demand so the capture-
  // compare can be PROVEN to bite (spec §π/DELTA). Default (unset) is a no-op — normal
  // runs are unperturbed. GOLDEN_DELTA=black paints every asserted surface solid black
  // (the grain-static→solid-black regression); =invert flips the theme.
  const delta = process.env.GOLDEN_DELTA;
  if (delta === 'black') {
    await page.addStyleTag({
      content: `
        svg.hand-drawn-grid *, svg.handwritten-logo *, button.sun-moon-toggle *,
        .sudoku-cell, .sudoku-cell * {
          fill: #000 !important; stroke: #000 !important; stop-color: #000 !important;
          opacity: 1 !important; filter: none !important;
        }
        .sudoku-cell, .board-wrapper { background: #000 !important; }
      `,
    });
  } else if (delta === 'invert') {
    await page.locator('button.sun-moon-toggle').dispatchEvent('click');
    // Settle on the theme swap completing (DELTA path only): html gains `dark` and the
    // crest's turn animation ends — the same conditions the dark boot above asserts,
    // never a fixed sleep.
    await expect(page.locator('html')).toHaveClass(/dark/, { timeout: 5000 });
    await expect(page.locator('button.sun-moon-toggle.is-turning')).toHaveCount(0, {
      timeout: 5000,
    });
  }
}

/** Clip a fixed-size corner of an element (CSS px) — a NAMED crop bound, relative to
 *  the element's live bbox so it survives a layout shift (captures the same corner). */
async function corner(el: Locator, w: number, h: number) {
  const bb = await el.boundingBox();
  if (!bb) throw new Error('corner(): element has no bounding box');
  return { x: bb.x, y: bb.y, width: w, height: h };
}

/** Clip a fixed-size region centered on an element (CSS px) — the crest's stable disc/
 *  body core. Excludes the peripheral twinkle sparkles, whose feTurbulence-baked raster
 *  relocates a few px run-to-run (diagnosed via the diff artifact) and would false-red a
 *  tight floor; the disc/body/spiral rasterizes stably. Relative to the live bbox. */
async function center(el: Locator, w: number, h: number) {
  const bb = await el.boundingBox();
  if (!bb) throw new Error('center(): element has no bounding box');
  return { x: bb.x + (bb.width - w) / 2, y: bb.y + (bb.height - h) / 2, width: w, height: h };
}

// ── Goldens ─────────────────────────────────────────────────────────

// The handwritten wordmark — a 4-pose baked stack (W13 §1-P3). SOUL on darwin: pose 0
// is the baked wobble-logo-p0 variant; reds if it drifts below the 0.983 SSIM floor.
//
// LINUX floor is coarse, not soul (T4-WM seal, the sun-crest clause applied): after the
// §4 encode-path swap the linux runner's logo bake is non-convergent RUN-TO-RUN — three
// consecutive runner renders sat pairwise 0.02–0.03 apart (runs 29238452743 →
// 29239186618 → 29239690082, each internally stable ×3 retries), so no mint can hold
// the 0.017 soul floor there. Gating a non-convergent surface at a floor it can't hold
// is the flaky-gate class W2 prunes; 0.05 keeps the linux tripwire (a real regression —
// theme inversion, glyph loss, pose-set drift — moves far past it) while darwin, where
// the bake converges, keeps the soul bite.
const LOGO_FLOOR = REPORT_MAGNITUDE
  ? MAGNITUDE_FLOOR
  : process.platform === 'linux'
    ? ({ maxDiffPixelRatio: 0.05 } as const)
    : SOUL_FLOOR;
test('golden · logo wordmark (light) — W13 soul: baked logo pose stack', async ({ page }) => {
  await loadSettled(page);
  await expect(page.locator('svg.handwritten-logo')).toHaveScreenshot('logo-light.png', LOGO_FLOOR);
});

// The toggle crest — the celestial rest pose stack (W13 §2), captured in DARK mode: the
// moon body (wobble-celestial-p0). SOUL. Cropped to the body core (110×110 CSS centered),
// excluding the peripheral twinkle cluster.
//
// The light/SUN crest is deliberately NOT goldened. Its rest pose is the same wobble-
// celestial filter, but over a thin, high-contrast SPIRAL whose feTurbulence raster is
// non-deterministic every frame on linux — toHaveScreenshot's "two consecutive identical
// frames" stabilization never converges there (runs burned the full timeout, then diverged
// past any sane floor). Gating a non-convergent surface is the exact flaky-gate class this
// wave prunes; the moon (low-frequency body, converges + holds 0.017 on both engines) is
// the raster-stable representative of the shared celestial filter, so the soul gate stands.
// The moon converges on darwin and HOLDS 0.017 there — but the linux runner has now
// flaked this golden three times across unchanged trees (each red passed on rerun of
// the same SHA), so its convergence is marginal, not absolute: the same sun-crest
// clause as LOGO_FLOOR applies. 0.05 keeps the linux tripwire (theme inversion, glyph
// loss, pose drift all move far past it); darwin keeps the soul bite.
const CREST_FLOOR = REPORT_MAGNITUDE
  ? MAGNITUDE_FLOOR
  : process.platform === 'linux'
    ? ({ maxDiffPixelRatio: 0.05 } as const)
    : SOUL_FLOOR;
test('golden · toggle crest (dark, moon) — W13 soul: celestial rest pose', async ({ page }) => {
  await loadSettled(page, { dark: true });
  const clip = await center(page.locator('button.sun-moon-toggle'), 110, 110);
  await expect(page).toHaveScreenshot('toggle-crest-dark.png', { ...CREST_FLOOR, clip });
});

// A single grid cell rendering the pinned given "5" — the hand-drawn glyph + cell grain.
test('golden · single cell with given glyph (light)', async ({ page }) => {
  await loadSettled(page, { pinBoard: true });
  await expect(page.locator('.sudoku-cell').first()).toHaveScreenshot('cell-light.png', FLOOR);
});

// The grid's top-left corner — frame join + first subgrid junction + grain-static baked
// steady layer (W13 grain hoist). SOUL: the grain-static steady sibling is a baked
// surface; a grain regression reds this crop. Clipped to a named 180×180 CSS corner.
test('golden · grid top-left corner (light) — W13 soul: grain-static steady layer', async ({
  page,
}) => {
  await loadSettled(page, { pinBoard: true });
  const clip = await corner(page.locator('.board-wrapper'), 180, 180);
  await expect(page).toHaveScreenshot('grid-corner-light.png', { ...SOUL_FLOOR, clip });
});
