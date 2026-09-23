import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
const PAYLOAD = 'ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw';
for (const [en, eng] of [['chromium', chromium], ['webkit', webkit]]) {
  const b = await eng.launch(); const ctx = await b.newContext({ baseURL: 'http://127.0.0.1:4233', viewport: { width: 1280, height: 800 }, hasTouch: true, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const page = await ctx.newPage(); await page.goto('/?board=' + PAYLOAD); await page.waitForSelector('.controls-card', { state: 'attached' }); await page.waitForTimeout(800);
  await page.keyboard.press('Tab');
  const rows = [];
  for (const n of ['Clear the board', 'Fill in every cell that has only one possible number']) {
    const fv = await page.evaluate((n) => { const e = document.querySelector(`.action-bar [aria-label="${n}"]`); e.focus(); return e.matches(':focus-visible'); }, n);
    await page.waitForTimeout(450);
    rows.push(await page.evaluate(({ n, fv }) => { const btn = document.querySelector(`.action-bar [aria-label="${n}"]`); const note = btn.querySelector('.washi-label'); const nr = note.getBoundingClientRect(); const card = document.querySelector('.controls-card').getBoundingClientRect(); const cs = document.querySelector('.drawer-case').getBoundingClientRect();
      return { n: n.slice(0, 10), fv, opacity: getComputedStyle(note).opacity, noteTop: +nr.top.toFixed(2), noteBottom: +nr.bottom.toFixed(2), cardBottom: +card.bottom.toFixed(2), caseBottom: +cs.bottom.toFixed(2), spillPastCase: +(nr.bottom - cs.bottom).toFixed(2) }; }, { n, fv }));
  }
  console.log(JSON.stringify({ en, arm: 'ctl 74a2b5d9', cell: 'coarse1280', rows }));
  await b.close();
}
