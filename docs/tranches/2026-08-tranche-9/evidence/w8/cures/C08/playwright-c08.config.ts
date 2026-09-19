// C08's SCRATCH e2e config — the estate's default suite, pointed at this cure's CURED preview
// port instead of a dev server. Copied from web/frontend/playwright.config.ts; the only changes
// are: `webServer` dropped (the arm is already served), `baseURL` fixed to 127.0.0.1:4259,
// `testDir` made absolute, and `globalSetup` dropped with it (it asserts the dev-server SPA).
// Nothing else — both engines, no retries, the same timeouts.
import { defineConfig } from "@playwright/test";

const OTHER_CONFIGS = [
  /visual-golden\.spec\.ts$/,
  /throttled-void\.spec\.ts$/,
  /filter-census\.spec\.ts$/,
  /wordmark-integrity\.spec\.ts$/,
  /theme-bake-freshness\.spec\.ts$/,
  /theme-quadrants\.spec\.ts$/,
];

export default defineConfig({
  testDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-drawer/web/frontend/e2e",
  testIgnore: OTHER_CONFIGS,
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" }, testIgnore: [...OTHER_CONFIGS] },
  ],
  use: {
    baseURL: "http://127.0.0.1:4259",
    viewport: { width: 1280, height: 800 },
    screenshot: "only-on-failure",
  },
});
