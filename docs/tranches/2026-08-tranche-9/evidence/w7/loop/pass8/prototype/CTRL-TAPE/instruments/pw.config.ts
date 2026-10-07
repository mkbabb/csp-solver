import base from "../playwright.config";
import { defineConfig } from "@playwright/test";
// CTRL-TAPE pass 8 lane config (moved out before return): the tree's specs against a served dist.
const { webServer: _ws, ...rest } = base as any;
export default defineConfig({
  ...rest,
  testDir: process.env.TAPE8_E2E || "../e2e",
  globalSetup: undefined,
  workers: +(process.env.TAPE8_WORKERS || 2),
  retries: 0,
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tape8/pw-out/" + (process.env.TAPE8_TAG || "x"),
  reporter: [["list"], ["json", { outputFile: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tape8/pw-out/" + (process.env.TAPE8_TAG || "x") + ".json" }]],
  use: { ...rest.use, baseURL: process.env.TAPE8_BASE },
});
