import { defineConfig } from "@playwright/test";
const dpr = Number(process.env.CR_DPR || 3);
const dir = process.env.CR_DIR || "../e2e";
const match = new RegExp(process.env.CR_MATCH || "peer-walk\\.spec\\.ts$");
export default defineConfig({
  timeout: 3600000, expect: { timeout: 20000 }, fullyParallel: false, workers: 1, retries: 0, reporter: "list",
  outputDir: process.env.CR_OUT || "./test-results",
  projects: ["chromium", "webkit"].map((b) => ({ name: b, testDir: dir, testMatch: match, use: { browserName: b as "chromium" | "webkit" } })),
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4236", viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr, screenshot: "off" },
});
