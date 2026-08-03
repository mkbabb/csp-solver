import { defineConfig } from "@playwright/test";

// Six specs run under their own configs, NOT this default (dev-server) suite:
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
//  · theme-quadrants — T7-W1 G1.2: the four-quadrant ink identity asserts over the SHIPPED
//    stylesheet's selectors, so it rides the bundled-preview config, both engines.
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
  /theme-quadrants\.spec\.ts$/,
];

export default defineConfig({
  testDir: "./e2e",
  testIgnore: OTHER_CONFIGS,
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: 0,
  // T7-W3 (burst-forensics §5): a red default-suite run used to bank NO machine-readable
  // report — the HTML uploads belong to the built-dist configs, so a default red survived
  // as one log line and the forensics had to re-derive rosters from step text. In CI the
  // suite emits e2e-report.json beside the line reporter; ci.yml uploads it on failure
  // from the chromium job and each webkit shard.
  reporter: process.env.CI
    ? [["line"], ["json", { outputFile: "e2e-report.json" }]]
    : "list",
  // TWO ENGINES, not one. Until T4-P1 this config declared no `projects` and no `browserName`,
  // so the whole suite ran Playwright's default (chromium) and every WebKit-shaped defect it
  // already asserts over was invisible: the deck's LAST CARD was unreachable in Safari for the
  // life of the carousel, and `gallery-deal.spec.ts` held the assertion that catches it the
  // entire time (T4-P1 KENKEN-REACHABILITY — 8 of its 17 went red the first hour webkit ran).
  // Only the built-dist config named webkit, and only for the baked-bitmap specs.
  //
  // SCOPE, MEASURED not assumed. T4-P1 ran the whole suite in webkit before this scope was
  // written: 114 of 115 passed in 34.7 s (chromium 115/115 in ~20 s), so the second engine is
  // affordable at full width and it runs at full width.
  //
  // T5-W1 1.10 / CH-56 — the last engine residue closes here. `mobile-*.spec.ts` were held out
  // of webkit for an INFRASTRUCTURE reason that has since expired: the iPhone/iPad descriptors
  // default to webkit, the then chromium-only CI lane installed no webkit, so both files pinned
  // `browserName: chromium` at FILE scope — under a webkit project they would have re-run as
  // exact chromium duplicates. CI installs webkit now (`ci.yml`: `npx playwright install
  // --with-deps chromium webkit`), the file-scope pins are gone, and 19 mobile tests run in both
  // engines instead of one. Playwright's WebKit honours every mobile-emulation affordance those
  // specs reach — isMobile, hasTouch, deviceScaleFactor, the descriptor viewport,
  // `(pointer: coarse)` / `(hover: none)`, `tap()`, `addInitScript`, and a redefinable
  // `window.visualViewport` — all measured, not assumed (evidence/w1/pw-residue.txt §1-§2).
  // What it does NOT honour is recorded there with the same API cites, and neither limit is
  // reached by these files: `page.mouse.wheel` throws "Mouse wheel is not supported in mobile
  // WebKit" (no mobile spec wheels), and `navigator.maxTouchPoints` reads 0 under emulation
  // where Chromium reports 1 (no spec reads it). Two computed-style reads DID diverge and are
  // now engine-honest at their assertion sites, cited there.
  //
  // ONE file stays held out of webkit, and it is an API gap rather than a scope choice:
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    {
      name: "webkit",
      use: { browserName: "webkit" },
      // share-truth.spec.ts:65 needs `grantPermissions(['clipboard-read','clipboard-write'])`
      // and Playwright's WebKit has no such permission: `browserContext.grantPermissions:
      // Unknown permission: clipboard-write` (re-measured at @playwright/test 1.61.1 —
      // evidence/w1/pw-residue.txt §1). A Playwright API gap, not a product row: the spec
      // asserts a REAL clipboard write (`navigator.clipboard.readText()`, :76) and there is no
      // honest way to grant one there. Re-audition it whenever PW-WebKit gains the permission.
      // scripts/check-pw-projects.mjs pins this hold-out as the ONLY one so it cannot grow.
      testIgnore: [...OTHER_CONFIGS, /share-truth\.spec\.ts$/],
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
