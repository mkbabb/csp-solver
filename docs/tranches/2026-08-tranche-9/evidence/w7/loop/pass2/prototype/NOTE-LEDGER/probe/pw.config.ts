import { defineConfig } from "@playwright/test";

/**
 * NOTE-LEDGER (T9-W7 §7) pass-2 research scratch config. The estate's default MINUS the
 * webServer (which starts :3000) and MINUS globalSetup, pointed at this lane's own dev server
 * on the charter's port. R3-d needs a long timeout on this rig (it walks nine acts with a
 * 30s idle), so the file-level timeout is 150s — the pass-1 record's housekeeping row.
 * Never a product file, never in CI.
 */
export default defineConfig({
  testDir: ".",
  testMatch: /.*\.probe\.ts$/,
  timeout: 150000,
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
