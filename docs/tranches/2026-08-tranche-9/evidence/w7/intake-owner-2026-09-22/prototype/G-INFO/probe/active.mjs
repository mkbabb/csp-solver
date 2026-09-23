// Attribution of the WebKit one-frame bar jump: hold a real mousedown for 400 ms on a verb (no click: the
// pointer leaves before the up) and log every frame the bar's box moves. Run on HEAD's own verbs too, so a
// jump there says the mechanism predates this prototype (`.icon-btn:active { transform: scale(0.93) }`).
//   node active.mjs <chromium|webkit> <n> <out.json>
import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';
const [engName, nArg, outFile] = process.argv.slice(2);
const eng = engName === 'webkit' ? webkit : chromium;
const CELLS = process.argv[5] === 'share' ? [['base', 'http://127.0.0.1:4256/', 'Share board link'], ['proto', 'http://127.0.0.1:4255/', 'Share board link'], ['proto', 'http://127.0.0.1:4255/', 'what the keys do']] : [['base', 'http://127.0.0.1:4256/', 'Fill in every cell that has only one possible number'], ['base', 'http://127.0.0.1:4256/', 'Solve puzzle'], ['proto', 'http://127.0.0.1:4255/', 'what the keys do'], ['proto', 'http://127.0.0.1:4255/', 'Fill in every cell that has only one possible number']];
const browser = await eng.launch();
const out = [];
for (let k = 0; k < Number(nArg); k++) for (const [arm, url, label] of CELLS) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForSelector('.controls-card .action-bar .info-btn', { state: 'attached', timeout: 30000 });
  await page.waitForTimeout(2500);
  const sel = `.action-bar button[aria-label="${label}"]`;
  await page.evaluate(() => {
    const bar = document.querySelector('.action-bar'); const b0 = bar.getBoundingClientRect().bottom; window.__j = []; window.__ox = 0; const card = document.querySelector('.controls-card'); const t0 = performance.now();
    const tick = () => { const d = bar.getBoundingClientRect().bottom - b0; if (Math.abs(d) > 0.5) window.__j.push(+d.toFixed(2)); window.__ox = Math.max(window.__ox, card.scrollWidth - card.clientWidth); if (performance.now() - t0 < 1500) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  const b = await page.locator(sel).boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(400);
  await page.mouse.move(2, 2);
  await page.mouse.up();
  await page.waitForTimeout(900);
  const [j, ox] = await page.evaluate(() => [window.__j, window.__ox]);
  out.push({ k, arm, label, framesMoved: j.length, values: [...new Set(j)], cardOverflowX: ox });
  await ctx.close();
}
await browser.close();
writeFileSync(outFile, JSON.stringify(out, null, 1));
for (const r of out) console.log(JSON.stringify(r));
