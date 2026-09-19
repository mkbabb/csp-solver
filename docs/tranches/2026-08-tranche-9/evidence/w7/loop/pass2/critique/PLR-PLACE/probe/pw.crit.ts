import { defineConfig } from "@playwright/test";

/** The critic's scratch config: no webServer (the estate's default starts :3000), the two
 *  lanes' own servers, both engines, one pointer regime declared at the context. */
export default defineConfig({
  testDir: ".",
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
    baseURL: process.env.CRIT_BASE || "http://127.0.0.1:4247",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
