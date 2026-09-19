// PLR-SELF pass-3 CRITIC's playwright config. Copied from web/frontend/playwright.config.ts,
// webServer dropped, baseURL pinned to the critic's own server (4238). Banked in the critique's
// evidence dir; it RUNS from here because @playwright/test resolves from the config's directory.
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: __dirname,
  testMatch: /c3-.*\.spec\.ts$/,
  timeout: 180000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: "http://127.0.0.1:4238",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
