import { defineConfig } from "@playwright/test";

/**
 * CTRL-FACE pass-2 scratch e2e config. The estate's default starts its own :3000 server; this
 * one has no `webServer`, no `globalSetup`, and points at the lane's port. Both engines.
 * Untracked scratch, deleted before the lane returns.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 60000,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4234",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
    trace: "off",
  },
});
