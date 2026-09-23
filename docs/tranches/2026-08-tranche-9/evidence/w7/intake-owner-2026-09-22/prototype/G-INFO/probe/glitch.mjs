// The WebKit 17 px one-frame bar jump seen in 2 of 36 WebKit prototype cells (top · pointer click): repeat
// the cell n times per arm and dump only the frames where the verbs, the "i" or the bar move > 0.5 px.
//   node glitch.mjs <chromium|webkit> <theme> <n> <prm|no> <out.json>
import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';
const [engName, theme, nArg, prmArg, outFile] = process.argv.slice(2);
const eng = engName === 'webkit' ? webkit : chromium;
const ARMS = { base: 'http://127.0.0.1:4256/', proto: 'http://127.0.0.1:4255/' };
const browser = await eng.launch();
const out = [];
for (let k = 0; k < Number(nArg); k++) for (const arm of ['base', 'proto']) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: theme, deviceScaleFactor: 2, reducedMotion: prmArg === 'prm' ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  await page.goto(ARMS[arm], { waitUntil: 'load' });
  await page.waitForSelector('.controls-card .action-bar .info-btn', { state: 'attached', timeout: 30000 });
  await page.waitForTimeout(2500);
  await page.evaluate(() => {
    window.__tPress = null; document.addEventListener('pointerdown', () => { if (window.__tPress === null) window.__tPress = performance.now(); }, true);
    const bar = document.querySelector('.action-bar'); const info = document.querySelector('.info-btn'); const f = document.getElementById('keys-fold'); const c = document.querySelector('.controls-card');
    const v = [...bar.querySelectorAll('.action-verbs > .icon-btn')].filter((e) => getComputedStyle(e).display !== 'none');
    const r0 = { bar: bar.getBoundingClientRect().bottom, info: info.getBoundingClientRect().top, v0: v[0].getBoundingClientRect().top };
    window.__g = []; const t0 = performance.now();
    const tick = (ts) => { const now = performance.now(); const b = bar.getBoundingClientRect(); const i = info.getBoundingClientRect(); const vv = v[0].getBoundingClientRect(); const fr = f.getBoundingClientRect();
      const d = { barBot: b.bottom - r0.bar, info: i.top - r0.info, v0: vv.top - r0.v0 };
      if (Math.max(...Object.values(d).map(Math.abs)) > 0.5) window.__g.push({ t: +(now - (window.__tPress ?? now)).toFixed(1), ts: +ts.toFixed(1), ...Object.fromEntries(Object.entries(d).map(([a, x]) => [a, +x.toFixed(2)])), foldTop: +fr.top.toFixed(2), foldH: +fr.height.toFixed(2), st: c.scrollTop, infoTransform: getComputedStyle(info).transform, active: info.matches(':active'), hover: info.matches(':hover') });
      if (now - t0 < 2000) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  await page.waitForTimeout(150);
  const b = await page.locator('.info-btn').boundingBox();
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.move(2, 2);
  await page.waitForTimeout(1900);
  const g = await page.evaluate(() => window.__g);
  out.push({ k, arm, jumps: g.length, frames: g.slice(0, 8) });
  await ctx.close();
}
await browser.close();
writeFileSync(outFile, JSON.stringify(out, null, 1));
for (const r of out) console.log(r.k, r.arm, 'frames moved:', r.jumps, JSON.stringify(r.frames.slice(0, 3)));
