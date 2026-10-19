import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-LADDER/spec",
  testMatch: /ladder9-behave\.spec\.mjs/,
  outputDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-LADDER/pw-out",
  reporter: "list",
  workers: 1,
  timeout: 120000,
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
