import { createRequire } from 'node:module';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const pw = require('playwright');
const SP = process.env.SP; const init = readFileSync(SP + '/init2.js', 'utf8');
const [engine, vp, mode, reps, base, theme, prm, tag] = process.argv.slice(2);
const vps = { d: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 }, m: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: engine !== 'webkit' ? true : true } };
mkdirSync(SP + '/raw', { recursive: true });
const browser = await pw[engine].launch({ headless: true });
for (let i = 0; i < Number(reps); i++) {
  const ctx = await browser.newContext({ ...vps[vp], colorScheme: theme || 'light', reducedMotion: prm === 'prm' ? 'reduce' : 'no-preference' });
  if (process.env.ABL) await ctx.addInitScript(() => { const tb = HTMLCanvasElement.prototype.toBlob; HTMLCanvasElement.prototype.toBlob = function (...a) { const c = this; if (c.width !== 1272) return tb.apply(c, a); setTimeout(() => tb.apply(c, a), 1700); }; const di = CanvasRenderingContext2D.prototype.drawImage; CanvasRenderingContext2D.prototype.drawImage = function (...a) { const x = this; if (x.canvas.width !== 1272) return di.apply(x, a); setTimeout(() => di.apply(x, a), 1500); }; });
  if (process.env.HIDE) await ctx.addInitScript((sel) => { document.addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = sel + '{display:none!important}'; document.head.appendChild(st); }); }, process.env.HIDE);
  await ctx.addInitScript(init);
  const page = await ctx.newPage();
  if (engine === 'chromium') { const c = await ctx.newCDPSession(page); await c.send('Network.enable'); await c.send('Network.setCacheDisabled', { cacheDisabled: mode === 'cold' }); }
  const url = base + '/';
  if (mode === 'warm') { await page.goto(url, { waitUntil: 'load' }); await page.waitForTimeout(3500); await page.reload({ waitUntil: 'load' }); }
  else await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(5200);
  const shot = process.env.SHOT; 
  const data = await page.evaluate(() => { const nav = performance.getEntriesByType('navigation')[0]; return { ...window.__DI, nav: nav ? { rs: Math.round(nav.responseStart), dcl: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd) } : null, fontsRes: performance.getEntriesByType('resource').filter((r) => /woff2?/.test(r.name)).map((r) => [r.name.split('/').pop(), Math.round(r.startTime), Math.round(r.responseEnd)]) }; });
  const name = `${tag}-${engine}-${vp}-${mode}-${theme || 'light'}-${prm || 'motion'}-${i}`;
  writeFileSync(`${SP}/raw/${name}.json`, JSON.stringify(data));
  console.log(name, 'frames', data.f.length, 'lt', data.lt.length, 'loaf', data.loaf.length, 'err', data.err || '');
  await ctx.close();
}
await browser.close();
