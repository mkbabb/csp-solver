import { defineConfig } from "@playwright/test";

/**
 * CTRL-TAPE pass-1 PROTOTYPE scratch config. The estate's shape with `webServer`, `globalSetup`
 * and the :3000 baseURL dropped, per the lane laws: the estate's default config is never
 * invoked and this lane never touches :3000. Lives beside `package.json` because a config in
 * the docs tree cannot resolve `@playwright/test`. DELETE after the run — it is an instrument.
 */
export default defineConfig({
  testDir: process.env.LANE_TESTDIR || "./e2e",
  timeout: 180000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4244",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
    trace: "off",
    video: "off",
  },
});
