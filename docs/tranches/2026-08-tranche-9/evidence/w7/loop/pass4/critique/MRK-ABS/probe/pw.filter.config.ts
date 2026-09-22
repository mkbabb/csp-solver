// MRK-ABS pass 4 scratch: the estate's filter census against THIS tree's built dist on :4241.
import { defineConfig, devices } from "@playwright/test";
const vp = { width: 1280, height: 800 };
export default defineConfig({
  testDir: "../e2e", testMatch: /filter-census\.spec\.ts$/, timeout: 120000, workers: 1, retries: 0, reporter: "line",
  use: { baseURL: "http://127.0.0.1:4234" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], viewport: vp } },
    { name: "webkit", use: { ...devices["Desktop Safari"], viewport: vp } },
  ],
});
