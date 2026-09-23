// Selector-patched copies (image.logo-pose-bmp → mask image) of wordmark-integrity + gallery. Instrument only.
import base from "../playwright-throttle.config.ts";
const G = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend/.gmotion";
export default {
  ...base,
  testDir: `${G}/e2e-patched`,
  globalSetup: undefined,
  outputDir: `${G}/pw-results-p`,
  reporter: [["line"]],
  webServer: undefined,
  projects: [
    { name: "wordmark-webkit", testMatch: /wordmark-integrity\.spec\.ts$/, retries: 0, use: { browserName: "webkit" } },
    { name: "gallery-chromium", testMatch: /gallery\.spec\.ts$/, retries: 0, use: { browserName: "chromium" } },
  ],
  use: { ...base.use, baseURL: process.env.PLAYWRIGHT_BASE_URL },
};
