// PAL-WALK pass-4 CRITIC scratch config (deleted before return).
import { defineConfig } from "@playwright/test";
export default defineConfig({
  timeout: 600000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk-critic/pw-out",
  projects: [
    { name: "walk-chromium", testDir: "../e2e", testMatch: /peer-walk\.spec\.ts$/, use: { browserName: "chromium" } },
    { name: "walk-webkit", testDir: "../e2e", testMatch: /peer-walk\.spec\.ts$/, use: { browserName: "webkit" } },
    { name: "walkB-dpr1-chromium", testDir: "../e2e", testMatch: /peer-walk\.spec\.ts$/, use: { browserName: "chromium", deviceScaleFactor: 1 } },
    { name: "walkB-dpr2-chromium", testDir: "../e2e", testMatch: /peer-walk\.spec\.ts$/, use: { browserName: "chromium", deviceScaleFactor: 2 } },
    { name: "walkB-dpr1-webkit", testDir: "../e2e", testMatch: /peer-walk\.spec\.ts$/, use: { browserName: "webkit", deviceScaleFactor: 1 } },
    { name: "walkB-dpr2-webkit", testDir: "../e2e", testMatch: /peer-walk\.spec\.ts$/, use: { browserName: "webkit", deviceScaleFactor: 2 } },
    { name: "critic-chromium", testDir: ".", testMatch: /critic\..*\.spec\.ts$/, use: { browserName: "chromium" } },
    { name: "critic-webkit", testDir: ".", testMatch: /critic\..*\.spec\.ts$/, use: { browserName: "webkit" } },
  ],
  use: { baseURL: "http://127.0.0.1:4242", viewport: { width: 1280, height: 800 }, deviceScaleFactor: 3, screenshot: "off" },
});
