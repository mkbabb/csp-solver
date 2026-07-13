// C3 a11y measurement probe — GATE 1 difficulty contrast, against LIVE dist on :4486.
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const BASE = process.env.BASE || 'http://localhost:4486';
const EV = '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-07-tranche-4/evidence/w10';
fs.mkdirSync(EV, { recursive: true });

const URLS = { sudoku: `${BASE}/`, futoshiki: `${BASE}/?game=futoshiki` };

const PAGE_HELPERS = () => {
  function parse(c) {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (m) {
      const p = m[1].split(/[,\/]/).map((s) => s.trim());
      return { r: +p[0], g: +p[1], b: +p[2], a: p[3] === undefined ? 1 : +p[3] };
    }
    const cs = c.match(/color\(srgb\s+([^)]+)\)/);
    if (cs) {
      const parts = cs[1].split('/');
      const rgb = parts[0].trim().split(/\s+/).map(Number);
      const a = parts[1] !== undefined ? +parts[1] : 1;
      return { r: rgb[0] * 255, g: rgb[1] * 255, b: rgb[2] * 255, a };
    }
    return null;
  }
  function over(top, bot) {
    const a = top.a;
    return { r: a * top.r + (1 - a) * bot.r, g: a * top.g + (1 - a) * bot.g, b: a * top.b + (1 - a) * bot.b, a: 1 };
  }
  function toHex({ r, g, b }) {
    const h = (n) => Math.round(n).toString(16).padStart(2, '0');
    return `#${h(r)}${h(g)}${h(b)}`;
  }
  function lum({ r, g, b }) {
    const f = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  function ratio(fg, bg) { const l1 = lum(fg), l2 = lum(bg); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); }
  function effectiveBg(el, fallback) {
    const layers = [];
    let n = el;
    while (n && n.nodeType === 1) {
      const p = parse(getComputedStyle(n).backgroundColor);
      if (p && p.a > 0) layers.push(p);
      n = n.parentElement;
    }
    layers.reverse();
    let base = null;
    for (const L of layers) base = base === null ? (L.a >= 1 ? { ...L, a: 1 } : over(L, fallback)) : over(L, base);
    return base || fallback;
  }
  window.__wcag = { parse, over, toHex, lum, ratio, effectiveBg };
};

function paperFor(theme) { return theme === 'dark' ? { r: 16, g: 15, b: 14, a: 1 } : { r: 250, g: 249, b: 245, a: 1 }; }

async function setTheme(page, theme) {
  await page.evaluate((t) => { const h = document.documentElement; t === 'dark' ? h.classList.add('dark') : h.classList.remove('dark'); }, theme);
  await page.waitForTimeout(150);
}

async function contrastRows(page, theme) {
  const fallback = paperFor(theme);
  return await page.evaluate((fallback) => {
    const W = window.__wcag;
    const rows = [];
    function isVisible(el) {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.01;
    }
    function push(name, el) {
      if (!el || !isVisible(el)) return;
      const s = getComputedStyle(el);
      const fg = W.parse(s.color);
      if (!fg) return;
      const bg = W.effectiveBg(el, fallback);
      const comp = fg.a < 1 ? W.over(fg, bg) : { ...fg, a: 1 };
      const ratio = W.ratio(comp, bg);
      const fsize = parseFloat(s.fontSize), fweight = parseInt(s.fontWeight, 10) || 400;
      const large = fsize >= 24 || (fsize >= 18.66 && fweight >= 700);
      rows.push({ surface: name, text: (el.textContent || '').trim().slice(0, 24), fgRaw: s.color,
        fgHex: W.toHex(comp), bgHex: W.toHex(bg), fontPx: +fsize.toFixed(1), weight: fweight,
        largeText: large, ratio: +ratio.toFixed(2), passAA_4_5: ratio >= 4.5, passLarge_3: ratio >= 3.0 });
    }
    document.querySelectorAll('.section-heading').forEach((h) => {
      if (!isVisible(h)) return;
      const t = (h.textContent || '').trim();
      if (t === 'Difficulty') push('heading:Difficulty(crayon)', h);
      else if (t === 'Size') push('heading:Size(muted)', h);
      else if (t === 'New game') push('heading:NewGame(muted)', h);
    });
    document.querySelectorAll('.ctrl-btn').forEach((b) => {
      if (!isVisible(b)) return;
      const sel = b.classList.contains('selected-item');
      push(`option:${(b.textContent || '').trim()}:${sel ? 'SEL' : 'unsel'}`, b);
    });
    document.querySelectorAll('.heading-value').forEach((v) => push('heading-value', v));
    document.querySelectorAll('.dt-label').forEach((v) => push('tally:dt-label', v));
    document.querySelectorAll('.dt-name').forEach((v) => push('tally:dt-name(collapsed)', v));
    const fi = document.querySelector('.icon-btn');
    if (fi) push('icon-btn(muted ink, info)', fi);
    return rows;
  }, fallback);
}

async function run(browser, game, url, theme, viewport, label, extra = {}) {
  const ctx = await browser.newContext({ viewport, colorScheme: theme, ...extra });
  const page = await ctx.newPage();
  await page.addInitScript(PAGE_HELPERS);
  await page.goto(url, { waitUntil: 'networkidle' });
  await setTheme(page, theme);
  await page.waitForTimeout(350);
  const rows = await contrastRows(page, theme);
  await ctx.close();
  return rows;
}

async function main() {
  const browser = await chromium.launch();
  const out = { generatedAt: new Date().toISOString(), base: BASE, note: 'browser-resolved colors, effective bg composited over ancestor bg-colors then theme paper fallback', contrast: {} };
  for (const [game, url] of Object.entries(URLS)) {
    for (const theme of ['light', 'dark']) {
      out.contrast[`${game}:${theme}:desktop1280`] = await run(browser, game, url, theme, { width: 1280, height: 900 }, 'desktop');
      out.contrast[`${game}:${theme}:mobile390`] = await run(browser, game, url, theme, { width: 390, height: 844 }, 'mobile', { isMobile: true, hasTouch: true });
    }
  }
  fs.writeFileSync(`${EV}/c3-contrast-raw.json`, JSON.stringify(out, null, 2));
  for (const [k, rows] of Object.entries(out.contrast)) {
    console.log(`\n== ${k} ==`);
    for (const r of rows) console.log(`  ${r.passAA_4_5 ? 'PASS' : 'FAIL'} ${r.ratio.toFixed(2).padStart(5)}:1  ${r.surface.padEnd(34)} fg=${r.fgHex} bg=${r.bgHex} ${r.fontPx}px/${r.weight}${r.largeText ? ' [large]' : ''}`);
  }
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
