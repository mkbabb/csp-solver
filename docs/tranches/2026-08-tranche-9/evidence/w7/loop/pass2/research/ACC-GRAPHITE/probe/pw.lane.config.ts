// ACC-GRAPHITE pass-2 research: the estate's config MINUS its webServer (which starts :3000),
// pointed at this lane's own port. Two engines, 1280x800 dpr1 by default.
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: ".",
  testMatch: /r2-.*\.spec\.ts$/,
  timeout: 90000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.LANE_BASE_URL || "http://127.0.0.1:4235",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
