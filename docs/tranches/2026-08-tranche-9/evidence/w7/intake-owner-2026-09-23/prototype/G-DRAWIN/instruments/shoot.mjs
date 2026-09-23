// G-DRAWIN photographs: freeze the page's rAF (JS-driven motion stops; the hand clock then
// resumes capped, so the freeze itself cannot jump it) at a named instant and shoot DPR2/3 PNGs.
// usage: node shoot.mjs <engine> <d|m> <light|dark> <base> <tag> <cond> [cond2...]
// conds: frame375 · twofronts · rub50 · predrawn (+ settled after resume) · rest
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const pw = require('playwright');
const [engine, vp, theme, base, tag, ...conds] = process.argv.slice(2);
const OUT = process.env.OUT; mkdirSync(OUT, { recursive: true });
const BOARD = 'ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5';
const vps = { d: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 }, m: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true } };
const freezeInit = () => {
  const raf = window.requestAnimationFrame.bind(window);
  let held = []; window.__frozen = false;
  window.requestAnimationFrame = (cb) => raf((ts) => { if (window.__frozen) held.push(cb); else cb(ts); });
  window.__resume = () => { document.getAnimations().forEach((x) => { if (x.playState === 'paused') x.play(); }); window.__frozen = false; const h = held; held = []; for (const cb of h) raf(cb); };
  const prog = () => [...document.querySelectorAll('svg.hand-drawn-grid > g:not(.boil-frame-layer) path.grid-line')].map((p) => { const da = p.style.strokeDasharray; if (!da || da === 'none') return 1; return 1 - parseFloat(p.style.strokeDashoffset) / parseFloat(da); });
  let allOneAt = null;
  const test = {
    frame375: () => { const pl = prog(); return pl.length && pl[0] >= 0.375 && pl[0] < 0.6; },
    twofronts: () => { const pl = prog(); const part = pl.map((p, i) => [p, i]).filter(([p]) => p > 0.001 && p < 0.999); return part.length === 2 && part[0][1] >= 5 && part.some(([p]) => p > 0.85); },
    rub50: () => { const lg = document.querySelector('.handwritten-logo'); const gr = lg?.querySelector('mask linearGradient'); if (!gr) return false; const w = parseFloat(lg.getAttribute('viewBox').split(' ')[2]); const x = parseFloat(gr.getAttribute('x2')); return x / w >= 0.45 && x / w < 0.62; },
    predrawn: () => { const pl = prog(); if (!pl.length || pl.some((p) => p < 0.999) || document.querySelectorAll('svg.hand-drawn-grid > g:not(.boil-frame-layer) path.grid-line[style*="dasharray"]').length === 0) { allOneAt = null; return false; } if (!document.querySelector('path.grid-tip')) return true; allOneAt ??= performance.now(); return performance.now() - allOneAt >= 110; },
    midfade: () => { const a = document.querySelector('.boil-frame-bitmap.is-active.hand-settle')?.getAnimations?.()[0]; if (!a || !(a.currentTime >= 175)) return false; document.getAnimations().forEach((x) => x.pause()); return true; },
    settled: () => !!document.querySelector('image.boil-frame-bitmap') && !document.querySelector('image.hand-pose') && prog().length === 0,
    rest: () => !document.querySelector('.handwritten-logo mask') && !!document.querySelector('image.logo-pose-bmp') && prog().length === 0,
  };
  window.__want = null;
  (function loop() { raf(() => { try { if (!window.__frozen && window.__want && test[window.__want]()) { window.__frozen = true; window.__hit = { cond: window.__want, t: Math.round(performance.now()) }; window.__want = null; } } catch (e) { window.__err = String(e); } loop(); }); })();
};
const browser = await pw[engine].launch({ headless: true });
const ctx = await browser.newContext({ ...vps[vp], colorScheme: theme });
await ctx.addInitScript(freezeInit);
await ctx.addInitScript((c) => { window.__want = c; }, conds[0]);
const page = await ctx.newPage();
await page.goto(`${base}/?board=${BOARD}`, { waitUntil: 'commit' });
const res = [];
for (let k = 0; k < conds.length; k++) {
  const c = conds[k];
  if (k > 0) await page.evaluate((c) => { window.__want = c; window.__resume(); }, c);
  try { await page.waitForFunction(() => window.__hit && !window.__want, null, { timeout: 15000, polling: 5 }); } catch { res.push({ cond: c, miss: true, err: await page.evaluate(() => window.__err || null) }); continue; }
  const info = await page.evaluate(() => {
    const r = (el) => { const b = el.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map((v) => Math.round(v * 100) / 100); };
    const svg = document.querySelector('svg.hand-drawn-grid'); const lg = document.querySelector('.handwritten-logo');
    const lines = [...document.querySelectorAll('svg.hand-drawn-grid > g:not(.boil-frame-layer) path.grid-line')].map((p, i) => { const da = p.style.strokeDasharray; const L = p.getTotalLength(); const pr = !da || da === 'none' ? 1 : 1 - parseFloat(p.style.strokeDashoffset) / parseFloat(da); const m = p.getScreenCTM(); const pt = (s) => { const q = p.getPointAtLength(Math.max(0, Math.min(L, s))); return [Math.round((m.a * q.x + m.c * q.y + m.e) * 100) / 100, Math.round((m.b * q.x + m.d * q.y + m.f) * 100) / 100]; }; return { i, cls: p.getAttribute('class'), pr: Math.round(pr * 1000) / 1000, L: Math.round(L), front: pt(L * pr), back: pt(L * pr - 60), unit: Math.round(m.a * 10000) / 10000 }; });
    const gr = lg?.querySelector('mask linearGradient');
    return { hit: window.__hit, board: svg && r(svg), logo: lg && r(lg), vb: lg?.getAttribute('viewBox'), rx: gr ? [gr.getAttribute('x1'), gr.getAttribute('y1'), gr.getAttribute('x2'), gr.getAttribute('y2')] : null, lines: lines.filter((l) => l.pr > 0.001 && l.pr < 0.999 || l.i === 0), tips: [...document.querySelectorAll('path.grid-tip')].filter((t) => t.style.visibility === 'visible').map((t) => [t.getAttribute('class'), getComputedStyle(t).opacity]), hm: document.querySelectorAll('image.hand-pose').length, sb: document.querySelectorAll('image.boil-frame-bitmap').length, bg: getComputedStyle(document.body).backgroundColor };
  });
  const file = `${OUT}/${tag}-${engine}-${theme}-${vp}-${c}.png`;
  await page.screenshot({ path: file });
  res.push({ cond: c, file, ...info });
}
writeFileSync(`${OUT}/${tag}-${engine}-${theme}-${vp}.json`, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res.map((r) => ({ cond: r.cond, miss: r.miss, hit: r.hit, hm: r.hm, sb: r.sb, tips: r.tips?.length }))));
await browser.close();
