import { defineConfig } from "@playwright/test";
// NOTE-ERASE pass-10 scratch probes (out-of-tree copy, never banked). No webServer; ports named in each probe.
export default defineConfig({
  testDir: ".",
  testMatch: /\.probe\.ts$/,
  timeout: 240000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE/pw-out-probe",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
