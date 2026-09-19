import { defineConfig } from "@playwright/test";

/**
 * ACC-SIX pass-2 scratch config. NOT the estate's default (that one boots :3000 through a
 * `webServer` block and a globalSetup that asserts the SPA on it). The lane starts its own
 * dev server on 127.0.0.1:4237 with a private vite cacheDir and kills it before returning.
 *
 * It lives INSIDE the worktree because a config under `docs/` cannot resolve
 * `@playwright/test` (no node_modules on that path); the probes beside it write their
 * readings to the evidence dir in the main tree by absolute path, and the sources are
 * copied there when the lane returns. Code in the worktree, evidence in the main tree.
 */
export default defineConfig({
  testDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-42/web/frontend/probe-acc6",
  testMatch: /.*\.probe\.ts$/,
  timeout: 150000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4237",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
