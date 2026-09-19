import { defineConfig } from "@playwright/test";

/** NOTE-LEDGER pass-2 CRITIQUE scratch config: the estate's default minus webServer and
 *  globalSetup, on the critic's own port 4237. Never a product file, never in CI. */
export default defineConfig({
  testDir: ".",
  testMatch: /.*\.probe\.ts$/,
  timeout: 150000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4237",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
