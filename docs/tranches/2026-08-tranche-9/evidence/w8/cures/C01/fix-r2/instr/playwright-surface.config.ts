// T9-W8 §8.2 cure C01 repair r2 — SCRATCH config for the BAKED-BITMAP specs, which the
// estate runs under playwright-throttle.config.ts against a bundled preview. Same shape as
// `../../instr/playwright-cured.config.ts` (webServer dropped, baseURL pinned to the CURED
// preview on :4253) with the `testIgnore` list emptied, so the four specs that assert over
// the baked poses can be named on the command line and run in BOTH engines.
import { defineConfig } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend/node_modules/@playwright/test/index.js";

export default defineConfig({
  testDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend/e2e",
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  globalSetup:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend/e2e/global-setup.ts",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4253",
    viewport: { width: 1280, height: 800 },
    screenshot: "only-on-failure",
  },
});
