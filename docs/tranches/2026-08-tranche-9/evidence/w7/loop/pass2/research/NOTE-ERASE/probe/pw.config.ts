// NOTE-ERASE pass-2 lane: scratch playwright config. No webServer (the estate's default starts :3000).
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: ".", testMatch: /.*\.(probe|spec)\.ts/,
  timeout: 120_000,
  workers: 1,
  reporter: [["list"]],
  use: { baseURL: "http://127.0.0.1:4248", trace: "off", video: "off" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
