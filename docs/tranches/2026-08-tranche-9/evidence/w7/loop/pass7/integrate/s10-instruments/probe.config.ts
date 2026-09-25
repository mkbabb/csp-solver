import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: ".", testMatch: /(park|unpark)\.probe\.ts$/, timeout: 120000, fullyParallel: true, retries: 0,
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/integ-s10-7/pw-out-probe", reporter: "list",
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } }],
});
