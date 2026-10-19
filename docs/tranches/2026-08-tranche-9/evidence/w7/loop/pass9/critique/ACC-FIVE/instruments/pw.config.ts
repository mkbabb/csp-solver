import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: process.env.TESTDIR ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-ACC-FIVE/tree/web/frontend/e2e",
  outputDir: process.env.PWOUT ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-ACC-FIVE/pw-out",
  fullyParallel: false, workers: 1, retries: 0, reporter: "line", timeout: 300000,
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: { baseURL: process.env.BASE, viewport: { width: 1280, height: 800 } },
});
