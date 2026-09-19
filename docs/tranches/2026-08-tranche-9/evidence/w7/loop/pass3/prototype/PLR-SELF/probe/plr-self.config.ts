// PLR-SELF pass-2 PROTOTYPE config. Copied from web/frontend/playwright.config.ts, webServer
// dropped, baseURL pinned to this lane's own server on the charter's port (4241). Never the
// estate's default — that one starts :3000.
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: __dirname,
  testMatch: /p2-.*\.spec\.ts$/,
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
    baseURL: "http://127.0.0.1:4241",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
