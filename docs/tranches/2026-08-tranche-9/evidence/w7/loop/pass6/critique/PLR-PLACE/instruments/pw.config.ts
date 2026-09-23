import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: process.env.TD ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend/e2e",
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plr-place-crit6/pw-out",
  timeout: 120000, expect: { timeout: 15000 }, fullyParallel: false, workers: 1, retries: 0, reporter: "list",
  use: { baseURL: `http://127.0.0.1:${process.env.PLC_PORT ?? "4238"}`, trace: "off" },
  projects: [ { name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } } ],
});
