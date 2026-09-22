import { defineConfig } from "@playwright/test";
// PLR-PLACE pass-4 CRITIC scratch config (deleted before return).
export default defineConfig({
  testDir: ".",
  testMatch: /critic-.*\.spec\.ts$/,
  timeout: 150000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:4243", trace: "off" },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
