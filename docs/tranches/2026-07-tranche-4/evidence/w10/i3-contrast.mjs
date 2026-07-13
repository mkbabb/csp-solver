// I3 post-fix contrast ledger — cycles EASY/MEDIUM/HARD, measures the difficulty heading +
// dt-label + heading-value over the browser-resolved effective bg, both themes, both games.
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const BASE = process.env.BASE || 'http://localhost:4490';
const EV = '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-07-tranche-4/evidence/w10';
const URLS = { sudoku: `${BASE}/`, futoshiki: `${BASE}/?game=futoshiki` };

const HELPERS = () => {
  function parse(c) {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (m) { const p = m[1].split(/[,\/]/).map((s) => s.trim()); return { r: +p[0], g: +p[1], b: +p[2], a: p[3] === undefined ? 1 : +p[3] }; }
    const cs = c.match(/color\(srgb\s+([^)]+)\)/);
    if (cs) { const parts = cs[1].split('/'); const rgb = parts[0].trim().split(/\s+/).map(Number); const a = parts[1] !== undefined ? +parts[1] : 1; return { r: rgb[0] * 255, g: rgb[1] * 255, b: rgb[2] * 255, a }; }
    return null;
  }
  function over(t, b) { const a = t.a; return { r: a * t.r + (1 - a) * b.r, g: a * t.g + (1 - a) * b.g, b: a * t.b + (1 - a) * b.b, a: 1 }; }
  function toHex({ r, g, b }) { const h = (n) => Math.round(n).toString(16).padStart(2, '0'); return `#${h(r)}${h(g)}${h(b)}`; }
  function lum({ r, g, b }) { const f = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); }
  function ratio(fg, bg) { const l1 = lum(fg), l2 = lum(bg); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); }
  function effBg(el, fb) { const layers = []; let n = el; while (n && n.nodeType === 1) { const p = parse(getComputedStyle(n).backgroundColor); if (p && p.a > 0) layers.push(p); n = n.parentElement; } layers.reverse(); let base = null; for (const L of layers) base = base === null ? (L.a >= 1 ? { ...L, a: 1 } : over(L, fb)) : over(L, base); return base || fb; }
  window.__w = { parse, over, toHex, lum, ratio, effBg };
};
const paper = (t) => (t === 'dark' ? { r: 16, g: 15, b: 14, a: 1 } : { r: 250, g: 249, b: 245, a: 1 });

async function setTheme(page, t) { await page.evaluate((x) => { const h = document.documentElement; x === 'dark' ? h.classList.add('dark') : h.classList.remove('dark'); }, t); await page.waitForTimeout(150); }
async function pick(page, label) { return page.evaluate((lab) => { const b = [...document.querySelectorAll('.ctrl-btn')].find((n) => n.textContent.trim() === lab && n.offsetParent !== null); if (b) { b.click(); return true; } return false; }, label); }

async function measure(page, sel, name, fb) {
  return page.evaluate(({ sel, name, fb }) => {
    const W = window.__w;
    const el = [...document.querySelectorAll(sel)].find((n) => n.offsetParent !== null && (name.indexOf('heading:Difficulty') !== 0 || n.textContent.trim() === 'Difficulty'));
    if (!el) return null;
    const s = getComputedStyle(el);
    const fg = W.parse(s.color); if (!fg) return null;
    const bg = W.effBg(el, fb);
    const comp = fg.a < 1 ? W.over(fg, bg) : { ...fg, a: 1 };
    const r = W.ratio(comp, bg);
    const fs = parseFloat(s.fontSize), fw = parseInt(s.fontWeight, 10) || 400;
    return { name, fgHex: W.toHex(comp), bgHex: W.toHex(bg), fontPx: +fs.toFixed(1), weight: fw, ratio: +r.toFixed(2), pass: r >= 4.5 };
  }, { sel, name, fb });
}

async function main() {
  const browser = await chromium.launch();
  const out = { generatedAt: new Date().toISOString(), base: BASE, rows: {} };
  for (const [game, url] of Object.entries(URLS)) {
    for (const theme of ['light', 'dark']) {
      const fb = paper(theme);
      // desktop: cycle difficulty, measure heading each tier + dt-label
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: theme });
      const page = await ctx.newPage();
      await page.addInitScript(HELPERS);
      await page.goto(url, { waitUntil: 'networkidle' });
      await setTheme(page, theme);
      await page.waitForTimeout(300);
      for (const [tier, label] of [['EASY', 'Easy'], ['MEDIUM', 'Medium'], ['HARD', 'Hard']]) {
        await pick(page, label); await page.waitForTimeout(500);
        const m = await measure(page, '.section-heading', `heading:Difficulty:${tier}`, fb);
        if (m) out.rows[`${game}:${theme}:desktop:${m.name}`] = m;
      }
      const dt = await measure(page, '.dt-label', 'tally:dt-label', fb);
      if (dt) out.rows[`${game}:${theme}:desktop:dt-label`] = dt;
      await ctx.close();
      // mobile 390: heading-value (closed tab) — open the OTHER tab so difficulty tab is closed
      const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: theme, isMobile: true, hasTouch: true });
      const page2 = await ctx2.newPage();
      await page2.addInitScript(HELPERS);
      await page2.goto(url, { waitUntil: 'networkidle' });
      await setTheme(page2, theme);
      await page2.waitForTimeout(300);
      const hv = await measure(page2, '.heading-value', 'heading-value', fb);
      if (hv) out.rows[`${game}:${theme}:mobile:heading-value`] = hv;
      const dt2 = await measure(page2, '.dt-label', 'tally:dt-label(mobile)', fb);
      if (dt2) out.rows[`${game}:${theme}:mobile:dt-label`] = dt2;
      await ctx2.close();
    }
  }
  fs.writeFileSync(`${EV}/i3-contrast-raw.json`, JSON.stringify(out, null, 2));
  let fails = 0;
  for (const [k, m] of Object.entries(out.rows)) {
    if (!m.pass) fails++;
    console.log(`  ${m.pass ? 'PASS' : 'FAIL'} ${String(m.ratio).padStart(5)}:1  ${k.padEnd(48)} fg=${m.fgHex} bg=${m.bgHex} ${m.fontPx}px/${m.weight}`);
  }
  console.log(`\nTOTAL rows=${Object.keys(out.rows).length} FAILS=${fails}`);
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
