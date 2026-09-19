import { defineConfig } from "@playwright/test";

/**
 * CTRL-COST PROTOTYPE SCRATCH CONFIG — the lane's own, never the estate's default (that one
 * starts :3000). No `webServer`: the worktree's vite is already up on 4233, bound to
 * 127.0.0.1. Both engines, no goldens, no globalSetup.
 */
export default defineConfig({
  testDir: ".",
  timeout: 120000,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4233",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
