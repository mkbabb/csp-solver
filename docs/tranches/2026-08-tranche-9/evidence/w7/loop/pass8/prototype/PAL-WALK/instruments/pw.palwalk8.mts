// PAL-WALK pass-8 scratch config (moved out before return). baseURL = the lane's dev server; dpr from env.
import { defineConfig } from "@playwright/test";
const dpr = Number(process.env.WALK_DPR || 2);
const m = new RegExp(process.env.WALK_MATCH || "peer-walk\\.spec\\.ts$");
const dir = process.env.WALK_DIR || "../e2e";
export default defineConfig({
  timeout: 3600000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: process.env.WALK_OUT || "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk8/test-results",
  projects: [
    { name: "chromium", testDir: dir, testMatch: m, use: { browserName: "chromium" } },
    { name: "webkit", testDir: dir, testMatch: m, use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4244",
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: dpr,
    screenshot: "off",
  },
});
