import { defineConfig } from "@playwright/test";
/** ACC-GRAPHITE pass-1 CRITIC's scratch config. Not the estate's default (that boots :3000).
 *  Points at the prototype worktree's live dev server: every port 4230-4249 was held by a
 *  concurrent lane at critique time, so this reads the lane's own :4237 rather than evicting
 *  one. Read-only: no source is written, only screenshots and DOM reads. */
export default defineConfig({
  testDir: "./probe",
  testMatch: /.*\.probe\.ts$/,
  timeout: 240000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: "http://127.0.0.1:4237",
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    screenshot: "off",
  },
});
