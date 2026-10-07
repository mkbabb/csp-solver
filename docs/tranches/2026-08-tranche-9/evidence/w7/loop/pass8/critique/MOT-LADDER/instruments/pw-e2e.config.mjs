import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-ladder8/btree/web/frontend/e2e",
  testMatch: /(ladder-prm|live-fit-ablation)\.spec\.ts/,
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-ladder8/pw-out-e2e",
  reporter: "list",
  workers: 2,
  timeout: 90000,
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
