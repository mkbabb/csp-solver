import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import sharp from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs';
const PAYLOAD = 'ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw';
for (const inset of [0, 34]) for (const theme of ['light', 'dark']) {
  const b = await chromium.launch(); const ctx = await b.newContext({ baseURL: 'http://127.0.0.1:4232', viewport: { width: 390, height: 844 }, hasTouch: true, colorScheme: theme, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const page = await ctx.newPage(); if (inset) { const s = await ctx.newCDPSession(page); await s.send('Emulation.setSafeAreaInsetsOverride', { insets: { bottom: inset } }); }
  await page.goto('/?board=' + PAYLOAD); await page.waitForSelector('.controls-card', { state: 'attached' }); await page.waitForTimeout(800);
  await page.locator('.drawer-tab').first().click(); let last = null; for (let i = 0; i < 80; i++) { await page.waitForTimeout(80); const t = await page.evaluate(() => document.querySelector('#controls-drawer').getBoundingClientRect().top); if (last !== null && Math.abs(t - last) < 0.05) break; last = t; }
  const bar = await page.evaluate(() => { const r = document.querySelector('.action-bar').getBoundingClientRect(); return { l: r.left, r: r.right, b: r.bottom }; });
  const clip = { x: 0, y: Math.floor(bar.b - 4), width: 390, height: 844 - Math.floor(bar.b - 4) };
  const grab = async () => { const buf = await page.screenshot({ clip, animations: 'allow' }); return sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true }); };
  const on = await grab(); await page.addStyleTag({ content: '.bar-frame svg { visibility: hidden !important }' }); await page.waitForTimeout(150); const off = await grab();
  const w = on.info.width, h = on.info.height; let lowest = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const o = (y * w + x) * 4; if (Math.max(...[0,1,2].map((k) => Math.abs(on.data[o+k] - off.data[o+k]))) > 24) { lowest = Math.max(lowest, y); break; } }
  const lowestY = clip.y + lowest / 2;
  console.log(JSON.stringify({ inset, theme, barBottom: +bar.b.toFixed(2), lowestLipInkY: lowestY, aboveViewport: +(844 - lowestY).toFixed(2), vsInsetLine: +((844 - inset) - lowestY).toFixed(2) }));
  await b.close();
}
