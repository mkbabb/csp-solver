import { defineConfig, devices } from "@playwright/test";

/** PLR-SELF pass-4 probe rig. Scratch; deleted before return. */
export default defineConfig({
  testDir: ".",
  testMatch: /p4-.*\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  timeout: 120000,
  use: {
    baseURL: process.env.PLR_BASE ?? "http://127.0.0.1:4241",
    trace: "off",
    video: "off",
    screenshot: "off",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
