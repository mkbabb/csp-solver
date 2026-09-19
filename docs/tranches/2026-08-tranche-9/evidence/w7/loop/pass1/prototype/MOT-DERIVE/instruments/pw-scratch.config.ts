import { defineConfig } from "@playwright/test";

// Scratch config for T9-W7 pass 1 (MOT-DERIVE): the estate's default suite, minus its
// webServer (which starts :3000 — foreign to this lane), pointed at the prototype's own
// built dist on 127.0.0.1:4248. Both engines, as the default config declares.
export default defineConfig({
  testDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-35/web/frontend/e2e",
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4248",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
