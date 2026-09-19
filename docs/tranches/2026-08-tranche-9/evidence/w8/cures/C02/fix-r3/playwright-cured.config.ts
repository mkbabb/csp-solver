// T9-W8 C02 repair round 3 — the estate's default config with TWO changes and no others:
// `webServer` is dropped (the cured dist is already being previewed on this track's port) and
// `baseURL` points at the cured port, never :3000. Both engines, retries 0 as the estate has.
// It lives in the evidence dir, so it exports a plain object rather than importing
// `defineConfig` (this directory is outside the worktree's node_modules resolution root).
// RUN: cd <worktree>/web/frontend && npx playwright test --config <this file> <specs…>
const W =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend";

export default {
  testDir: `${W}/e2e`,
  timeout: 30000,
  expect: { timeout: 10000 },
  retries: 0,
  reporter: [["line"] as const],
  projects: [
    { name: "chromium", use: { browserName: "chromium" as const } },
    { name: "webkit", use: { browserName: "webkit" as const } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4253",
    viewport: { width: 1280, height: 800 },
    screenshot: "only-on-failure" as const,
  },
};
