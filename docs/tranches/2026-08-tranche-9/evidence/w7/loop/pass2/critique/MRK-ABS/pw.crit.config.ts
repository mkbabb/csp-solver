import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./probe",
  testMatch: /.*\.probe\.ts/,
  timeout: 240000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4241",
    trace: "off",
    video: "off",
    screenshot: "off",
    deviceScaleFactor: 3,
    viewport: { width: 1280, height: 800 },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], deviceScaleFactor: 3, viewport: { width: 1280, height: 800 } } },
    { name: "webkit", use: { ...devices["Desktop Safari"], deviceScaleFactor: 3, viewport: { width: 1280, height: 800 } } },
  ],
});
