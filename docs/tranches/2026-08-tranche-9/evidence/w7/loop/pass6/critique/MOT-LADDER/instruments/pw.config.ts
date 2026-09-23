import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/motladder6crit-t6/web/frontend/e2e',
  testMatch: [/ladder-prm\.spec\.ts/, /live-fit-ablation\.spec\.ts/],
  outputDir: '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/motladder6crit-pw-out',
  workers: 2,
  retries: 0,
  timeout: 60000,
  reporter: [['list']],
  use: { baseURL: process.env.BASE },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
