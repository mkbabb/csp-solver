import { defineConfig } from "@playwright/test";

/**
 * ACC-FIVE scratch config — R2's `hue-census.config.ts` with this lane's port and
 * testDir. NOT the estate's default (that one boots :3000 through a `webServer` block
 * and a globalSetup that asserts the SPA on it).
 */
// `__dirname`, not a hardcoded path: the probes resolve `@playwright/test` out of
// `web/frontend/node_modules`, so the RUNS happen from a scratchpad copy of this dir
// with that directory symlinked beside it (R2's own arrangement) — no product file and
// no package.json is touched. The banked sources and the run copy are byte-identical.
const here = new URL(".", import.meta.url).pathname;

export default defineConfig({
  testDir: here,
  testMatch: /.*\.probe\.ts$/,
  timeout: 180000,
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4236",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
