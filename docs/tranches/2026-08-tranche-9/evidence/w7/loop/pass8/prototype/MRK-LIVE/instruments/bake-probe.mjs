import { playwright } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e/lib/paint-lib.mjs";
const browser = await playwright().chromium.launch();
for (const rm of ["no-preference", "reduce"]) for (const sub of [3, 4]) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: rm })).newPage();
  const t0 = Date.now();
  await page.goto("http://127.0.0.1:4238/?size=" + sub + "&game=sudoku");
  await page.waitForFunction((n) => document.querySelectorAll(".board-shell .game-cell").length === n, sub ** 4, { timeout: 120000 });
  const tCells = Date.now() - t0; const seq = [];
  for (let i = 0; i < 40; i++) { seq.push(await page.evaluate(() => document.querySelectorAll(".board-shell image.boil-frame-bitmap").length + "/" + document.querySelectorAll(".board-shell .hand-drawn-grid > g").length)); await page.waitForTimeout(150); }
  console.log(rm, sub, "cells at", tCells, "ms; images/transition-g every 150 ms:", seq.join(" "));
  await page.context().close();
}
await browser.close();
