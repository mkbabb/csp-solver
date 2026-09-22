import { defineConfig, devices } from "@playwright/test";

/** PLR-SELF pass-4 estate rig — the real e2e dir, pointed at this lane's dev server. */
export default defineConfig({
  testDir: "../e2e",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  timeout: 120000,
  use: { baseURL: process.env.PLR_BASE ?? "http://127.0.0.1:4241", trace: "off" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
