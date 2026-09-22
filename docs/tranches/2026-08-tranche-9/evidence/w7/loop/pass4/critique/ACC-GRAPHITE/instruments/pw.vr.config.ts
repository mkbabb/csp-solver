import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend/e2e", testMatch: /visual-regression\.spec\.ts$/, timeout: 60000, workers: 2, retries: 0,
  reporter: [["list"]], outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg-crit/pw-vr",
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } }],
  use: { baseURL: process.env.BASE, viewport: { width: 1280, height: 800 } },
});
