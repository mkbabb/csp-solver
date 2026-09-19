import { defineConfig } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@playwright/test/index.js";
// Critic's scratch config: the estate's default suite MINUS its webServer (which starts :3000),
// pointed at the critic's own server on 127.0.0.1:4246.
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
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-27/web/frontend/e2e",
  testIgnore: OTHER_CONFIGS,
  timeout: 45000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" }, testIgnore: [...OTHER_CONFIGS] },
  ],
  use: {
    baseURL: "http://127.0.0.1:4246",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
