import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/critique/PAL-WALK-probe",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  timeout: 180000,
  use: { baseURL: "http://127.0.0.1:4238", deviceScaleFactor: 3 },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], deviceScaleFactor: 3 } },
    { name: "webkit", use: { ...devices["Desktop Safari"], deviceScaleFactor: 3 } },
  ],
});
