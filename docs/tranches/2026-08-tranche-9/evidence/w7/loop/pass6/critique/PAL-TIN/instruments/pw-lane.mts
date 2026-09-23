import { defineConfig } from "@playwright/test";
const dpr = Number(process.env.CR_DPR || 1);
export default defineConfig({
  timeout: 1800000, expect: { timeout: 20000 }, fullyParallel: false, workers: 1, retries: 0,
  reporter: "list", outputDir: process.env.CR_OUT || "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tincrit6/out/lane",
  projects: [
    { name: "chromium", testDir: process.env.CR_DIR, testMatch: /peer-tin\.spec\.ts$/, use: { browserName: "chromium" } },
    { name: "webkit", testDir: process.env.CR_DIR, testMatch: /peer-tin\.spec\.ts$/, use: { browserName: "webkit" } },
  ],
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL, viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr, screenshot: "off", trace: "off" },
});
