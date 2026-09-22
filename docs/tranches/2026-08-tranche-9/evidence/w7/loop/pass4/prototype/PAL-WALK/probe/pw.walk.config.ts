// PAL-WALK pass-4 scratch config (deleted before return): the lane's own servers, both engines,
// dpr 3 so the ring's 4px stroke is photographed at the density the band is pinned on.
import { defineConfig } from "@playwright/test";
const use = (browserName: "chromium" | "webkit") => ({ browserName });
export default defineConfig({
  timeout: 900000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: "./test-results",
  projects: [
    { name: "chromium", testDir: "../e2e", testMatch: /peer-walk\.spec\.ts$/, use: use("chromium") },
    { name: "webkit", testDir: "../e2e", testMatch: /peer-walk\.spec\.ts$/, use: use("webkit") },
    { name: "probe-chromium", testDir: ".", testMatch: /pal-walk-.*\.spec\.ts$/, use: use("chromium") },
    { name: "probe-webkit", testDir: ".", testMatch: /pal-walk-.*\.spec\.ts$/, use: use("webkit") },
    { name: "r2-chromium", testDir: "./r2", testMatch: /accent-kinship\.spec\.ts$/, use: use("chromium") },
    { name: "r2-webkit", testDir: "./r2", testMatch: /accent-kinship\.spec\.ts$/, use: use("webkit") },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4244",
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 3,
    screenshot: "off",
  },
});
