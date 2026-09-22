// T9-W7 pass 4 · MRK-ABS — scratch Playwright config (deleted before return). No webServer.
import { defineConfig, devices } from "@playwright/test";
const vp = { width: 1280, height: 800 };
export default defineConfig({
  testDir: ".",
  testMatch: /p4-.*\.spec\.ts$/,
  timeout: 600000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: "line",
  use: { baseURL: process.env.ABS_BASE ?? "http://127.0.0.1:4239", trace: "off", video: "off", screenshot: "off" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], viewport: vp, deviceScaleFactor: 1 } },
    { name: "webkit", use: { ...devices["Desktop Safari"], viewport: vp, deviceScaleFactor: 1 } },
  ],
});
