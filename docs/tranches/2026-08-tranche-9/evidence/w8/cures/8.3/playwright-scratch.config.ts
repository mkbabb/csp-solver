import { defineConfig } from "@playwright/test";

// T9-W8 §8.3 — THE SCRATCH CONFIG. `web/frontend/playwright.config.ts` with exactly three
// changes, so the rows it runs are the estate's rows:
//   1  `webServer` is DROPPED. The estate default boots `npm run dev` on :3000, which is the
//      owner's port and not the artifact under test.
//   2  `baseURL` is the CURED preview (`vite preview --outDir dist --port 4260`), so the spec
//      asserts over the BUILT dist this cure produced, chunk graph included.
//   3  `testDir` is absolute (this file lives under docs/, the specs live in the worktree) and
//      only `device-probe.spec.ts` is collected.
// Both projects, both engines, as the default suite declares them.
//
// HOW TO RUN IT FROM WHERE IT SITS (repair round 1, finding F4). This file lives under docs/,
// where `@playwright/test` does not resolve, so a bare run dies with MODULE_NOT_FOUND. Prefix
// the resolver:
//
//   cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-probe/web/frontend
//   NODE_PATH=$PWD/node_modules npx playwright test \
//     --config /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/8.3/playwright-scratch.config.ts
//
// The cured preview has to be up on :4260 first (`npx vite preview --outDir dist --port 4260
// --strictPort --host 127.0.0.1` from that same directory).

const E2E =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-probe/web/frontend/e2e";

export default defineConfig({
  testDir: E2E,
  testMatch: /device-probe\.spec\.ts$/,
  timeout: 120000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: "http://127.0.0.1:4260",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
