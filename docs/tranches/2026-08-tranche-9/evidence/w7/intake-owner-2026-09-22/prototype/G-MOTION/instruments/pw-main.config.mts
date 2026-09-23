// The main e2e config without its :3000 webServer, pointed at a lane port (PLAYWRIGHT_BASE_URL).
import base from "../playwright.config.ts";
const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend";
export default {
  ...base,
  testDir: `${FE}/e2e`,
  globalSetup: `${FE}/e2e/global-setup.ts`,
  outputDir: `${FE}/.gmotion/pw-results`,
  reporter: [["line"]],
  webServer: undefined,
  use: { ...base.use, baseURL: process.env.PLAYWRIGHT_BASE_URL },
};
