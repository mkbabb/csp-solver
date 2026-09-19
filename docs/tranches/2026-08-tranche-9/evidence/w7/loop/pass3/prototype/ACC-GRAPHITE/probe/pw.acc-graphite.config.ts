import { defineConfig } from "@playwright/test";

/** Scratch config for T9-W7 pass-3 ACC-GRAPHITE. No `webServer` (the estate's default starts
 *  :3000); the lane's own servers are already up and `PLAYWRIGHT_BASE_URL` picks the arm. */
export default defineConfig({
  testDir: "./probe-scratch",
  testMatch: "**/*.probe.ts",
  timeout: 180_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4235",
    trace: "off",
    video: "off",
    screenshot: "off",
  },
});
