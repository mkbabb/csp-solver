/**
 * PAL-WALK · PASS-1 PROTOTYPE — the lane's own Playwright config. A COPY of the estate's
 * default with `webServer` and `globalSetup` dropped and `baseURL` pointed at this lane's dev
 * server (4244 was already held when this lane opened, so it took the next free port in the
 * band). The estate's default starts :3000 and would measure somebody else's tree.
 */
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: /.*\.(spec|probe)\.ts$/,
  timeout: 180000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: "http://127.0.0.1:4245",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
