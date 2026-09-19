import { defineConfig } from "@playwright/test";

/**
 * CTRL-FACE pass-1 — the ESTATE's own specs, run against this lane's dev server. A copy of
 * `playwright.config.ts` with `webServer` and `globalSetup` dropped (the estate's default starts
 * :3000, which this lane may not touch) and the baseURL pointed at 4235. Nothing else moves:
 * same testDir, same two projects, same timeouts.
 */
export default defineConfig({
  testDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-34/web/frontend/e2e",
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4235",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
