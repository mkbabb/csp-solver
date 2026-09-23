import { defineConfig, devices } from "@playwright/test";
/** PLR-SELF pass-5 estate rig — the real e2e dir, pointed at a named server. Scratch. */
export default defineConfig({
  testDir: "../e2e",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  timeout: 180000,
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plr-self/pw-out-estate",
  use: { baseURL: process.env.PLR_BASE ?? "http://127.0.0.1:4241", trace: "off", video: "off", screenshot: "off" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
