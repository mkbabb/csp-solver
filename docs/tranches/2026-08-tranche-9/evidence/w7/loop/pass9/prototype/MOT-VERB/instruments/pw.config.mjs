import { defineConfig } from "@playwright/test";
// MOT-VERB pass-9 scratch config: the tree's own e2e specs against a served dist (no webServer).
export default defineConfig({
  testDir: process.env.VERB_TESTDIR || "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend/e2e",
  testMatch: new RegExp(process.env.VERB_MATCH || "fold-verb\\.spec\\.ts"),
  outputDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB/pw-out",
  reporter: "list",
  workers: 1,
  retries: 0,
  timeout: 180000,
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
