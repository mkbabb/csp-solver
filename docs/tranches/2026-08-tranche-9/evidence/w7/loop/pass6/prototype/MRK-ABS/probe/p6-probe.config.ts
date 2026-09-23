import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: ".", testMatch: new RegExp(process.env.SPEC ?? "p6-ring"), timeout: 1800000, expect: { timeout: 15000 },
  fullyParallel: false, workers: 1, retries: 0, reporter: "line",
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrkabs6-pw-probe-" + (process.env.TAG ?? "x"),
  use: { screenshot: "off", trace: "off" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } }],
});
