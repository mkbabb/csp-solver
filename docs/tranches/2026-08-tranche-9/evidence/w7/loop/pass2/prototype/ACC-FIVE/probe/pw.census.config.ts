import { defineConfig } from "@playwright/test";

// The lane's scratch census config: the estate's throttle config minus its webServer and
// minus its globalSetup, pointed at a preview server this lane starts on its own port in
// 4230-4249. Never the estate's default config — that one starts :3000.
export default defineConfig({
  testDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-41/web/frontend/e2e",
  timeout: 90000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  projects: (["chromium", "webkit"] as const).map((browserName) => ({
    name: `filter-census-${browserName}`,
    testMatch: /filter-census\.spec\.ts$/,
    use: { browserName, baseURL: "http://127.0.0.1:4239" },
  })),
});
