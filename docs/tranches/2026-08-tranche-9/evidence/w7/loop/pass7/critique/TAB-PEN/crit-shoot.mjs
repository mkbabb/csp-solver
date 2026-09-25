// TAB-PEN pass-7 critic: <img> photographs of the SERVED icons at 16 CSS px, DPR 1, two strips.
import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const [OUT] = process.argv.slice(2); fs.mkdirSync(OUT, { recursive: true });
const get = async (u) => (await fetch(u)).text();
const W = await get('http://127.0.0.1:4240/icon.svg');
const MAIN = await get('http://127.0.0.1:4244/favicon.svg');
const du = (s) => 'data:image/svg+xml;base64,' + Buffer.from(s).toString('base64');
const H = W.replace(/d="[^"]*"/, 'd="M23.6,8.7L23.9,6.3L15.2,5.9C11.2,5.8 9.3,8.1 9.6,10.9C10,13.9 12.8,14.7 16.6,16C21.4,17.5 24.2,18.9 23.8,21.7C23.5,24.7 19.9,26.3 15.4,26.1C11.4,25.9 8.4,24.2 8.1,22.2"');
const B = W.replace('stroke-width="4"', 'stroke-width="5"');
const ng = (s) => s.replace(/<path[^>]*\/>/, '');
const mainNg = MAIN.replace(/<g clip-path[\s\S]*<\/g>\s*<\/g>/, '');
const subj = { W: 'http://127.0.0.1:4240/icon.svg', main: 'http://127.0.0.1:4244/favicon.svg', H: du(H), B: du(B),
  'W-ng': du(ng(W)), 'H-ng': du(ng(H)), 'B-ng': du(ng(B)), 'main-ng': du(mainNg) };
const SIZE = +(process.env.SIZE ?? 16), DPR = +(process.env.DPR ?? 1);
for (const [en, E] of [['chromium', chromium], ['webkit', webkit]]) {
  const b = await E.launch();
  for (const [scheme, bg] of [['light', '#ffffff'], ['dark', '#202124']]) {
    const ctx = await b.newContext({ deviceScaleFactor: DPR, colorScheme: scheme, viewport: { width: 64, height: 64 } });
    const p = await ctx.newPage();
    for (const [k, src] of Object.entries(subj)) for (const n of [1, 2]) {
      await p.setContent(`<html><body style="margin:0;background:${bg}"><img id=f src="${src}" width=${SIZE} height=${SIZE} style="position:absolute;left:8px;top:8px"></body></html>`);
      await p.waitForFunction(() => document.getElementById('f').complete && document.getElementById('f').naturalWidth > 0);
      await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      await p.screenshot({ path: `${OUT}/${en}_${scheme}_${k}_n${n}.png`, clip: { x: 8, y: 8, width: SIZE, height: SIZE } });
    }
    await ctx.close();
  }
  await b.close();
}
console.log('done');
