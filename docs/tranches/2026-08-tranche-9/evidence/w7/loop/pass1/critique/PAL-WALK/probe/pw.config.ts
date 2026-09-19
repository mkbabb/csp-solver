/**
 * PAL-WALK · PASS-1 CRITIQUE — the critic's own scratch config. A copy of the estate's default
 * with webServer/globalSetup dropped and baseURL on THIS lane's server (:4248, the next free in
 * the 4230-4249 band; the prototype holds :4245). The estate's default starts :3000.
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
    baseURL: "http://127.0.0.1:4248",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
