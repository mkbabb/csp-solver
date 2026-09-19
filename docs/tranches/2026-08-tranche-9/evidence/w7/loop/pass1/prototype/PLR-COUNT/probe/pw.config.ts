// PLR-COUNT pass-1 PROTOTYPE scratch config. A copy of web/frontend/playwright.config.ts with
// webServer/globalSetup dropped and baseURL pinned to this lane's own dev server (:4243 — 4242
// was already held when the lane opened). NEVER the estate's default config: that one starts
// :3000.
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plr1",
  testMatch: /(proto|instruments|dbg)\.spec\.ts$/,
  timeout: 240000,
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
    baseURL: "http://127.0.0.1:4243",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
