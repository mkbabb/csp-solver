import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: __dirname,
  timeout: 180000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["line"]],
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], browserName: "chromium" } },
    { name: "webkit", use: { ...devices["Desktop Safari"], browserName: "webkit" } },
  ],
  use: { baseURL: "http://127.0.0.1:4243", trace: "off", video: "off", screenshot: "off" },
});
