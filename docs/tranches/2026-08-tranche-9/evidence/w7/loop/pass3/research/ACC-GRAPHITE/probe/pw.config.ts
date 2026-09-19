// Scratch Playwright config: NO webServer (the estate's default starts :3000), baseURL on the
// lane's own port. chromium + webkit, the two rigs the wave measures on.
import { defineConfig } from "@playwright/test";
const HERE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/research/ACC-GRAPHITE/probe";
export default defineConfig({
  testDir: HERE,
  testMatch: /.*\.probe\.ts/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  timeout: 120_000,
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: { baseURL: "http://127.0.0.1:4235", viewport: { width: 1280, height: 800 } },
});
