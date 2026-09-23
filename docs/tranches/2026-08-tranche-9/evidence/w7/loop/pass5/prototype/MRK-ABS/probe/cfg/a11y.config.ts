// Scratch: the estate's a11y suites (a11y, access, spoken-gallery, spoken-controls) against a served dist, both engines. BASE picks the arm. Deleted before return.
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/web/frontend/e2e", testMatch: /(a11y|access|spoken-gallery|spoken-controls)\.spec\.ts$/, timeout: 120000, expect: { timeout: 10000 },
  fullyParallel: false, workers: 2, retries: 0, reporter: "line",
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/pw-a11y",
  use: { baseURL: process.env.BASE ?? "http://127.0.0.1:4239", viewport: { width: 1280, height: 800 }, screenshot: "off", trace: "off" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } }],
});
