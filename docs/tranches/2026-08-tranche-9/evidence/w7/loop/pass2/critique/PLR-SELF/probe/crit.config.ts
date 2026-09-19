// CRITIC's scratch PW config. Copied from web/frontend/playwright.config.ts, webServer dropped.
// Absolute URLs in the spec, so no baseURL: the probe drives two servers (4245 proto, 4246 head).
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: __dirname,
  testMatch: /c-.*\.spec\.ts$/,
  timeout: 70000,
  expect: { timeout: 12000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: { viewport: { width: 1280, height: 800 }, screenshot: "off" },
});
