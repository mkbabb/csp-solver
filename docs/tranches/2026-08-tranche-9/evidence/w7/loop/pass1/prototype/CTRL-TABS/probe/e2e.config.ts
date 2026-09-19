import { defineConfig } from "@playwright/test";

/**
 * CTRL-TABS pass-1 SCRATCH CONFIG — a copy of the estate's default with the `webServer`
 * dropped (the default starts :3000, which this lane may not touch) and the baseURL pointed at
 * the lane's own dev server on 4238. Both engines, no goldens, no globalSetup.
 */
export default defineConfig({
  testDir: "../e2e",
  timeout: 90000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4238",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
    trace: "off",
  },
});
