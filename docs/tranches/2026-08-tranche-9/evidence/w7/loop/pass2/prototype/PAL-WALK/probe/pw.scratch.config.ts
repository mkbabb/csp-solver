// The estate's default config starts :3000 through a `webServer` block; this lane's server is
// its own, on 4244, already running. Same two projects, no webServer, no globalSetup (which
// asserts the estate's baseURL), and the probe dir added so the prototype-only rows can run
// beside the landed spec.
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-59/web/frontend/e2e",
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: "http://127.0.0.1:4244",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
