import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: ".",
  testMatch: /.*\.probe\.ts$/,
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL, viewport: { width: 1280, height: 800 }, screenshot: "off" },
});
