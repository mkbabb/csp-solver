import { defineConfig } from "@playwright/test";

// PLR-PLACE pass-2 RESEARCH lane. A copy of the estate's playwright.config.ts with the
// `webServer` dropped and the baseURL pointed at this lane's own server (127.0.0.1:4243,
// --strictPort, private vite cacheDir). The estate's default starts :3000 and must never be
// used here. No globalSetup: that file asserts the estate's own baseURL contract.
export default defineConfig({
  testDir: ".",
  timeout: 120000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: "http://127.0.0.1:4243",
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
  },
});
