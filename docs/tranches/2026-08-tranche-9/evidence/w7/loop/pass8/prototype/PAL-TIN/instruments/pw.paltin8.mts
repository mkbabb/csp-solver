// PAL-TIN pass-8 scratch config (moved out before return). baseURL/dpr/match/grep/out from env.
import { defineConfig } from "@playwright/test";
const dpr = Number(process.env.TIN_DPR || 1);
const match = new RegExp(process.env.TIN_MATCH || "peer-tin\\.spec\\.ts$");
export default defineConfig({
  timeout: 2400000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: process.env.TIN_OUT || "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tin8/pw-out/default",
  projects: [
    { name: "chromium", testDir: "../e2e", testMatch: match, use: { browserName: "chromium" } },
    { name: "webkit", testDir: "../e2e", testMatch: match, use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4245",
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: dpr,
    screenshot: "off",
    trace: "off",
  },
});
