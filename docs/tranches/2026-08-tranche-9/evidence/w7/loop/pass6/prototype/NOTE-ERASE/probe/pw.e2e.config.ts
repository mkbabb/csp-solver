import { defineConfig } from "@playwright/test";
// NOTE-ERASE pass-6 scratch: ONE spec file, whole, against a served dist (PLAYWRIGHT_BASE_URL), no webServer.
export default defineConfig({
  testDir: "../e2e",
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: "list",
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erase6-pw-out",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  globalSetup: "../e2e/global-setup.ts",
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL, viewport: { width: 1280, height: 800 } },
});
