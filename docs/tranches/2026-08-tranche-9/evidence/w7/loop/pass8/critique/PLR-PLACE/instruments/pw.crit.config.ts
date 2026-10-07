import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: process.env.C8_DIR ?? "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-place8/specs",
  testMatch: process.env.C8_MATCH ? new RegExp(process.env.C8_MATCH) : /c8-.*\.spec\.ts$/,
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-place8/pw-out",
  timeout: 300000, expect: { timeout: 20000 },
  fullyParallel: false, workers: Number(process.env.C8_WK ?? 1), retries: 0, reporter: "list",
  use: { baseURL: "http://127.0.0.1:" + (process.env.C8_PORT ?? "4243"), trace: "off" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } }],
});
