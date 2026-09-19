// T9-W7 pass 3 · MRK-ABS PROTOTYPE — the ESTATE's specs, run against this lane's BUILT PREVIEW.
// A copy of the estate's default MINUS `webServer`, pointed at 127.0.0.1:4241 (the prototype's
// `vite preview` off its own dist). Never the estate's own config — it starts :3000.
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "../e2e",
  timeout: 90000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  retries: 0,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: process.env.ABS_BASE ?? "http://127.0.0.1:4241",
    trace: "off",
    video: "off",
    screenshot: "off",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
