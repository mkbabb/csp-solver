import { defineConfig } from "@playwright/test";

/**
 * The ESTATE's own specs, pointed at the MRK-LIVE prototype server. A copy of
 * `playwright.config.ts` minus the webServer (which boots :3000, a foreign port here) and
 * minus the globalSetup (it re-asserts the SPA on :3000's baseURL). Nothing else changes.
 */
export default defineConfig({
  testDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-44/web/frontend/e2e",
  testIgnore: [
    /visual-golden\.spec\.ts$/,
    /throttled-void\.spec\.ts$/,
    /filter-census\.spec\.ts$/,
    /wordmark-integrity\.spec\.ts$/,
    /theme-bake-freshness\.spec\.ts$/,
    /theme-quadrants\.spec\.ts$/,
  ],
  timeout: 60000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 2,
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
