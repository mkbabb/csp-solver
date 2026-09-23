import { defineConfig } from "@playwright/test";
export default defineConfig({
  timeout: 900000, expect: { timeout: 20000 }, fullyParallel: false, workers: 1, retries: 0, reporter: "list",
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit/pw-out",
  projects: [
    { name: "chromium", testDir: ".", testMatch: /crit\.tape\.spec\.ts$/, use: { browserName: "chromium" } },
    { name: "webkit", testDir: ".", testMatch: /crit\.tape\.spec\.ts$/, use: { browserName: "webkit" } },
  ],
  use: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 3, screenshot: "off" },
});
