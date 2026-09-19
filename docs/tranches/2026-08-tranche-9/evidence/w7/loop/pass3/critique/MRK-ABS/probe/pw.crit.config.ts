import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: ".", testMatch: /crit-.*\.spec\.ts$/, timeout: 180000,
  expect: { timeout: 20000 }, fullyParallel: false, retries: 0, workers: 1, reporter: "list",
  use: { baseURL: "http://127.0.0.1:4244", trace: "off", video: "off", screenshot: "off",
    viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 },
  projects: [ { name: "chromium", use: { ...devices["Desktop Chrome"] } },
              { name: "webkit", use: { ...devices["Desktop Safari"] } } ],
});
