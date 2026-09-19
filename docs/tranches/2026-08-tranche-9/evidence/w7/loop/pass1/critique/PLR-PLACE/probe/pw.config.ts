// PLR-PLACE pass-1 CRITIQUE scratch config. Copy of web/frontend/playwright.config.ts with
// `webServer`/`globalSetup` dropped; baseURL pinned to THIS lane's own dev server (4248,
// --strictPort, serving the prototype worktree). Never the estate's default — that starts :3000.
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: __dirname,
  testMatch: /\.spec\.ts$/,
  timeout: 300000,
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
    baseURL: "http://127.0.0.1:4248",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
