import { defineConfig } from "@playwright/test";

/**
 * The estate's own specs, run against THIS lane's dev server. A copy of
 * `web/frontend/playwright.config.ts` minus the webServer (which starts :3000) and minus the
 * globalSetup (which asserts that same baseURL), pointed at 127.0.0.1:4240. Never runs in CI.
 */
export default defineConfig({
  testDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-45/web/frontend/e2e",
  timeout: 45000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: "http://127.0.0.1:4240",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
