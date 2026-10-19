import { defineConfig, devices } from "@playwright/test";
const S = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-MOT-LADDER";
export default defineConfig({
  testDir: `${S}/spec`,
  testMatch: /critl9\.spec\.mjs/,
  outputDir: `${S}/pw-out`,
  reporter: "list",
  workers: 1,
  timeout: 150000,
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
