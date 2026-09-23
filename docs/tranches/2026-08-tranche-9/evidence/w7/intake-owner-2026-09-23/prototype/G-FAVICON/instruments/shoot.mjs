// The census's shoot.mjs, widened to the lane's arms: <img> at 16/32/48/180, DPR 1 and 2, colorScheme
// light and dark with each scheme's two strips, two bare photographs of every cell (n1, n2).
// usage: node shoot.mjs <chromium|webkit> <origin> <outdir>
import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const [en, ORIGIN, OUT] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const strips = { 'light-active': '#ffffff', 'light-strip': '#dee1e6', 'dark-active': '#35363a', 'dark-strip': '#202124' };
const arms = process.env.ARMS ? process.env.ARMS.split(',') : ['W', 'B', 'P', 'fable', 'opus', 'main'];
const svgs = [...arms, ...arms.map((a) => a + '-ng'), ...(arms.includes('main') ? ['main-nf'] : [])];
const SIZES = process.env.SIZES ? process.env.SIZES.split(',').map(Number) : [16, 32, 48, 180];
const b = await (en === 'webkit' ? webkit : chromium).launch();
let n = 0;
for (const dpr of [1, 2]) for (const scheme of ['light', 'dark']) {
  const ctx = await b.newContext({ deviceScaleFactor: dpr, colorScheme: scheme, viewport: { width: 220, height: 220 } });
  const p = await ctx.newPage();
  for (const [sk, bg] of Object.entries(strips)) {
    if (!sk.startsWith(scheme)) continue;
    for (const svg of svgs) for (const size of SIZES) for (const k of [1, 2]) {
      await p.goto(`${ORIGIN}/strip.html?svg=${svg}.svg&size=${size}&bg=${encodeURIComponent(bg)}&n=${k}`);
      await p.waitForFunction(() => document.getElementById('f').complete && document.getElementById('f').naturalWidth > 0);
      await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      await p.screenshot({ path: `${OUT}/${en}_dpr${dpr}_${sk}_${svg}_${size}_n${k}.png`, clip: { x: 4, y: 4, width: size + 8, height: size + 8 } });
      n++;
    }
  }
  await ctx.close();
}
await b.close();
console.log(en, 'shots', n);
