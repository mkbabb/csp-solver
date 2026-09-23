// The golden config over a selector-patched copy of visual-golden.spec.ts (image.* → .* only),
// reading the committed baselines through a symlink. Instrument only.
import base from "../playwright-golden.config.ts";
const G = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend/.gmotion";
export default {
  ...base,
  testDir: `${G}/e2e-golden`,
  globalSetup: undefined,
  outputDir: `${G}/pw-results-g2`,
  reporter: [["line"]],
  webServer: undefined,
  use: { ...base.use, baseURL: process.env.PLAYWRIGHT_BASE_URL },
};
