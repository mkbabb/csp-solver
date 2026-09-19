import { defineConfig } from "@playwright/test";

/** MRK-LIVE pass-2 — the ESTATE's own specs, run against this lane's server on 4238. A copy of
 *  `playwright.config.ts` MINUS the webServer (which boots :3000) and MINUS globalSetup. */
export default defineConfig({
  testDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-36/web/frontend/e2e",
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
    baseURL: "http://127.0.0.1:4238",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
