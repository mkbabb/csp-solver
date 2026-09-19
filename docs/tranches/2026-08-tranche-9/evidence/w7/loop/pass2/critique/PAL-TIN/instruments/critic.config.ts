// PAL-TIN pass-2 CRITIC playwright config: the estate's, minus webServer/globalSetup, pinned
// to this lane's own dev server (127.0.0.1:4243).
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-58/web/frontend/critic-spec",
  testMatch: /critic-tin\.spec\.ts$/,
  timeout: 180000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: { baseURL: "http://127.0.0.1:4243", screenshot: "off" },
});
