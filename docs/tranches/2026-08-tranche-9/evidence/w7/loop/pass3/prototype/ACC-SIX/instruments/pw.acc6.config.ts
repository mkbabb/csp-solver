import { defineConfig } from "@playwright/test";

// ACC-SIX pass-3 SCRATCH config (not for landing — banked as an instrument under
// pass3/prototype/ACC-SIX/instruments/). No `webServer`: the lane's own static server on
// :4239 serves the dist built inside this worktree. Both engines, the estate's own default
// viewport, so `filter-census.spec.ts` reads the ROW regime it states.
export default defineConfig({
  testDir: "./e2e",
  timeout: 60000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: "http://127.0.0.1:4239",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
