import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "../e2e",
  timeout: 180000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: { baseURL: "http://127.0.0.1:4247", viewport: { width: 1280, height: 800 }, screenshot: "off" },
});
