// The lane's own PW config: the estate's default minus webServer/globalSetup, pointed at the
// PROTOTYPE server on 4238 (the HEAD control on 4239 is reached with PLAYWRIGHT_BASE_URL).
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: import.meta.dirname,
  testMatch: /.*\.probe\.ts$/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  timeout: 120_000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4238",
    trace: "off",
    video: "off",
    screenshot: "off",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
