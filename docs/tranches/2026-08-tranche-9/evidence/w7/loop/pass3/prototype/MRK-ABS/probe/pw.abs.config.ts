// T9-W7 pass 3 · MRK-ABS PROTOTYPE — scratch Playwright config.
// The estate's default MINUS `webServer`/`globalSetup`, pointed at THIS lane's own prototype
// server (127.0.0.1:4239). Never the estate's default config (it starts :3000).
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: /p3-.*\.spec\.ts$/,
  timeout: 180000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: process.env.ABS_BASE ?? "http://127.0.0.1:4239",
    trace: "off",
    video: "off",
    screenshot: "off",
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
