// PAL-TIN pass-8 scratch config for the row-4 mechanism plants (moved out before return)
import { defineConfig } from "@playwright/test";
export default defineConfig({
  timeout: 600000, workers: 1, retries: 0, reporter: "list",
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tin8/pw-out/mech",
  projects: [
    { name: "chromium", testDir: ".", testMatch: /mech\.spec\.ts$/, use: { browserName: "chromium" } },
    { name: "webkit", testDir: ".", testMatch: /mech\.spec\.ts$/, use: { browserName: "webkit" } },
  ],
  use: { baseURL: "http://127.0.0.1:4245", viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, screenshot: "off", trace: "off" },
});
