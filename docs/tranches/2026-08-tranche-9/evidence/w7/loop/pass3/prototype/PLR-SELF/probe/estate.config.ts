// The ESTATE's roster-touching specs, on this lane's own server. Copied from
// web/frontend/playwright.config.ts, webServer dropped, baseURL pinned to :4241. Pass 3 adds
// the three the pass-2 critique named as unrun — `multiplayer` (which holds the one assertion
// that could flip), `access` and `follow-still-authorship`.
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-51/web/frontend/e2e",
  testMatch:
    /(join-language|join-language-prm|multiplayer|access|follow-still-authorship|presence|session-substrate|player-mark)\.spec\.ts$/,
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
