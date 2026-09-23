// PAL-TIN pass-5 scratch config (deleted before return). baseURL/dpr/match/dir/out from env.
import { defineConfig } from "@playwright/test";
const dpr = Number(process.env.TIN_DPR || 1);
const dir = process.env.TIN_DIR || "../e2e";
const match = new RegExp(process.env.TIN_MATCH || "peer-tin\\.spec\\.ts$");
export default defineConfig({
  timeout: 1800000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: process.env.TIN_OUT || "/tmp/tin5-out",
  projects: [
    { name: "chromium", testDir: dir, testMatch: match, use: { browserName: "chromium" } },
    { name: "webkit", testDir: dir, testMatch: match, use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4245",
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: dpr,
    screenshot: "off",
    trace: "off",
  },
});
