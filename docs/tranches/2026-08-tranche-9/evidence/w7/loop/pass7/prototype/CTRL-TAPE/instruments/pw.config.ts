import base from "../playwright.config";
import { defineConfig } from "@playwright/test";
const { webServer: _ws, ...rest } = base as any;
export default defineConfig({
  ...rest,
  testDir: process.env.TAPE7_E2E || "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-27/web/frontend/e2e",
  globalSetup: undefined,
  workers: +(process.env.TAPE7_WORKERS || 4),
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tape7-pw-out/" + (process.env.TAPE7_TAG || "x"),
  reporter: "list",
  use: { ...rest.use, baseURL: process.env.TAPE7_BASE },
});
