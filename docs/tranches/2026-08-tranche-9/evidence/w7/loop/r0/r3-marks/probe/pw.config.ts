import { defineConfig } from "@playwright/test";

/**
 * R3 (THE MARKS) round-zero scratch config. Copy of the estate's default MINUS the
 * webServer (which starts :3000) and MINUS the globalSetup, pointed at this lane's own
 * dev server on 127.0.0.1:4252. Nothing here is a product file; it never runs in CI.
 */
export default defineConfig({
  testDir: ".",
  testMatch: /.*\.probe\.ts$/,
  timeout: 60000,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4252",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
