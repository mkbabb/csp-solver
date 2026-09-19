import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./",
  testMatch: /.*\.probe\.ts$/,
  timeout: 240000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: "http://127.0.0.1:4243",
    viewport: process.env.VP === "phone" ? { width: 393, height: 699 } : { width: 1280, height: 800 },
    deviceScaleFactor: process.env.VP === "phone" ? 3 : 1,
    screenshot: "off",
  },
});
