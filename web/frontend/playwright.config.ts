import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  // Two specs run under their own configs, NOT this default (dev-server) suite:
  //  · visual-golden — committed pixel goldens are per-OS; sweeping them here would red a
  //    linux seal run against darwin baselines (playwright-golden.config.ts).
  //  · throttled-void — the F3 flake: the lazy Futoshiki chunk is a per-module ESM waterfall
  //    on the dev server (~13 s recovery, compounds past budget on a loaded runner). It runs
  //    against a bundled preview build instead (playwright-throttle.config.ts / test:e2e:throttle).
  testIgnore: [/visual-golden\.spec\.ts$/, /throttled-void\.spec\.ts$/],
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: 0,
  // Assert-the-SPA before any spec runs (R-11b/K46): fail loudly if baseURL is
  // pointed at Vite's HMR socket (:3000 → 426) instead of the app. See global-setup.ts.
  globalSetup: './e2e/global-setup.ts',
  use: {
    // baseURL must target the *app* port. `server.port` is pinned to 3000 in
    // vite.config.ts; if you move the app with `vite --port <n>`, set
    // PLAYWRIGHT_BASE_URL to match (the HMR socket does NOT follow — K46).
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    viewport: { width: 1280, height: 800 },
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },
});
