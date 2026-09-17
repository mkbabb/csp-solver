// R5 round-zero scratch config. Copied from web/frontend/playwright.config.ts with the
// webServer dropped and baseURL pinned to the lane's own dev server (127.0.0.1:4231).
// NEVER the estate's default config — that one starts :3000.
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/r5probe",
  testMatch: /probe\.spec\.ts$/,
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: "http://127.0.0.1:4231",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
