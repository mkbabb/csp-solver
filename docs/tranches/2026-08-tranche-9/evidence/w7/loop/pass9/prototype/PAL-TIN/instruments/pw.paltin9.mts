// PAL-TIN pass-9 scratch Playwright config (never banked). baseURL/dpr/match/out from env.
import { defineConfig } from "@playwright/test";
const dpr = Number(process.env.TIN_DPR || 1);
const match = new RegExp(process.env.TIN_MATCH || "peer-tin\\.spec\\.ts$");
export default defineConfig({
  timeout: 2400000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: process.env.TIN_OUT || "$SCRATCH/pw-out/default",
  projects: [
    { name: "chromium", testDir: process.env.TIN_TESTDIR || "$WORKTREES/wf_308fa864-c94-2/web/frontend/e2e", testMatch: match, use: { browserName: "chromium" } },
    { name: "webkit", testDir: process.env.TIN_TESTDIR || "$WORKTREES/wf_308fa864-c94-2/web/frontend/e2e", testMatch: match, use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4245",
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: dpr,
    screenshot: "off",
    trace: "off",
  },
});
