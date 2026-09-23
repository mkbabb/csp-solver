// G-DRAWIN runner: census run2.mjs + one encoded ?board= payload, the injector, a longer span.
// usage: node run3.mjs <engine> <d|m> <cold|warm> <reps> <base> <light|dark> <motion|prm> <tag>
// env: SP (out dir), INJ="150,200" (busy ms, ms after first stroke), SPAN (ms), QS (extra query)
import { createRequire } from 'node:module';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const pw = require('playwright');
const SP = process.env.SP; const init = readFileSync(new URL('./init3.js', import.meta.url), 'utf8');
const [engine, vp, mode, reps, base, theme, prm, tag] = process.argv.slice(2);
const BOARD = 'ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5';
const qs = process.env.QS ?? `?board=${BOARD}`;
const span = Number(process.env.SPAN || 7000);
const vps = { d: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 }, m: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true } };
mkdirSync(SP + '/raw', { recursive: true });
const browser = await pw[engine].launch({ headless: true });
for (let i = 0; i < Number(reps); i++) {
  const ctx = await browser.newContext({ ...vps[vp], colorScheme: theme || 'light', reducedMotion: prm === 'prm' ? 'reduce' : 'no-preference' });
  const inj = process.env.INJ ? process.env.INJ.split(',').map(Number) : null;
  await ctx.addInitScript(([inj, span]) => { window.__INJ = inj; window.__SPAN = span; }, [inj, span]);
  if (process.env.DEALDELAY) await ctx.addInitScript((ms) => { const W = window.Worker; window.Worker = class extends W { constructor(...a) { super(...a); const pm = this.postMessage.bind(this); this.postMessage = (...m) => setTimeout(() => pm(...m), ms); } }; }, Number(process.env.DEALDELAY));
  await ctx.addInitScript(init);
  const page = await ctx.newPage();
  if (engine === 'chromium') { const c = await ctx.newCDPSession(page); await c.send('Network.enable'); await c.send('Network.setCacheDisabled', { cacheDisabled: mode === 'cold' }); }
  const url = base + '/' + qs;
  if (mode === 'warm') { await page.goto(url, { waitUntil: 'load' }); await page.waitForTimeout(4000); await page.reload({ waitUntil: 'load' }); }
  else await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(span - 800);
  const data = await page.evaluate(() => ({ ...window.__DI }));
  const name = `${tag}-${engine}-${vp}-${mode}-${theme || 'light'}-${prm || 'motion'}-${i}`;
  writeFileSync(`${SP}/raw/${name}.json`, JSON.stringify(data));
  console.log(name, 'frames', data.f.length, 'inj', JSON.stringify(data.inj || null), 'err', data.err || '');
  await ctx.close();
}
await browser.close();
