import { test, expect } from '@playwright/test';
import { encodeSudoku } from '../../e2e/wire';
// MOT-LADDER pass-7 critic: what SHIPS on the reveal subject and the curve token, per arm.
const SOLVED_9 = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];
const BLANKS = new Set([0, 4, 10, 22, 36, 40, 55, 61, 73, 80]);
const BOARD = encodeSudoku(3, Object.fromEntries(SOLVED_9.map((v, i) => [i, BLANKS.has(i) ? 0 : v])), 81);
test('reveal subject + curve token + unmeasured fit, as shipped', async ({ page }, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/?game=sudoku&board=' + BOARD);
  await page.locator('.board-cells').first().waitFor();
  const givens = await page.locator('.board-cells [aria-label*="given clue"]').count();
  const r = await page.evaluate(() => new Promise((res) => {
    const el = document.querySelector('.board-cells .game-cell') as HTMLElement;
    el.classList.add('cell-reveal-animated');
    requestAnimationFrame(() => setTimeout(() => {
      const cs = getComputedStyle(el);
      res({
        asset: [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split('/').pop(),
        dur: cs.animationDuration, fn: cs.animationTimingFunction, name: cs.animationName,
        tokenRoot: getComputedStyle(document.documentElement).getPropertyValue('--ease-anticipatePop').trim(),
        whisper: getComputedStyle(document.documentElement).getPropertyValue('--motion-whisper').trim(),
      });
    }, 0));
  }));
  console.log(`[${info.project.name}] givens=${givens} ${JSON.stringify(r)}`);
  expect(givens).toBe(71);
});
