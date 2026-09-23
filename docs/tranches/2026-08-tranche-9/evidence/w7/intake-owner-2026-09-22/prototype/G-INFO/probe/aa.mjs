// G10 painted AA at DPR 2 — forked from portfolio/G-INFO/opus-probe/aa.mjs (bg = the crop's modal pixel,
// ink = the luminance extreme and the median of pixels past half-way to it). Served dist, no DOM move:
// the prototype (4255) for the crib's dd / kbd, the "keys" sublabel and the "i" at rest and open; the HEAD
// control (4256) for its ringed "i" at rest and open.
//   node aa.mjs <chromium|webkit> <out.json>
import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import sharp from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs';
import { writeFileSync } from 'node:fs';
const [engName, outFile] = process.argv.slice(2);
const eng = engName === 'webkit' ? webkit : chromium;
const lum = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const cr = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
async function read(page, sel, theme) {
  const targets = await page.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => { const r = e.getBoundingClientRect(); return { text: e.textContent.trim(), x: r.left, y: r.top, w: r.width, h: r.height }; }).filter((t) => t.w > 0 && t.h > 0), sel);
  const rows = [];
  for (const t of targets) {
    const buf = await page.screenshot({ clip: { x: t.x - 2, y: t.y - 2, width: t.w + 4, height: t.h + 4 } });
    const { data } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const counts = new Map(); const Ls = [];
    for (let k = 0; k < data.length; k += 3) { const key = (data[k] << 16) | (data[k + 1] << 8) | data[k + 2]; counts.set(key, (counts.get(key) || 0) + 1); Ls.push(lum(data[k], data[k + 1], data[k + 2])); }
    const bgKey = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    const bgL = lum(bgKey >> 16, (bgKey >> 8) & 255, bgKey & 255);
    const extreme = theme === 'light' ? Math.min(...Ls) : Math.max(...Ls);
    const inks = Ls.filter((L) => Math.abs(L - bgL) > Math.abs(extreme - bgL) * 0.5).sort((a, b) => a - b);
    rows.push({ text: t.text, peak: +cr(extreme, bgL).toFixed(2), median: +cr(inks[inks.length >> 1], bgL).toFixed(2), bg: '#' + bgKey.toString(16).padStart(6, '0') });
  }
  const med = (k) => rows.map((r) => r[k]).sort((a, b) => a - b);
  return { n: rows.length, peakMin: med('peak')[0], medianMin: med('median')[0], medianMax: med('median').at(-1), bg: rows[0]?.bg, rows: rows.length > 3 ? undefined : rows };
}
const browser = await eng.launch();
const out = [];
for (const theme of ['light', 'dark']) for (const arm of ['proto', 'base']) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: theme, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(arm === 'proto' ? 'http://127.0.0.1:4255/' : 'http://127.0.0.1:4256/', { waitUntil: 'load' });
  await page.waitForSelector('.controls-card .action-bar .info-btn', { state: 'attached', timeout: 30000 });
  await page.waitForTimeout(2500);
  await page.mouse.move(2, 2);
  const r = { eng: eng.name(), theme, arm };
  r.glyphRest = await read(page, '.info-glyph', theme);
  if (arm === 'proto') r.keysRest = await read(page, '.info-btn .icon-sublabel', theme);
  const ib = await page.locator('.info-btn').boundingBox();
  await page.mouse.click(ib.x + ib.width / 2, ib.y + ib.height / 2);
  await page.mouse.move(2, 2);
  await page.waitForTimeout(900);
  r.glyphOpen = await read(page, '.info-glyph', theme);
  if (arm === 'proto') {
    r.keysOpen = await read(page, '.info-btn .icon-sublabel', theme);
    // the word alone, the scribble struck (the underline's own ink would otherwise set the extreme)
    await page.addStyleTag({ content: '.info-btn .icon-sublabel::after { display: none !important; }' });
    await page.waitForTimeout(100);
    r.keysOpenWordOnly = await read(page, '.info-btn .icon-sublabel', theme);
    r.dd = await read(page, '#keys-fold dd', theme);
    r.kbd = await read(page, '#keys-fold kbd', theme);
    r.siblings = await read(page, '.action-verbs .icon-btn:not(.info-btn) .icon-sublabel', theme);
  }
  out.push(r);
  await ctx.close();
}
await browser.close();
writeFileSync(outFile, JSON.stringify(out, null, 1));
for (const r of out) console.log(JSON.stringify(r));
