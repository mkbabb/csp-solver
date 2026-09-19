import { defineConfig } from "@playwright/test";

/**
 * ACC-GRAPHITE pass-1 scratch config. NOT the estate's default (that one boots :3000 via a
 * webServer block + a globalSetup asserting the SPA). Points at this lane's own dev server
 * on 127.0.0.1:4237. testDir is the scratchpad copy of the banked probe sources.
 */
export default defineConfig({
  testDir: "./probe",
  testMatch: /.*\.probe\.ts$/,
  timeout: 240000,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4237",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
