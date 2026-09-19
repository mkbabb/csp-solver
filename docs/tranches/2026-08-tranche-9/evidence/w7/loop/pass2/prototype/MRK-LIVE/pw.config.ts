import { defineConfig } from "@playwright/test";

/**
 * MRK-LIVE pass-2 PROTOTYPE config. The estate's default MINUS the webServer (which boots
 * :3000) and MINUS globalSetup, pointed at this lane's own dev server on 127.0.0.1:4238, which
 * serves the pass-2 prototype worktree (`wf_8630d340-e56-33`, uncommitted diff).
 * Nothing here is a product file; it never runs in CI.
 */
export default defineConfig({
  testDir: ".",
  testMatch: /.*\.probe\.ts$/,
  timeout: 240000,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4238",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
