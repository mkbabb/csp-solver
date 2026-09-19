import { defineConfig } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@playwright/test/index.js";

/** CTRL-FACE pass-2 RESEARCH — the estate's config with the webServer and the global
 *  setup dropped (this lane runs its own server on 4234, a private vite cacheDir) and
 *  the baseURL pointed at it. Both engines, as the estate runs them. */
export default defineConfig({
  testDir: ".",
  timeout: 120000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4234",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
