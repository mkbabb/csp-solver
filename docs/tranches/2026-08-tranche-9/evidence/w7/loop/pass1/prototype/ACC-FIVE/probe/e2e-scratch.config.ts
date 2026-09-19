import { defineConfig } from "@playwright/test";

/**
 * ACC-FIVE prototype · scratch e2e config. The estate's default config boots :3000 through
 * a `webServer` block and a `globalSetup` that asserts the SPA on it; this lane's dev server
 * is :4236 and nothing here starts or stops a server. Same two engines, same viewport.
 */
export default defineConfig({
  testDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-42/web/frontend/e2e",
  timeout: 60000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4236",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
