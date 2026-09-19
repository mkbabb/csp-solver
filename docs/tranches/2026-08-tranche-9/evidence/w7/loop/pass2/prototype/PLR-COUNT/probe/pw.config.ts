// PLR-COUNT pass-2 scratch Playwright config: the estate's, minus `webServer` (which starts
// :3000) and minus `globalSetup`, with baseURL on the lane's own port. Never the estate's default.
import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.LANE_PORT || "4242";

export default defineConfig({
  testDir: __dirname,
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["line"]],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], browserName: "chromium" },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"], browserName: "webkit" },
    },
  ],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "off",
    video: "off",
    screenshot: "off",
  },
});
