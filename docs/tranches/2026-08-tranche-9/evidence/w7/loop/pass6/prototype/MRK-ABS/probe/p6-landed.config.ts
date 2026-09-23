import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: process.env.E2E ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/web/frontend/e2e", testMatch: new RegExp(process.env.MATCH ?? "focus-ring\\.spec\\.ts$"), timeout: 420000, expect: { timeout: 10000 },
  fullyParallel: false, workers: 1, retries: 0, reporter: "line",
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrkabs6-pw-landed-" + (process.env.TAG ?? "x"),
  use: { baseURL: process.env.BASE ?? "http://127.0.0.1:4239", viewport: { width: 1280, height: 800 }, screenshot: "off", trace: "off" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } }],
});
