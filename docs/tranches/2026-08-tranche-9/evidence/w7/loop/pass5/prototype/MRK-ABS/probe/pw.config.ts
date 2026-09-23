import { defineConfig, devices } from "@playwright/test";
const vp = { width: 1280, height: 800 };
export default defineConfig({
  testDir: ".", testMatch: /p5-.*\.spec\.ts$/, timeout: 600000, expect: { timeout: 20000 },
  fullyParallel: false, retries: 0, workers: 1, reporter: "line", outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/pw-results",
  use: { baseURL: "http://127.0.0.1:4239", trace: "off", video: "off", screenshot: "off" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], viewport: vp, deviceScaleFactor: 1 } },
    { name: "webkit", use: { ...devices["Desktop Safari"], viewport: vp, deviceScaleFactor: 1 } },
  ],
});
