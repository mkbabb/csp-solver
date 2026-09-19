import { defineConfig } from "@playwright/test";

/** NOTE-LEDGER pass-1 CRITIQUE config. Copy of the estate's default minus webServer and
 *  globalSetup, pointed at the critic's own worktree dev server on :4244. Never in CI. */
export default defineConfig({
  testDir: ".",
  testMatch: /.*\.crit\.ts$/,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4244",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
