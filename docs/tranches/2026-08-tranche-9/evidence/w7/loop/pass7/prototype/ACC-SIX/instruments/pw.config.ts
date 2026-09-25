import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '..',
  testMatch: ['e2e/*.spec.ts', '.acc6p7/*.spec.ts'],
  outputDir: process.env.PWOUT ?? '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6p7-pw-out',
  reporter: 'list',
  workers: 1,
  timeout: 180000,
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  use: { baseURL: process.env.BASE, viewport: { width: 1280, height: 800 } },
});
