import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "../e2e", timeout: 90000, expect: { timeout: 15000 }, fullyParallel: false, workers: 2, retries: 0,
  reporter: "list", outputDir: "./test-results",
  use: { baseURL: "http://127.0.0.1:4238" },
  projects: [ { name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } } ],
});
