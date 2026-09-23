import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import sharp from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs';
const PAYLOAD = 'ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw';
const grab = async (page, clip) => { const buf = await page.screenshot({ clip, animations: 'allow' }); return sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true }); };
const maskRows = (on, off) => { const w = on.info.width, h = on.info.height; const m = []; for (let x = 0; x < w; x++) m.push([]); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const o = (y * w + x) * 4; if (Math.max(...[0,1,2].map((k) => Math.abs(on.data[o+k] - off.data[o+k]))) > 24) m[x].push(y); } return m; };
const ENG = (process.env.ENG||'chromium,webkit').split(','); const CELLS=(process.env.CELLS||'dock390,land844').split(','); const FRACS=(process.env.FRACS||'0,0.5').split(',').map(Number);
for (const [en, eng] of [['chromium', chromium], ['webkit', webkit]].filter(([n])=>ENG.includes(n))) for (const [cell, vw, vh] of [['dock390', 390, 844], ['land844', 844, 390]]) for (const frac of FRACS) { if (!CELLS.includes(cell)) continue;
  const b = await eng.launch(); const ctx = await b.newContext({ baseURL: process.env.BASE, viewport: { width: vw, height: vh }, hasTouch: true, colorScheme: 'dark', deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const page = await ctx.newPage(); await page.goto('/?board=' + PAYLOAD); await page.waitForSelector('.controls-card', { state: 'attached' }); await page.waitForTimeout(800);
  await page.locator('.drawer-tab').first().click(); let last = null; for (let i = 0; i < 80; i++) { await page.waitForTimeout(80); const t = await page.evaluate(() => document.querySelector('#controls-drawer').getBoundingClientRect().top); if (last !== null && Math.abs(t - last) < 0.05) break; last = t; }
  if (process.env.HIDE_SB) await page.addStyleTag({ content: '.controls-card { scrollbar-width: none !important } .controls-card::-webkit-scrollbar { display: none !important }' });
  const info = await page.evaluate((frac) => { const c = document.querySelector('#controls-drawer .controls-card'); c.scrollTop = Math.round((c.scrollHeight - c.clientHeight) * frac); return { st: c.scrollTop, foldBelow: c.hasAttribute('data-fold-below') }; }, frac);
  await page.waitForTimeout(+(process.env.SETTLE||400));
  const bar = await page.evaluate(() => { const r = document.querySelector('.action-bar').getBoundingClientRect(); const c = document.querySelector('#controls-drawer .controls-card').getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, cardBottom: c.bottom }; });
  const clip = { x: Math.max(0, Math.floor(bar.l - 10)), y: Math.floor(bar.t - 30), width: Math.floor(bar.r - bar.l + 20), height: 36 };
  const on = await grab(page, clip);
  const h1 = await page.addStyleTag({ content: '.bar-frame svg { visibility: hidden !important }' }); await page.waitForTimeout(150); const noLip = await grab(page, clip); await h1.evaluate((n) => n.remove());
  const h2 = await page.addStyleTag({ content: '.controls-card .tray-well > svg, .controls-card .tray-well > .outline-svg, .controls-card svg.outline-svg { visibility: hidden !important }' }); await page.waitForTimeout(150); const noWell = await grab(page, clip); await h2.evaluate((n) => n.remove());
  const lip = maskRows(on, noLip), well = maskRows(on, noWell);
  const zeroCols = []; let both = 0, touching = 0, minGap = Infinity, gaps = [];
  for (let x = 0; x < lip.length; x++) { if (!lip[x].length || !well[x].length) continue; const lipTop = Math.min(...lip[x]); const wellBelow = well[x].filter((y) => y < lipTop); if (!wellBelow.length) continue; both++; const g = (lipTop - Math.max(...wellBelow) - 1) / 2; gaps.push(g); if (g <= 1) zeroCols.push(x/2 + clip.x); minGap = Math.min(minGap, g); if (g <= 1) touching++; }
  gaps.sort((a, b) => a - b);
  console.log(JSON.stringify({ en, cell, frac, ...info, colsWithWellInkAboveLip: both, colsOfLip: lip.filter((c) => c.length).length, daylightCss_min: minGap === Infinity ? null : minGap, daylight_median: gaps.length ? gaps[gaps.length >> 1] : null, colsDaylightLE1css: touching, gaps: gaps.slice(0, 12), zeroColsX: zeroCols, clipX: clip.x, barL: bar.l, barR: bar.r }));
  await b.close();
}
