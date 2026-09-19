// PAL-TIN pass-1 PROTOTYPE scratch config. Copy of web/frontend/playwright.config.ts with the
// webServer and globalSetup dropped and baseURL pinned to this lane's own dev server
// (127.0.0.1:4245, the prototype worktree). NEVER the estate's default — that one starts :3000.
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tinproto/spec",
  testMatch: /tin-proto\.spec\.ts$/,
  timeout: 180000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4245",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
