import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "../e2e",
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  workers: 4,
  retries: 0,
  reporter: "list",
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/rulecrit6-pwout-4240",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: { baseURL: "http://127.0.0.1:4240", viewport: { width: 1280, height: 800 }, screenshot: "off" },
});
