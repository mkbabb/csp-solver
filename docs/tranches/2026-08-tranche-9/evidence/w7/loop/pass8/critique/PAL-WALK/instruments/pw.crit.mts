import { defineConfig } from "@playwright/test";
const dpr = Number(process.env.WALK_DPR || 2);
export default defineConfig({
  timeout: 3600000, expect: { timeout: 20000 }, fullyParallel: false, workers: 1, retries: 0, reporter: "list",
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/walkcrit8/test-results-crit",
  projects: [
    { name: "chromium", testDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/walkcrit8/pw", testMatch: new RegExp(process.env.CRIT_MATCH || "critnight"), use: { browserName: "chromium" } },
    { name: "webkit", testDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/walkcrit8/pw", testMatch: new RegExp(process.env.CRIT_MATCH || "critnight"), use: { browserName: "webkit" } },
  ],
  use: { baseURL: "http://127.0.0.1:4244", viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr, screenshot: "off" },
});
