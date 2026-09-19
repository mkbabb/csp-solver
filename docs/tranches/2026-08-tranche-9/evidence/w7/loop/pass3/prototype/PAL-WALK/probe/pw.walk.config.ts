// PAL-WALK pass-3 scratch config: the estate's default minus its webServer (this lane owns its
// own servers on 4244 / 4247), pointed at whichever tree PLAYWRIGHT_BASE_URL names. dpr 3 so the
// ring's 4px stroke is photographed at the density the band is pinned on.
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: /(peer-walk|pal-walk-crops|pal-walk-pi|accent-kinship)\.spec\.ts$/,
  timeout: 180000,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4244",
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 3,
    screenshot: "off",
  },
});
