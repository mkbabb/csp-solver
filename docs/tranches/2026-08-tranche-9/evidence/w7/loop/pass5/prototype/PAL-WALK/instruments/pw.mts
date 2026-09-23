// PAL-WALK pass-5 scratch config (deleted before return). baseURL = the lane's dev server; dpr from env.
import { defineConfig } from "@playwright/test";
const dpr = Number(process.env.WALK_DPR || 3);
export default defineConfig({
  timeout: 3600000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: process.env.WALK_OUT || "./test-results",
  projects: [
    { name: "chromium", testDir: process.env.WALK_DIR || "../e2e", testMatch: new RegExp(process.env.WALK_MATCH || "peer-walk\\.spec\\.ts$"), use: { browserName: "chromium" } },
    { name: "webkit", testDir: process.env.WALK_DIR || "../e2e", testMatch: new RegExp(process.env.WALK_MATCH || "peer-walk\\.spec\\.ts$"), use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4244",
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: dpr,
    screenshot: "off",
  },
});
