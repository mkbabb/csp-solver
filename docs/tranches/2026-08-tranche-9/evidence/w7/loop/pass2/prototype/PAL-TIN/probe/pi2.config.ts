// PAL-TIN pass-2 PROTOTYPE scratch config. A copy of web/frontend/playwright.config.ts with
// the webServer and globalSetup dropped and baseURL pinned to this lane's own dev server
// (127.0.0.1:4245). NEVER the estate's default — that one starts :3000.
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-58/web/frontend/tin2-spec",
  testMatch: /pi\.spec\.ts$/,
  timeout: 180000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4245",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
