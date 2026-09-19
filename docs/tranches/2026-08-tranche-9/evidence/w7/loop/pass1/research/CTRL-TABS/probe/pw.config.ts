import { defineConfig } from "@playwright/test";

/**
 * CTRL-TABS pass-1 scratch config. No `webServer` (the estate's default starts :3000,
 * which this lane may not touch), no globalSetup, no goldens. baseURL = the lane's own
 * dev server on 127.0.0.1:4232. Both engines.
 */
export default defineConfig({
  testDir: ".",
  timeout: 180000,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4232",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
