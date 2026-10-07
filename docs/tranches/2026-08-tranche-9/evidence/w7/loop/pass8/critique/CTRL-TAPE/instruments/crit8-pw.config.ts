import base from "./playwright.config";
import { defineConfig } from "@playwright/test";
const { webServer: _ws, ...rest } = base as any;
export default defineConfig({
  ...rest,
  testDir: process.env.CRIT8_E2E || "./e2e",
  globalSetup: undefined,
  workers: +(process.env.CRIT8_WORKERS || 2),
  retries: 0,
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-tape8/pw-out/" + (process.env.CRIT8_TAG || "x"),
  reporter: [["list"]],
  use: { ...rest.use, baseURL: process.env.CRIT8_BASE },
});
