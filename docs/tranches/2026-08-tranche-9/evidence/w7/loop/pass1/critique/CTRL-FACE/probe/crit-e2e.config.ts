// CRITIC scratch config — the ESTATE's own specs against the critic's own server (127.0.0.1:4242).
// A copy of the estate's playwright.config.ts with webServer + globalSetup dropped (the default
// starts :3000, which this lane may not touch). `@playwright/test` is imported by absolute path
// because this file lives outside the package that owns node_modules.
import { defineConfig } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@playwright/test/index.js";

export default defineConfig({
  testDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-34/web/frontend/e2e",
  timeout: 45000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  workers: 4,
  retries: 0,
  reporter: [["list"]],
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4242",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
