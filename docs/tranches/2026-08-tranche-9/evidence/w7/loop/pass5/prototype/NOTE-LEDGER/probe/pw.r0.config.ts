import { defineConfig } from "@playwright/test";
// NOTE-LEDGER pass-5 scratch: r0's R3 copies (OUT re-pointed, deal pinned), baseURL from env.
export default defineConfig({
  testDir: ".",
  testMatch: /r0-.*\.probe\.ts$/,
  timeout: 400000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger/pw-r0-out",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: { baseURL: process.env.R0_BASE, viewport: { width: 1280, height: 800 }, screenshot: "off" },
});
