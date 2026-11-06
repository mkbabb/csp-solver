import { defineConfig } from "@playwright/test";
// MOT-LADDER pass 10 · the reveal's computed clock on a served dist (the pass-9 critic's spec, copied whole)
export default defineConfig({
  testDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-MOT-LADDER/pw",
  testMatch: /critx\.spec\.mjs/,
  outputDir: process.env.CL9_PWOUT,
  reporter: "list",
  workers: 1,
  retries: 0,
  timeout: 150000,
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
