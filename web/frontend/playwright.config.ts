import { defineConfig } from "@playwright/test";

// Five specs run under their own configs, NOT this default (dev-server) suite:
//  · visual-golden — committed pixel goldens are per-OS; sweeping them here would red a
//    linux seal run against darwin baselines (playwright-golden.config.ts).
//  · throttled-void — the F3 flake: the lazy Futoshiki chunk is a per-module ESM waterfall
//    on the dev server (~13 s recovery, compounds past budget on a loaded runner). It runs
//    against a bundled preview build instead (playwright-throttle.config.ts / test:e2e:throttle).
//  · filter-census — P1 G3.1/G3.2: the live-filter budget is an exact-match allowlist against
//    the BUILT dist (the artifact that deploys), so it rides the same bundled-preview config.
//  · wordmark-integrity — P1 G3.4: asserts over the BAKED pose bitmaps in WebKit; the
//    defects it guards are WebKit's own. Same bundled-preview config.
//  · theme-bake-freshness — P1-W4 G4.5: also asserts over the BAKED pose bitmaps, in both
//    engines, so it rides the same bundled-preview config against the artifact that deploys.
//
// Held at file scope because a PROJECT's `testIgnore` REPLACES the top-level one rather than
// merging with it — the webkit project below must carry these five itself or it re-runs the
// four configs' worth of specs this suite deliberately does not own.
const OTHER_CONFIGS = [
  /visual-golden\.spec\.ts$/,
  /throttled-void\.spec\.ts$/,
  /filter-census\.spec\.ts$/,
  /wordmark-integrity\.spec\.ts$/,
  /theme-bake-freshness\.spec\.ts$/,
];

export default defineConfig({
  testDir: "./e2e",
  testIgnore: OTHER_CONFIGS,
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: 0,
  // TWO ENGINES, not one. Until T4-P1 this config declared no `projects` and no `browserName`,
  // so the whole suite ran Playwright's default (chromium) and every WebKit-shaped defect it
  // already asserts over was invisible: the deck's LAST CARD was unreachable in Safari for the
  // life of the carousel, and `gallery-deal.spec.ts` held the assertion that catches it the
  // entire time (T4-P1 KENKEN-REACHABILITY — 8 of its 17 went red the first hour webkit ran).
  // Only the built-dist config named webkit, and only for the baked-bitmap specs.
  //
  // SCOPE, MEASURED not assumed. The whole suite was run in webkit before this scope was
  // written: 114 of 115 pass in 34.7 s (chromium 115/115 in ~20 s), so the second engine is
  // affordable at full width and it runs at full width. Two files are held out, each for a
  // reason that is not the app's:
  //  · `mobile-*.spec.ts` pin `browserName: chromium` at FILE scope (the iPhone/iPad
  //    descriptors default to webkit, which the historical chromium-only lane did not
  //    install) — under a webkit project they would re-run as exact chromium duplicates.
  //  · `share-truth.spec.ts` needs `grantPermissions(['clipboard-read','clipboard-write'])`,
  //    and Playwright's WebKit has no such permission ("Unknown permission: clipboard-write").
  //    A Playwright API gap, not a product row: the spec asserts a REAL clipboard write and
  //    there is no honest way to grant one there.
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    {
      name: "webkit",
      use: { browserName: "webkit" },
      testIgnore: [...OTHER_CONFIGS, /mobile-.*\.spec\.ts$/, /share-truth\.spec\.ts$/],
    },
  ],
  // Assert-the-SPA before any spec runs (R-11b/K46): fail loudly if baseURL is
  // pointed at Vite's HMR socket (:3000 → 426) instead of the app. See global-setup.ts.
  globalSetup: "./e2e/global-setup.ts",
  use: {
    // baseURL must target the *app* port. `server.port` is pinned to 3000 in
    // vite.config.ts; if you move the app with `vite --port <n>`, set
    // PLAYWRIGHT_BASE_URL to match (the HMR socket does NOT follow — K46).
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    viewport: { width: 1280, height: 800 },
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: true,
  },
});
