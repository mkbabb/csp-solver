import { defineConfig } from "@playwright/test";

/** MRK-LIVE pass 3 — the ESTATE's own specs, run against this lane's server on 4238. A copy of
 *  `playwright.config.ts` MINUS the webServer (which boots :3000) and MINUS globalSetup. The
 *  testDir is the WORKTREE's e2e, so a spec this prototype moved runs in its moved form. */
export default defineConfig({
  testDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e",
  timeout: 45000,
  expect: { timeout: 12000 },
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4238",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
