// PAL-TIN pass-7 CRITIC scratch config (lives in the scratch archive, never the tree)
import { defineConfig } from "@playwright/test";
export default defineConfig({
  timeout: 1800000, expect: { timeout: 20000 }, fullyParallel: false, workers: 1, retries: 0, reporter: "list",
  outputDir: process.env.TC_OUT || "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tincrit7/out/default",
  projects: [
    { name: "chromium", testDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2/web/frontend/e2e", testMatch: /peer-tin\.spec\.ts$/, use: { browserName: "chromium" } },
    { name: "webkit", testDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2/web/frontend/e2e", testMatch: /peer-tin\.spec\.ts$/, use: { browserName: "webkit" } },
  ],
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL, viewport: { width: 1280, height: 800 }, deviceScaleFactor: Number(process.env.TC_DPR || 1), screenshot: "off", trace: "off" },
});
