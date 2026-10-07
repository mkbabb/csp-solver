import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ladder8/spec",
  testMatch: /ladder8-behave\.spec\.mjs/,
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ladder8/pw-out-behave",
  reporter: "list",
  workers: 2,
  timeout: 60000,
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
