import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "../e2e",
  testMatch: /ladder-prm\.spec\.ts/,
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-out/pw-prm",
  timeout: 120000, workers: 1, retries: 0, reporter: [["line"]],
  use: { baseURL: process.env.BASE },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
