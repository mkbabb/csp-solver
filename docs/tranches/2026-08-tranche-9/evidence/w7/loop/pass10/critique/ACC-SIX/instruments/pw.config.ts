// crit-ACC-SIX scratch runner config (never banked): the product's config, no webServer, baseURL from BASE.
import base from "../playwright.config";
const root = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-ACC-SIX/a-wave/web/frontend";
export default {
  ...base,
  testDir: root + "/e2e",
  globalSetup: root + "/e2e/global-setup.ts",
  webServer: undefined,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  outputDir: process.env.PWOUT,
  use: { ...base.use, baseURL: process.env.BASE },
};
