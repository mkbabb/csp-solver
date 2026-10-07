import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critic-plrself8/ct/web/frontend/e2e", testMatch: /(player-mark|critic-.*)\.spec\.ts/,
  fullyParallel: false, workers: 1, reporter: [["list"]], timeout: 300000, expect: { timeout: 15000 }, retries: 0,
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critic-plrself8/pw-out",
  use: { baseURL: process.env.BASE || "http://127.0.0.1:4241", viewport: { width: 1280, height: 800 }, trace: "off", video: "off", screenshot: "off" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } }],
});
