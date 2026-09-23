// The estate's playwright.config.ts rows, webServer struck, baseURL from PLAYWRIGHT_BASE_URL; TESTDIR
// picks the tree's or the control's e2e/ (read-only), MATCH the ONE spec file run whole.
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: process.env.TESTDIR ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend/e2e",
  testMatch: new RegExp(process.env.MATCH ?? "NONE"),
  timeout: Number(process.env.TIMEOUT ?? 30000), expect: { timeout: 10000 }, fullyParallel: true, retries: 0, workers: 2,
  reporter: "list", outputDir: process.env.PWOUT ?? "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6/pw-estate",
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } }],
  globalSetup: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend/e2e/global-setup.ts",
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL, viewport: { width: 1280, height: 800 }, screenshot: "off" },
});
