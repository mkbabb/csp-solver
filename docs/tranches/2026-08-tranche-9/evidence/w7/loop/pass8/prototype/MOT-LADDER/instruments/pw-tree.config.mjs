import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend/e2e",
  testMatch: /(ladder-prm|live-fit-ablation)\.spec\.ts/,
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ladder8/pw-out-tree",
  reporter: "list",
  workers: 2,
  timeout: 60000,
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
