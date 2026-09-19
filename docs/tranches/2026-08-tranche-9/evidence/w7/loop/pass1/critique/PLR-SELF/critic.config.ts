// PLR-SELF pass-1 CRITIC config — the estate's playwright.config.ts with webServer dropped and
// baseURL pinned at this lane's own dev server (the prototype worktree on 127.0.0.1:4241).
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critic",
  testMatch: /critic[234]?\.spec\.ts$/,
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
    baseURL: "http://127.0.0.1:4241",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
