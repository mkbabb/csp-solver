import { defineConfig } from "@playwright/test";

// PLR-SELF pass-3 research probe. No webServer: the lane starts its own vite on 4241 with a
// private cacheDir (CHAIR §7) and kills it before returning. baseURL is that server.
export default defineConfig({
  testDir: __dirname,
  testMatch: /r3-.*\.spec\.ts$/,
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:4241", trace: "off", video: "off" },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
