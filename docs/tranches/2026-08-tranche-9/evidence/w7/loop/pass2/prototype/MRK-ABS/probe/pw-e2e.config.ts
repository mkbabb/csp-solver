import { defineConfig } from "@playwright/test";

/**
 * The estate's e2e suites against THIS LANE's dev server — the estate's own config MINUS the
 * webServer (which starts :3000) and MINUS the globalSetup, with baseURL on 4239. Scratch only.
 */
export default defineConfig({
  testDir: "../e2e",
  timeout: 45000,
  expect: { timeout: 12000 },
  fullyParallel: false,
  workers: 2,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4239",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
