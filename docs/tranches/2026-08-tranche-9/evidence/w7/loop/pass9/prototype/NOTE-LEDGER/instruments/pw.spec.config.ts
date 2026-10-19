import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: process.env.SPEC_DIR,
  timeout: 900000, retries: 0, workers: 2, reporter: "list",
  outputDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-LEDGER/pw-out",
  projects: [ { name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } } ],
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL, viewport: { width: 1280, height: 800 } },
});
