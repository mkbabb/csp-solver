import { defineConfig } from "@playwright/test";

/**
 * NOTE-LEDGER pass-1 PROTOTYPE config. A copy of the estate's default MINUS the webServer
 * (which starts :3000) and MINUS globalSetup, pointed at THIS lane's worktree dev server.
 * The charter names :4243; it was taken by a sibling lane, so this build runs on 4236 (the
 * next free port in the loop's 4230-4249 band). Never a product file, never in CI.
 */
export default defineConfig({
  testDir: ".",
  testMatch: /.*\.proto\.ts$/,
  timeout: 180000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4236",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
