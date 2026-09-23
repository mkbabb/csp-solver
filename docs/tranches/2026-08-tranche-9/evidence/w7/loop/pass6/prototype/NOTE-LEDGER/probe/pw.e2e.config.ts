import { defineConfig } from "@playwright/test";
// NOTE-LEDGER pass-6 scratch: ONE estate spec file, whole, against a served dist named by
// PLAYWRIGHT_BASE_URL, with no webServer (it would bind :3000, which is foreign). Moved out at return.
export default defineConfig({
  testDir: "../e2e",
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger6b/pw-e2e-out",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  globalSetup: "../e2e/global-setup.ts",
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL, viewport: { width: 1280, height: 800 } },
});
