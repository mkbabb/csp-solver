// G6 — frames per open, HEAD control (4256) vs prototype (4255), presses INTERLEAVED arm by arm in one run
// so load drift lands on both. Opus's counting kept verbatim for comparability: rAF dt over 1.2 s after the
// press, "> 16.7" read as dt > 17.5 (vsync jitter guard), "> 25" as dt > 25; plus the rung's own window (300 ms).
//   node rate.mjs <chromium|webkit> <n> <out.json>
import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';
const [engName, nArg, outFile] = process.argv.slice(2);
const eng = engName === 'webkit' ? webkit : chromium;
const N = Number(nArg || 10);
const ARMS = { base: 'http://127.0.0.1:4256/', proto: 'http://127.0.0.1:4255/' };
const browser = await eng.launch();
const pages = {};
for (const arm of Object.keys(ARMS)) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(ARMS[arm], { waitUntil: 'load' });
  await page.waitForSelector('.controls-card .action-bar .info-btn', { state: 'attached', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.evaluate(() => { const mark = () => { if (window.__tPress === null) window.__tPress = performance.now(); }; document.addEventListener('pointerdown', mark, true); });
  pages[arm] = page;
}
const press = async (page) => {
  await page.evaluate(() => {
    window.__tPress = null; window.__dt = []; let last = performance.now(); const t0 = last;
    const tick = () => { const now = performance.now(); window.__dt.push([now, now - last]); last = now; if (now - t0 < 1700) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  await page.waitForTimeout(150);
  const b = await page.locator('.info-btn').boundingBox();
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.move(2, 2);
  await page.waitForTimeout(1600);
  return page.evaluate(() => {
    const d = window.__dt.filter(([t]) => t > window.__tPress);
    const w12 = d.filter(([t]) => t <= window.__tPress + 1200).map(([, x]) => x);
    const w3 = d.filter(([t]) => t <= window.__tPress + 300).map(([, x]) => x);
    return { over16_7: w12.filter((x) => x > 17.5).length, over25: w12.filter((x) => x > 25).length, max: +Math.max(...w12).toFixed(1), rung_over16_7: w3.filter((x) => x > 17.5).length, rung_max: +Math.max(...w3).toFixed(1), n: w12.length, expanded: document.querySelector('.info-btn').getAttribute('aria-expanded') };
  });
};
const out = { eng: eng.name(), N, base: { open: [], close: [] }, proto: { open: [], close: [] } };
for (let k = 0; k < N; k++) for (const arm of ['base', 'proto']) {
  const p = pages[arm];
  await p.evaluate(() => { document.querySelector('.controls-card').scrollTop = 0; });
  out[arm].open.push(await press(p));
  out[arm].close.push(await press(p));
}
const stat = (a) => { const s = [...a].sort((x, y) => x - y); return { min: s[0], med: s[s.length >> 1], max: s.at(-1) }; };
out.summary = {};
for (const arm of ['base', 'proto']) for (const kind of ['open', 'close']) {
  const r = out[arm][kind];
  out.summary[`${arm}.${kind}`] = { over16_7: stat(r.map((x) => x.over16_7)), over25: stat(r.map((x) => x.over25)), longest: stat(r.map((x) => x.max)), rung_over16_7: stat(r.map((x) => x.rung_over16_7)), expandedOk: r.every((x) => x.expanded === (kind === 'open' ? 'true' : 'false')) };
}
await browser.close();
writeFileSync(outFile, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out.summary));
