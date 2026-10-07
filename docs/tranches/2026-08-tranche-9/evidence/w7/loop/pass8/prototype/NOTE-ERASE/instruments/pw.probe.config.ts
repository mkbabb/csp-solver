import { defineConfig } from "@playwright/test";
// NOTE-ERASE pass-8 scratch probes (out-of-tree copy). No webServer; ports named in each probe.
export default defineConfig({
  testDir: ".",
  testMatch: /\.probe\.ts$/,
  timeout: 240000,
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: "list",
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erase8/pw-out-probe",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
