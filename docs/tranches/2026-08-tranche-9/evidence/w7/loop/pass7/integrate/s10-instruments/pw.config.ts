import base from "../playwright.config";
export default {
  ...base,
  testDir: "../e2e",
  globalSetup: "../e2e/global-setup.ts",
  webServer: undefined,
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/integ-s10-7/pw-out",
  reporter: [["list"], ["json", { outputFile: process.env.PW_JSON || "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/integ-s10-7/pw-last.json" }]],
  use: { ...base.use, baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4232" },
};
