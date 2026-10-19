import { defineConfig } from "@playwright/test";
// ACC-FIVE pass-9 scratch runner: the tree's e2e/, BASE from env, no webServer (never touches :3000).
export default defineConfig({
  testDir: process.env.TESTDIR ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend/e2e",
  outputDir: process.env.PWOUT ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/ACC-FIVE/pw-out",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "line",
  timeout: 900000,
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: { baseURL: process.env.BASE, viewport: { width: 1280, height: 800 } },
});
