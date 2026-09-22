// PAL-TIN pass-4 CRITIC scratch config (deleted before return). No webServer; baseURL from env.
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: process.env.TC_DIR || "../e2e",
  testMatch: new RegExp(process.env.TC_MATCH || "peer-tin\\.spec\\.ts$"),
  timeout: 180000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: "./test-results",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4247",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
