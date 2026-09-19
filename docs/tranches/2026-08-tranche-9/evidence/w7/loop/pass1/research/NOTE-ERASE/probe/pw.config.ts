import { defineConfig } from "@playwright/test";

/**
 * NOTE-ERASE (T9-W7 §7) pass-1 scratch config. Copy of the estate's default MINUS the
 * webServer (which starts :3000) and MINUS globalSetup, pointed at this lane's own dev
 * server on 127.0.0.1:4249. Nothing here is a product file; it never runs in CI.
 *
 * The r0 R3 probes (`marks.probe.ts` R3-d, `marks2.probe.ts` R3-g) are copied in beside
 * this file BYTE-UNCHANGED and re-run against it; their `OUT` is `../logs` relative to
 * the probe file, so the re-run banks into THIS lane's logs and never writes to r0's.
 */
export default defineConfig({
  testDir: ".",
  testMatch: /.*\.probe\.ts$/,
  timeout: 240000,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4249",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
