import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { settled, mark, lobby } from './lib';
/** Does the solo desk's state-line read carry any peer id (the graft: pin every id a painted-text row's page seeds)? */
test('ids on the solo desk', async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(process.env.URL ?? './?size=3&difficulty=EASY');
  await settled(page);
  await mark(page).click();
  await expect(lobby(page)).toHaveClass(/is-open/);
  const r = await page.evaluate(() => ({
    local: localStorage.getItem('session-identity-v1'), session: sessionStorage.getItem('session-identity-v1'),
    url: location.search, rows: document.querySelectorAll('[data-lobby] .pl-row').length,
    state: [...document.querySelectorAll('[data-lobby] .pl-state')].map((e) => e.textContent?.trim()),
    svgInState: [...document.querySelectorAll('[data-lobby] .pl-state svg')].length,
  }));
  const l = JSON.stringify({ eng: info.project.name, ...r });
  fs.appendFileSync(process.env.OUT!, l + '\n'); console.log(l);
});
