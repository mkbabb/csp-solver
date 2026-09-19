import { defineConfig } from "@playwright/test";

/**
 * T9-W8 §8.2 cure C06 — the SCRATCH e2e config, a copy of `web/frontend/playwright.config.ts`
 * with exactly three changes, none of them to a spec:
 *   1. `webServer` DROPPED. The estate default starts `npm run dev` on :3000, which is the
 *      owner's port and another lane's tree; this config never spawns a server.
 *   2. `baseURL` pinned to the cured preview (:4257), not :3000.
 *   3. `testDir` and `globalSetup` resolved from the worktree's `web/frontend`, because this
 *      file banks under docs/.
 * Everything else — the two engine projects, `testIgnore`, timeouts, retries 0 — is verbatim.
 * Run from web/frontend: `npx playwright test --config <this> <spec>…`
 */
const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-app/web/frontend";

const OTHER_CONFIGS = [
  /visual-golden\.spec\.ts$/,
  /throttled-void\.spec\.ts$/,
  /filter-census\.spec\.ts$/,
  /wordmark-integrity\.spec\.ts$/,
  /theme-bake-freshness\.spec\.ts$/,
  /theme-quadrants\.spec\.ts$/,
];

export default defineConfig({
  testDir: `${FE}/e2e`,
  testIgnore: OTHER_CONFIGS,
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    {
      name: "webkit",
      use: { browserName: "webkit" },
      testIgnore: [...OTHER_CONFIGS],
    },
  ],
  globalSetup: `${FE}/e2e/global-setup.ts`,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4257",
    viewport: { width: 1280, height: 800 },
    screenshot: "only-on-failure",
  },
});
