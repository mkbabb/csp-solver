// PAL-TIN pass-8 CRITIC playwright config, OUTSIDE the project root (no Tailwind scan).
import { defineConfig } from "@playwright/test";
const dpr = Number(process.env.TIN_DPR || 1);
export default defineConfig({
  timeout: 2400000, expect: { timeout: 20000 }, fullyParallel: false, workers: 1, retries: 0, reporter: "list",
  outputDir: process.env.TIN_OUT || "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critic-tin8/pw-out/default",
  projects: [
    { name: "chromium", testDir: process.env.TIN_DIR || "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2/web/frontend/e2e", testMatch: new RegExp(process.env.TIN_MATCH || "peer-tin\\.spec\\.ts$"), use: { browserName: "chromium" } },
    { name: "webkit", testDir: process.env.TIN_DIR || "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2/web/frontend/e2e", testMatch: new RegExp(process.env.TIN_MATCH || "peer-tin\\.spec\\.ts$"), use: { browserName: "webkit" } },
  ],
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4245", viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr, screenshot: "off", trace: "off" },
});
