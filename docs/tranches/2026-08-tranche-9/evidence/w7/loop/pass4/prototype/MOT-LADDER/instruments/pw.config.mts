import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./probes",
  timeout: 900000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: process.env.PW_BASE ?? "http://127.0.0.1:4246" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
