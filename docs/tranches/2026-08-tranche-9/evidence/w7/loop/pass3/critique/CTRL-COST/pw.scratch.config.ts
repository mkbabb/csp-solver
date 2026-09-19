import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "/tmp/nonexistent-critic-tests",
  timeout: 90000,
  use: { baseURL: "http://127.0.0.1:4241" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
