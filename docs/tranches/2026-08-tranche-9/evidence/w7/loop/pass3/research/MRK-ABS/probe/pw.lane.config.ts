// T9-W7 pass 3 · MRK-ABS research lane — scratch Playwright config.
// A copy of the estate's default MINUS `webServer`/`globalSetup`, pointed at this lane's own
// server (127.0.0.1:4239) and this lane's own probe dir. Never the estate's default config
// (it starts :3000).
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: /r[456].*\.spec\.ts$/,
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4239",
    trace: "off",
    video: "off",
    screenshot: "off",
    viewport: { width: 1280, height: 800 },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
