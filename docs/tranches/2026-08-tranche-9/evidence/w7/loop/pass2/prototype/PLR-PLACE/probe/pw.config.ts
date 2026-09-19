import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  timeout: 300000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: "http://127.0.0.1:4243",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
