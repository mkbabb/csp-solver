// The lane's own PW config: the estate's default minus webServer/globalSetup, pointed at the
// HEAD-control server on 4238. Never the estate's default (that one starts :3000).
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: import.meta.dirname,
  testMatch: /.*\.probe\.ts$/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  timeout: 90_000,
  use: { baseURL: "http://127.0.0.1:4238", trace: "off", video: "off", screenshot: "off" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
