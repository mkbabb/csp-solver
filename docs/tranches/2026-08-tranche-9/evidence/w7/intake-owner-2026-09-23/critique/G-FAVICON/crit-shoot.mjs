// critic's independent painted read: <img> of the lane icon (4257) and control favicon (4258)
import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const [en, OUT] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const strips = { 'light-active': '#ffffff', 'light-strip': '#dee1e6', 'dark-active': '#35363a', 'dark-strip': '#202124' };
const arms = { W: 'http://127.0.0.1:4257/icon.svg', main: 'http://127.0.0.1:4258/favicon.svg' };
const b = await (en === 'webkit' ? webkit : chromium).launch();
let n = 0;
for (const dpr of [1, 2]) for (const scheme of ['light', 'dark']) {
  const ctx = await b.newContext({ deviceScaleFactor: dpr, colorScheme: scheme, viewport: { width: 120, height: 120 } });
  const p = await ctx.newPage();
  for (const [sk, bg] of Object.entries(strips)) {
    if (!sk.startsWith(scheme)) continue;
    for (const [arm, url] of Object.entries(arms)) for (const size of [16, 32]) for (const k of [1, 2]) {
      await p.setContent(`<html><body style="margin:0;background:${bg}"><img id=f src="${url}?k=${k}" width=${size} height=${size} style="position:absolute;left:8px;top:8px"></body></html>`);
      await p.waitForFunction(() => document.getElementById('f').complete && document.getElementById('f').naturalWidth > 0);
      await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      await p.screenshot({ path: `${OUT}/${en}_dpr${dpr}_${sk}_${arm}_${size}_n${k}.png`, clip: { x: 8, y: 8, width: size, height: size } });
      n++;
    }
  }
  await ctx.close();
}
await b.close();
console.log(en, 'shots', n);
