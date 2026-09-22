// PAL-TIN pass-4 scratch Playwright config — no `webServer` (the lane runs its own on 4245),
// baseURL on the lane's charter port. Not a product file; removed before the lane returns.
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "../e2e",
  testMatch: /(peer-tin\.spec|tin4-frames\.scratch|tin4-probe\.scratch)\.ts$/,
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4245",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
