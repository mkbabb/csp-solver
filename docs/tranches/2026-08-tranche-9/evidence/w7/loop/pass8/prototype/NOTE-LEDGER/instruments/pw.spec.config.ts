import { defineConfig } from "@playwright/test";
// NOTE-LEDGER pass-8: run a product spec from the L8 copy against PLAYWRIGHT_BASE_URL (no webServer).
export default defineConfig({
  testDir: "../e2e",
  timeout: 300000,
  retries: 0,
  workers: 2,
  reporter: "list",
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8/pw-out-spec",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL, viewport: { width: 1280, height: 800 } },
});
