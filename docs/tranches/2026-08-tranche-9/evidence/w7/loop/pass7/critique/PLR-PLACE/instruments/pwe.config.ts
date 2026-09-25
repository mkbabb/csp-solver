import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "../e2e", testMatch: [/player-place\.spec\.ts$/],
  outputDir: process.env.CR_OUTDIR ?? "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit7plc-pwe-out",
  timeout: 150000, expect: { timeout: 15000 }, fullyParallel: false, workers: 1, retries: 0, reporter: "list",
  use: { baseURL: "http://127.0.0.1:4236", trace: "off" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } }],
});
