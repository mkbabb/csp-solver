import { defineConfig } from "@playwright/test";
const dpr = Number(process.env.CR_DPR || 1);
const dir = process.env.CR_DIR!;
const match = new RegExp(process.env.CR_MATCH || "peer-tin\\.spec\\.ts$");
export default defineConfig({
  timeout: 1800000, expect: { timeout: 20000 }, fullyParallel: false, workers: 1, retries: 0,
  reporter: "list", outputDir: process.env.CR_OUT || "/tmp/x",
  projects: [
    { name: "chromium", testDir: dir, testMatch: match, use: { browserName: "chromium" } },
    { name: "webkit", testDir: dir, testMatch: match, use: { browserName: "webkit" } },
  ],
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL, viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr, screenshot: "off", trace: "off" },
});
