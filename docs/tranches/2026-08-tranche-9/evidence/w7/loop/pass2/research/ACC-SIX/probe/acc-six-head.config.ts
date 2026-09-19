import { defineConfig, devices } from "@playwright/test";
// A copy of the estate's default config with webServer/globalSetup dropped and baseURL pinned
// to this lane's preview of the BUILT dist (127.0.0.1:4237).
export default defineConfig({
  testDir: __dirname,
  testMatch: /.*probe\.ts$/,
  timeout: 120000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:4237", trace: "off", video: "off", screenshot: "off" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
