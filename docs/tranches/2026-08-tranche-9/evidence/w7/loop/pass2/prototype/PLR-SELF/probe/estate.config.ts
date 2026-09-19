// The ESTATE's roster-touching specs, on this lane's own server. Copied from
// web/frontend/playwright.config.ts, webServer dropped, baseURL pinned to :4241. This closes
// pass 1's §3.4 gap: five specs address the roster's drawn grammar and none had been run.
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-52/web/frontend/e2e",
  testMatch:
    /(join-language|join-language-prm|presence|session-substrate|player-mark)\.spec\.ts$/,
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
    baseURL: "http://127.0.0.1:4241",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
