import { defineConfig } from "@playwright/test";
// NOTE-LEDGER pass-6 scratch probe config (absolute URLs, no webServer). Moved out at return.
export default defineConfig({
  testDir: ".",
  testMatch: /wire6\.probe\.ts$/,
  timeout: 180000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger6b/pw-out",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
