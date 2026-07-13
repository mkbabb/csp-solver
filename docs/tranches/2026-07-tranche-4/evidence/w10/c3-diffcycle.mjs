// Cycle difficulty tiers and measure the crayon heading contrast in LIGHT theme (the failing theme).
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
const BASE = 'http://localhost:4486';
function lum({ r, g, b }) { const f = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); }
function ratio(a, b) { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); }
function hexToRgb(h) { h = h.replace('#', ''); return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }; }
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
const page = await ctx.newPage();
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
// find the difficulty option buttons and click each, measuring the heading each time
async function measHeading() {
  return await page.evaluate(() => {
    const h = [...document.querySelectorAll('.section-heading')].find((n) => n.textContent.trim() === 'Difficulty');
    if (!h) return null;
    const s = getComputedStyle(h);
    return { color: s.color, fs: s.fontSize, fw: s.fontWeight };
  });
}
const results = {};
for (const label of ['Easy', 'Medium', 'Hard']) {
  const clicked = await page.evaluate((lab) => {
    const b = [...document.querySelectorAll('.ctrl-btn')].find((n) => n.textContent.trim() === lab && n.offsetParent !== null);
    if (b) { b.click(); return true; }
    return false;
  }, label);
  await page.waitForTimeout(250);
  const m = await measHeading();
  if (m) {
    const rgb = m.color.match(/\d+/g).map(Number);
    const fg = { r: rgb[0], g: rgb[1], b: rgb[2] };
    // card bg #fdfdfc
    const bg = hexToRgb('#fdfdfc');
    results[label] = { clicked, color: m.color, fs: m.fs, fw: m.fw, ratio: +ratio(fg, bg).toFixed(2) };
  }
}
console.log(JSON.stringify(results, null, 2));
await browser.close();
