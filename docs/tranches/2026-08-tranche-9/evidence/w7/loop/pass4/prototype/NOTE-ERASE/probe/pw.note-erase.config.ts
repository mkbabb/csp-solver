import { defineConfig } from "@playwright/test";

/** NOTE-ERASE (T9-W7 §7) pass-4 scratch config. The estate's default MINUS the webServer
 *  (which starts :3000) and MINUS globalSetup, pointed at this lane's own dev server. Deleted
 *  before the lane returns; never a product file, never in CI. */
export default defineConfig({
  testDir: ".",
  testMatch: /.*\.(probe|spec)\.ts$/,
  timeout: 420000,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4248",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
