import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: process.env.TD || "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself-c5/specs",
  testMatch: process.env.TM ? new RegExp(process.env.TM) : undefined,
  fullyParallel: false, workers: 1, reporter: [["list"]], timeout: 240000, expect: { timeout: 10000 },
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself-c5/pw-out",
  use: { baseURL: process.env.BASE || "http://127.0.0.1:4241", viewport: { width: 1280, height: 800 }, trace: "off", video: "off", screenshot: "off" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } }],
});
