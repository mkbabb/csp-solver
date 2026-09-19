import { defineConfig } from "@playwright/test";

/**
 * MRK-LIVE pass-1 scratch config for the ESTATE'S OWN specs (spoken-gallery §3.7, a11y,
 * access). A copy of `web/frontend/playwright.config.ts` MINUS the webServer (which starts
 * :3000) and MINUS the globalSetup, pointed at this lane's dev server on 127.0.0.1:4238.
 * Nothing here is a product file; it never runs in CI.
 */
export default defineConfig({
  testDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/e2e",
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4238",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
