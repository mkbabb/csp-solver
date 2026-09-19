import { defineConfig } from "@playwright/test";

/**
 * CTRL-TAPE pass-1 SCRATCH CONFIG. A copy of the estate's shape with `webServer`, `globalSetup`
 * and the :3000 baseURL dropped, per the lane laws: the estate's default config is never
 * invoked and this lane never touches :3000.
 *
 *   PLAYWRIGHT_BASE_URL=http://127.0.0.1:4230  → HEAD (the control)
 *   PLAYWRIGHT_BASE_URL=http://127.0.0.1:4233  → the overlay proxy (the prototype)
 *
 * `testDir` is passed on the command line so the SAME config runs the r0 instrument and the
 * estate's own `e2e/access.spec.ts` unchanged.
 */
export default defineConfig({
  testDir: process.env.LANE_TESTDIR || ".",
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4230",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
    trace: "off",
    video: "off",
  },
});
