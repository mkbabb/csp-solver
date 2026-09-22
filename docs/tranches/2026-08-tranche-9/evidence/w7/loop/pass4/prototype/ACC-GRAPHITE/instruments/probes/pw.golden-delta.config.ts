import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend/.acc-graphite",
  testMatch: /golden-delta\.probe\.ts$/,
  timeout: 60000,
  expect: { timeout: 15000, toHaveScreenshot: { threshold: 0.3, scale: "device", animations: "disabled", caret: "hide" } },
  snapshotPathTemplate: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend/e2e/goldens/{arg}-{platform}{ext}",
  workers: 1, retries: 0, reporter: [["list"]],
  outputDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc-graphite/pw-golden-delta",
  use: { baseURL: process.env.BASE, viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, reducedMotion: "reduce", launchOptions: { args: ["--force-color-profile=srgb"] } },
});
