import { defineConfig } from "@playwright/test";

/**
 * MRK-LIVE pass-2 CRITIQUE config. The estate's default minus webServer/globalSetup, pointed at
 * this lane's own dev server on 127.0.0.1:4241 (the prototype worktree wf_8630d340-e56-36).
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4241",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
