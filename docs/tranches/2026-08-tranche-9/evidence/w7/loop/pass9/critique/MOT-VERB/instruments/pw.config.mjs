import { defineConfig } from "@playwright/test";
// crit-MOT-VERB pass-9 scratch config: the BANKED specs (git archive of 2b9c277e) against a served dist.
const S = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-MOT-VERB";
export default defineConfig({
  testDir: process.env.CV_TESTDIR || `${S}/bank/web/frontend/e2e`,
  testMatch: new RegExp(process.env.CV_MATCH || "frame-halfstroke\\.spec\\.ts"),
  outputDir: `${S}/pw-out`,
  reporter: "list",
  grep: process.env.CV_GREP ? new RegExp(process.env.CV_GREP) : undefined,
  workers: 1,
  retries: 0,
  timeout: 240000,
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
