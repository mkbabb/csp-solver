import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend/.accg5",
  testMatch: process.env.MATCH ?? "**/*.probe.ts",
  timeout: 170_000, workers: 1, retries: 0, reporter: [["list"]],
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg5/pw-out",
  projects: [
    { name: "chromium", use: { browserName: "chromium", launchOptions: { args: ["--force-color-profile=srgb"] } } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
