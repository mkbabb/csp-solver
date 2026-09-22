// painted AA of the crib in the strip arm: per dd / kbd element, screenshot at DPR2, bg = mode pixel, ink = extreme luminance pixel
import { chromium, webkit } from 'playwright';
import sharp from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs';
const eng = process.argv[2] === 'webkit' ? webkit : chromium;
const out = [];
const browser = await eng.launch();
const lum = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const cr = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: theme, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4259/', { waitUntil: 'load' });
  await page.waitForSelector('.controls-card .action-bar .info-btn', { timeout: 30000 });
  await page.waitForTimeout(2500);
  await page.evaluate(async () => {
    const bar = document.querySelector('.action-bar'); const fold = document.getElementById('keys-fold');
    const st = document.createElement('style');
    st.textContent = `.action-bar{grid-template-rows:auto auto}.action-bar > #keys-fold{grid-column:1 / -1;grid-row:1}.action-bar > .action-verbs{grid-row:2}.action-bar > .info-btn{grid-row:2}`;
    document.head.append(st); bar.prepend(fold);
    Element.prototype.scrollIntoView = function () {};
  });
  const ib = await page.locator('.info-btn').boundingBox();
  await page.mouse.click(ib.x + ib.width / 2, ib.y + ib.height / 2);
  await page.mouse.move(5, 5);
  await page.waitForTimeout(800);
  const targets = await page.evaluate(() => [...document.querySelectorAll('#keys-fold dd, #keys-fold kbd, .info-glyph, .action-verbs .icon-sublabel')].map((e, i) => { const r = e.getBoundingClientRect(); return { i, tag: e.tagName.toLowerCase() + (e.className ? '.' + e.className : ''), text: e.textContent.trim(), x: r.left, y: r.top, w: r.width, h: r.height }; }));
  for (const t of targets) {
    const buf = await page.screenshot({ clip: { x: t.x - 2, y: t.y - 2, width: t.w + 4, height: t.h + 4 } });
    const { data: raw, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true }); const png = { data: [] }; for (let q = 0; q < raw.length; q += 3) png.data.push(raw[q], raw[q+1], raw[q+2], 255); const counts = new Map(); const Ls = [];
    for (let k = 0; k < png.data.length; k += 4) { const key = (png.data[k] << 16) | (png.data[k + 1] << 8) | png.data[k + 2]; counts.set(key, (counts.get(key) || 0) + 1); Ls.push(lum(png.data[k], png.data[k + 1], png.data[k + 2])); }
    const bgKey = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    const bgL = lum(bgKey >> 16, (bgKey >> 8) & 255, bgKey & 255);
    const extreme = theme === 'light' ? Math.min(...Ls) : Math.max(...Ls);
    // median of ink pixels: those beyond 50% of the way to the extreme
    const inks = Ls.filter(L => Math.abs(L - bgL) > Math.abs(extreme - bgL) * 0.5).sort((a, b) => a - b);
    const med = inks[inks.length >> 1];
    out.push({ eng: eng.name(), theme, tag: t.tag, text: t.text, peak: +cr(extreme, bgL).toFixed(2), median: +cr(med, bgL).toFixed(2), bg: '#' + bgKey.toString(16).padStart(6, '0') });
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(out));
