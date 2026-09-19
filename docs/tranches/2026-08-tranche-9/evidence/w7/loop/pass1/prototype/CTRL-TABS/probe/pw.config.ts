import { defineConfig } from "@playwright/test";

/**
 * R1 CENSUS SCRATCH CONFIG — round zero, read-only on the product.
 * No `webServer` (the estate's default starts :3000, which this lane may not touch);
 * baseURL points at the lane's own dev server on 4231, bound to 127.0.0.1.
 * Both engines, no goldens, no globalSetup.
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4231",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
