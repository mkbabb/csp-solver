import { defineConfig } from "@playwright/test";

/**
 * CTRL-COST pass-1 SCRATCH CONFIG. Read-only on the product.
 * No `webServer` (the estate's default starts :3000, which this lane may not touch), no
 * `globalSetup`, no goldens. baseURL is this lane's own dev server on 4233, bound to 127.0.0.1.
 * Both engines, headless.
 */
export default defineConfig({
  testDir: ".",
  timeout: 180000,
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
