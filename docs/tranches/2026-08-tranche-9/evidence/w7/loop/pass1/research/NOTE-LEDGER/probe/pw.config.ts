import { defineConfig } from "@playwright/test";

/**
 * NOTE-LEDGER (T9-W7 §7) pass-1 scratch config. Copy of the estate's default MINUS the
 * webServer (which starts :3000) and MINUS globalSetup, pointed at this lane's own dev
 * server. The charter names :4250; the wave's laws reserve 4250-4260 for the concurrent W8
 * lanes and hand this loop 4230-4249, so this lane runs on the next free port in that band
 * (4232/4247 were already taken by sibling lanes when this ran). Never a product file,
 * never in CI.
 */
export default defineConfig({
  testDir: ".",
  testMatch: /.*\.probe\.ts$/,
  timeout: 120000,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4243",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
