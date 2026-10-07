export default {
  testDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive8b/hz", testMatch: /p6-hz\.probe\.ts$/, outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive8b/pw-out-hz", timeout: 60000, workers: 2, retries: 0, reporter: "list",
  projects: [ { name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } } ],
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4238", viewport: { width: 1280, height: 800 } },
};
