import { createRequire } from "node:module";
const require = createRequire(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json",
);
const { defineConfig } = require("@playwright/test");

// A SCRATCH config: no webServer (both arms are static servers already up), no golden dir,
// two engines, headless. The estate's default config starts :3000 and is never used here.
export default defineConfig({
  // The spec lives INSIDE the frontend so `@playwright/test` resolves through the symlinked
  // node_modules; `.probe/` is untracked and never part of the diff.
  testDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-6/web/frontend/.probe",
  testMatch: /(verbs|fold)\.spec\.ts$/,
  timeout: 90000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["line"]],
  projects: [
    { name: "chromium", use: { browserName: "chromium", headless: true } },
    { name: "webkit", use: { browserName: "webkit", headless: true } },
  ],
});
