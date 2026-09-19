import { defineConfig } from "@playwright/test";

/**
 * Scratch config for running the ESTATE's own e2e specs against this lane's dev server. Copied
 * from `playwright.config.ts` with the webServer block and the globalSetup dropped (the default
 * one starts :3000, which belongs to nobody here) and the baseURL pointed at :4237.
 */
export default defineConfig({
  testDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-43/web/frontend/e2e",
  timeout: 180000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: "http://127.0.0.1:4237",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
    trace: "off",
  },
});
