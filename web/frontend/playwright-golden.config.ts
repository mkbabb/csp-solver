import { defineConfig } from '@playwright/test';

/**
 * T4-W2 — the visual-golden config (the π/DELTA MINT).
 *
 * A SEPARATE config from playwright.config.ts on purpose. The default e2e run
 * (`npx playwright test`, the seal lane, ubuntu-latest) must stay platform-agnostic:
 * committed pixel goldens are OS-specific, so sweeping visual-golden.spec.ts into the
 * default suite would red a linux seal run against darwin baselines. So the base
 * config `testIgnore`s the golden spec, and this config owns it alone — run via
 * `npm run test:golden` (compare) / `npm run test:golden:update` (reviewed re-baseline).
 *
 * Capture contract (spec §"The visual golden system"):
 *   - DPR2 (`deviceScaleFactor: 2`, `scale: 'device'`) — genuine 2× device pixels.
 *   - SETTLED via the `.is-active` handoff + `reducedMotion: 'reduce'` (freezes the
 *     ~8 Hz boil beat at pose 0 — boilBeat.ts `driver.start()` self-guards on PRM), so
 *     the pose stacks rest deterministically. NEVER a fixed sleep.
 *   - Small crops of ONE asserted surface (locator bbox, or a named board-corner clip)
 *     — never a full viewport (FAM-15 / EVIDENCE-POLICY). Policed by check-golden-bytes.mjs.
 *   - Tolerance floor ≥ 0.98 (maxDiffPixelRatio ≤ 0.02); the W13 baked-surface "soul"
 *     goldens tighten to the recorded SSIM ≥ 0.983 floor (≤ 0.017). Per-assertion.
 *   - Goldens committed under e2e/goldens/, per-platform ({platform} in the path), so a
 *     re-baseline after W1's bitmap pose-stack swap is ONE reviewed --update-snapshots run.
 *   - Diff artifacts (test-results/ + the HTML report) upload on failure for review.
 */
const externalBase = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  testMatch: /visual-golden\.spec\.ts$/,
  timeout: 60000,
  // Per-golden stabilization loop lives inside toHaveScreenshot; give it room.
  expect: {
    timeout: 15000,
    toHaveScreenshot: {
      // The ≥0.98 identity floor, generalized (a bitmap capture vs live render
      // legitimately diverges ~2% at edges — equality would false-red). Soul goldens
      // override to the tighter 0.983 floor per-assertion.
      maxDiffPixelRatio: 0.02,
      // Per-pixel YIQ sensitivity (default 0.2). Raised to absorb sub-pixel AA/raster
      // jitter in the filter-heavy crests (feTurbulence-baked poses rasterize with a
      // few LSB of edge noise run-to-run — enough to intermittently breach the 1.7%
      // soul floor at the default threshold). A real regression (theme inversion,
      // grain→black, a pose drift) moves pixels FAR past 0.3, so the gate keeps its
      // bite; this only stops raster noise from being counted as a divergent pixel.
      threshold: 0.3,
      // Capture at true device pixels (DPR2), not CSS pixels.
      scale: 'device',
      // Fast-forward CSS transitions/animations; PRM already froze the JS boil beat.
      animations: 'disabled',
      caret: 'hide',
    },
  },
  // Goldens land at e2e/goldens/<name>-<platform>.png — per-OS by construction
  // (font hinting + AA differ darwin/linux, so a shared golden would false-red).
  snapshotPathTemplate: '{testDir}/goldens/{arg}-{platform}{ext}',
  fullyParallel: true,
  // A missing baseline must fail loudly, never silently write-and-pass (the exact
  // vacuous-green this wave kills). CI never auto-creates a baseline.
  retries: 0,
  globalSetup: './e2e/global-setup.ts',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: externalBase || 'http://localhost:3000',
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
    screenshot: 'only-on-failure',
    // Pin the color profile so goldens rasterize to reproducible bytes across machines
    // (a display-P3 vs sRGB mismatch would shift every pixel). The frozen wobble filters
    // bake an feTurbulence field whose high-frequency output (the toggle sparkles) still
    // relocates a few px run-to-run regardless of raster backend — the toggle goldens
    // crop to the stable disc/body core to exclude it (see visual-golden.spec.ts).
    launchOptions: { args: ['--force-color-profile=srgb'] },
  },
  // When an external app server is provided (PLAYWRIGHT_BASE_URL — the 418x preview
  // convention, or host.docker.internal for the linux re-baseline), do NOT spawn one
  // on :3000. Only fall back to the dev server when no external base is given.
  webServer: externalBase
    ? undefined
    : { command: 'npm run dev', port: 3000, reuseExistingServer: true },
});
