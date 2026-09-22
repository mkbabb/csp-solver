// G-BAR opus — design-arm injection probe on MAIN 1e6cfbbf (read-only on src), 127.0.0.1:4257.
// HEAD arm = the served page untouched; DESIGN arm = the spec's frame/cover/pad injected at runtime.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const pw = require('playwright'); const sharp = require('sharp');
const engine = process.argv[2] || 'chromium'; const out = process.argv[3];
const BASE = 'http://127.0.0.1:4257/?size=3&difficulty=MEDIUM';
const CELLS = process.env.V2 ? [ { name: '1280x800-fine', vp: { width: 1280, height: 800 }, touch: false }, { name: '390x844-coarse', vp: { width: 390, height: 844 }, touch: true }, { name: '430x932-coarse', vp: { width: 430, height: 932 }, touch: true } ] : [
  { name: '1280x800-fine', vp: { width: 1280, height: 800 }, touch: false },
  { name: '390x844-coarse', vp: { width: 390, height: 844 }, touch: true },
  { name: '1280x800-coarse', vp: { width: 1280, height: 800 }, touch: true },
];
const THEMES = ['light', 'dark'];
const SHOTS = process.env.SHOTS ? JSON.parse(process.env.SHOTS) : [];
const DPR = 2;

async function inject(page, dock) {
  await page.evaluate(async (dock) => {
    const gp = await import('/src/pencil/grid/gridPaths.ts');
    const cfg = await import('/src/pencil/config/pencilConfig.ts');
    const st = document.createElement('style'); st.id = 'gbar';
    st.textContent = `
      @media (min-width: 1024px), (max-width: 1023.98px) and (orientation: portrait) {
        .action-bar { box-shadow: calc(-1 * var(--strip-cover)) 0 0 0 var(--color-card), var(--strip-cover) 0 0 0 var(--color-card); }
        .action-bar::before, .action-bar::after { left: calc(-1 * var(--strip-cover)) !important; right: calc(-1 * var(--strip-cover)) !important; }
      }
      .controls-card { --strip-cover: 0.5rem; }
      .action-bar { padding-block: 0.275rem 0.275rem !important; margin-top: 0.5rem !important; } .mobile-control-panel > .action-bar { margin-top: 1rem !important; }
      .gbar-frame { position: absolute; inset: -3px; width: calc(100% + 6px); height: calc(100% + 6px); pointer-events: none; z-index: 1; overflow: visible; }
      .info-glyph { border: none !important; position: relative; }
      .gbar-ring { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
      ${dock ? '@media (max-width: 1023.98px) and (orientation: portrait) { .controls-card { padding-bottom: max(0.625rem, env(safe-area-inset-bottom)) !important; } }' : ''}
    `;
    document.head.appendChild(st);
    const NS = 'http://www.w3.org/2000/svg';
    const mk = (w, h, o, sw, r) => {
      const d = gp.generateRectBoilFrames(0, 0, w + 2 * o, h + 2 * o, { roughness: 0.5, segments: 6, seed: 77, jagged: true },
        cfg.BOIL_CONFIG.outlineBoilPx, cfg.BOIL_CONFIG.frameCount, r, cfg.FILTER_PRESETS['grain-outline']?.grain)[0];
      const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${w + 2 * o} ${h + 2 * o}`); svg.setAttribute('aria-hidden', 'true');
      const p = document.createElementNS(NS, 'path');
      for (const [k, v] of Object.entries({ d, fill: 'none', stroke: 'currentColor', 'stroke-width': sw, 'stroke-opacity': 0.95, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' })) p.setAttribute(k, v);
      svg.appendChild(p); return svg;
    };
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const bar = document.querySelector('.action-bar');
    const b = bar.getBoundingClientRect();
    const fr = mk(b.width, b.height, 3, 2.5, 0); fr.classList.add('gbar-frame'); bar.appendChild(fr);
    const g = document.querySelector('.info-glyph');
    if (g && g.getBoundingClientRect().width) { const gr = g.getBoundingClientRect(); const ring = mk(gr.width, gr.height, 0, 1.5, gr.width / 2); ring.classList.add('gbar-ring'); g.appendChild(ring); }
  }, dock);
}

async function settle(page) {
  let last = '', same = 0; const t0 = Date.now();
  while (Date.now() - t0 < 5000) {
    const s = await page.evaluate(() => JSON.stringify([document.querySelector('.controls-card')?.getBoundingClientRect(), document.querySelector('.action-bar')?.getBoundingClientRect()]));
    if (s === last) { if (++same >= 3) break; } else same = 0; last = s; await page.waitForTimeout(120);
  }
}

async function grab(page) {
  const buf = await page.screenshot({ scale: 'device' });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  return { data, W: info.width, H: info.height, C: info.channels };
}
const pix = (g, x, y) => { const i = (y * g.W + x) * g.C; return [g.data[i], g.data[i + 1], g.data[i + 2]]; };
const diff = (a, b, x, y) => { const p = pix(a, x, y), q = pix(b, x, y); return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]); };
const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const cr = (a, b) => { const la = lum(a), lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const r2 = (n) => Math.round(n * 100) / 100;

const geom = () => {
  const R = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) }; };
  const card = document.querySelector('.controls-card'); const bar = document.querySelector('.action-bar');
  const wells = [...document.querySelectorAll('.control-panel-wrap .tray-well')];
  const cs = getComputedStyle(card);
  return { card: { ...R(card), scrollH: card.scrollHeight, clientH: card.clientHeight, scrollTop: card.scrollTop, padB: cs.paddingBottom, actionBarH: cs.getPropertyValue('--action-bar-h'), cardPadB: cs.getPropertyValue('--card-pad-b') },
    bar: R(bar), barPos: getComputedStyle(bar).position, verbs: [...bar.querySelectorAll('.action-verbs .icon-btn')].map(R), info: R(document.querySelector('.info-btn')),
    lastWellB: wells.length ? +wells[wells.length - 1].getBoundingClientRect().bottom.toFixed(2) : null,
    board: R(document.querySelector('.board-wrapper')), masthead: R(document.querySelector('.handwritten-logo')), vp: { w: innerWidth, h: innerHeight },
    wellFlankX: wells.map((w) => { const s = w.querySelector('.outline-svg')?.getBoundingClientRect(); return s ? [+s.x.toFixed(2), +s.right.toFixed(2)] : null; })[0],
    filters: [...document.querySelectorAll('*')].filter((e) => { const f = getComputedStyle(e).filter; return (f && f !== 'none') || e.getAttribute?.('filter'); }).length };
};

const results = [];
const browser = await pw[engine].launch();
for (const theme of THEMES) for (const cell of CELLS) {
  const rec = { engine, theme, cell: cell.name };
  for (const arm of ['HEAD', 'DESIGN']) {
    const ctx = await browser.newContext({ viewport: cell.vp, hasTouch: cell.touch, isMobile: cell.touch && cell.vp.width < 1024, colorScheme: theme, deviceScaleFactor: DPR });
    const page = await ctx.newPage();
    const A = {};
    try {
      await page.goto(BASE, { waitUntil: 'load' });
      await page.waitForSelector('svg.handwritten-logo', { timeout: 20000 });
      await page.waitForFunction(() => document.querySelectorAll('.sudoku-cell .glyph-svg').length > 0, null, { timeout: 20000 });
      A.regime = await page.evaluate(() => ({ coarse: matchMedia('(pointer: coarse)').matches, hover: matchMedia('(hover: hover)').matches, touch: navigator.maxTouchPoints }));
      const tab = page.locator('.drawer-tab');
      if ((await tab.getAttribute('aria-expanded').catch(() => null)) === 'false') { if (cell.touch) await tab.tap(); else await tab.click(); }
      await settle(page);
      if (arm === 'DESIGN') { await inject(page, cell.name.startsWith('390') || cell.name.startsWith('430')); await page.waitForTimeout(250); await settle(page); }
      A.top = await page.evaluate(geom);
      const bg = (g, x, y) => pix(g, Math.round(x * DPR), Math.round(y * DPR));
      // (1) the frame's own paint (DESIGN only): frame visible vs hidden, at scrollTop 0
      if (arm === 'DESIGN') {
        const g1 = await grab(page);
        await page.evaluate(() => { document.querySelector('.gbar-frame').style.visibility = 'hidden'; });
        await page.waitForTimeout(80); const g0 = await grab(page);
        await page.evaluate(() => { document.querySelector('.gbar-frame').style.visibility = ''; });
        const b = A.top.bar; const x0 = Math.floor((b.x - 10) * DPR), x1 = Math.ceil((b.x + b.w + 10) * DPR), y0 = Math.floor((b.y - 10) * DPR), y1 = Math.min(g1.H, Math.ceil((b.y + b.h + 10) * DPR));
        const mask = []; let maxY = -1, minY = 1e9, minX = 1e9, maxX = -1;
        for (let y = Math.max(0, y0); y < y1; y++) for (let x = Math.max(0, x0); x < Math.min(g1.W, x1); x++) { const d = diff(g1, g0, x, y); if (d > 60) { mask.push([x, y, d]); maxY = Math.max(maxY, y); minY = Math.min(minY, y); minX = Math.min(minX, x); maxX = Math.max(maxX, x); } }
        const paper = pix(g0, Math.round((b.x + b.w / 2) * DPR), Math.round((b.y + 3) * DPR));
        // side coverage: fraction of columns (top/bottom) or rows (left/right) along the bar with frame ink in the side band
        const has = new Set(mask.map(([x, y]) => x + ',' + y));
        const cov = (fixedLo, fixedHi, runLo, runHi, horiz) => { let n = 0, t = 0; for (let r = runLo; r < runHi; r++) { t++; let hit = false; for (let f = fixedLo; f < fixedHi && !hit; f++) if (has.has(horiz ? r + ',' + f : f + ',' + r)) hit = true; if (hit) n++; } return r2(n / t); };
        const bx0 = Math.round(b.x * DPR), bx1 = Math.round((b.x + b.w) * DPR), by0 = Math.round(b.y * DPR), by1 = Math.round((b.y + b.h) * DPR);
        const core = mask.filter((m) => m[2] > 0.6 * Math.max(...mask.map((q) => q[2]))).map(([x, y]) => cr(pix(g1, x, y), paper));
        A.frame = { maskPx: mask.length, extentCss: { left: r2(b.x - minX / DPR), right: r2(maxX / DPR - (b.x + b.w)), top: r2(b.y - minY / DPR), bottom: r2(maxY / DPR - (b.y + b.h)) },
          lowestInkToViewportBottom: r2(cell.vp.height - (maxY + 1) / DPR),
          coverage: { top: cov(by0 - 16, by0 + 4, bx0, bx1, true), bottom: cov(by1 - 4, by1 + 16, bx0, bx1, true), left: cov(bx0 - 16, bx0 + 4, by0, by1, false), right: cov(bx1 - 4, bx1 + 16, by0, by1, false) },
          contrastCore: { median: r2(med(core)), min: r2(Math.min(...core)), n: core.length }, paper };
        // the i ring
        const ring = await page.evaluate(() => { const r = document.querySelector('.gbar-ring'); if (!r) return null; const b = r.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
        if (ring) {
          await page.evaluate(() => { document.querySelector('.gbar-ring').style.visibility = 'hidden'; }); await page.waitForTimeout(80); const h0 = await grab(page);
          await page.evaluate(() => { document.querySelector('.gbar-ring').style.visibility = ''; }); await page.waitForTimeout(80); const h1 = await grab(page);
          const cs = []; for (let y = Math.floor((ring.y - 2) * DPR); y < Math.ceil((ring.y + ring.h + 2) * DPR); y++) for (let x = Math.floor((ring.x - 2) * DPR); x < Math.ceil((ring.x + ring.w + 2) * DPR); x++) { if (diff(h1, h0, x, y) > 60) cs.push(cr(pix(h1, x, y), paper)); }
          A.ring = { maskPx: cs.length, contrastMedian: r2(med(cs)), contrastMax: r2(Math.max(...cs)) };
        }
      } else {
        // HEAD: the i's CSS ring contrast, painted
        const ring = A.top.info;
        if (ring && ring.w) {
          const g = await grab(page); const paper = bg(g, ring.x - 6, ring.y + ring.h / 2);
          const cs = []; for (let y = Math.floor(ring.y * DPR); y < Math.ceil((ring.y + ring.h) * DPR); y++) for (let x = Math.floor(ring.x * DPR); x < Math.ceil((ring.x + ring.w) * DPR); x++) { const c = cr(pix(g, x, y), paper); if (c > 1.3) cs.push(c); }
          A.ring = { inkPx: cs.length, contrastMedian: r2(med(cs)), contrastMax: r2(Math.max(...cs)) };
        }
      }
      // (2) the LEAK: census pose (second well's top stroke on the bar mid-line); flank columns content-8..content over the bar height, wells' outlines visible vs hidden
      const canScroll = A.top.card.scrollH > A.top.card.clientH + 4;
      if (canScroll) {
        await page.evaluate(() => { const card = document.querySelector('.controls-card'); const bar = document.querySelector('.action-bar'); const w = [...document.querySelectorAll('.control-panel-wrap .tray-well')][1]; const sr = w.querySelector('.outline-svg').getBoundingClientRect(); const br = bar.getBoundingClientRect(); card.scrollTop += (sr.top + 4) - (br.top + br.height / 2); });
        await page.waitForTimeout(350);
        const gb = await page.evaluate(() => { const b = document.querySelector(".action-bar").getBoundingClientRect(); const c = document.querySelector(".controls-card").getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height, cb: c.bottom }; });
        const v = await grab(page);
        await page.evaluate(() => { for (const s of document.querySelectorAll('.control-panel-wrap .tray-well > .outline-svg, .control-panel-wrap .tray-well .outline-svg')) s.style.visibility = 'hidden'; });
        await page.waitForTimeout(80); const h = await grab(page);
        await page.evaluate(() => { for (const s of document.querySelectorAll('.control-panel-wrap .tray-well .outline-svg')) s.style.visibility = ''; });
        const cnt = (cx0, cx1) => { let n = 0, t = 0; for (let y = Math.round(gb.y * DPR); y < Math.round(Math.min(gb.cb, gb.y + gb.h + 60) * DPR); y++) for (let x = Math.round(cx0 * DPR); x < Math.round(cx1 * DPR); x++) { t++; if (diff(v, h, x, y) > 60) n++; } return { dPx: n, of: t }; };
        A.leak = { left: cnt(gb.x - 8, gb.x), right: cnt(gb.x + gb.w, gb.x + gb.w + 8), inside: cnt(gb.x, gb.x + gb.w) };
      }
      // (3) scroll END: the last well's bottom stroke vs the bar (daylight between drawn inks)
      await page.evaluate(() => { const c = document.querySelector('.controls-card'); c.scrollTop = c.scrollHeight; });
      await page.waitForTimeout(350);
      A.end = await page.evaluate(geom);
      {
        const e1 = await grab(page);
        await page.evaluate(() => { for (const s of document.querySelectorAll('.control-panel-wrap .tray-well .outline-svg')) s.style.visibility = 'hidden'; });
        await page.waitForTimeout(80); const e0 = await grab(page);
        await page.evaluate(() => { for (const s of document.querySelectorAll('.control-panel-wrap .tray-well .outline-svg')) s.style.visibility = ''; });
        let e2 = null; if (arm === 'DESIGN') { await page.evaluate(() => { document.querySelector('.gbar-frame').style.visibility = 'hidden'; }); await page.waitForTimeout(80); e2 = await grab(page); await page.evaluate(() => { document.querySelector('.gbar-frame').style.visibility = ''; }); }
        const b = A.end.bar; let minDay = 1e9, wellHidden = 0, cols = 0;
        for (let x = Math.round((b.x + 6) * DPR); x < Math.round((b.x + b.w - 6) * DPR); x += 2) {
          // lowest well-stroke ink above the bar top+10 and highest frame ink
          let wellLow = -1; for (let y = Math.round((b.y - 30) * DPR); y < Math.round((b.y + 10) * DPR); y++) if (diff(e1, e0, x, y) > 60) wellLow = y;
          cols++; if (wellLow < 0) { wellHidden++; continue; }
          if (e2) { let frHigh = -1; for (let y = Math.round((b.y - 12) * DPR); y < Math.round((b.y + 6) * DPR); y++) if (diff(e1, e2, x, y) > 60) { frHigh = y; break; } if (frHigh >= 0) minDay = Math.min(minDay, (frHigh - wellLow - 1) / DPR); }
        }
        A.endCross = { cols, wellStrokeAbsentCols: wellHidden, minDaylightCss: minDay === 1e9 ? null : r2(minDay), wellToBarGapBox: A.end.lastWellB != null ? r2(A.end.bar.y - A.end.lastWellB) : null };
      }
      for (const sh of SHOTS) if (sh.cell === cell.name && sh.theme === theme && sh.arm === arm) {
        if (sh.pose === 'leak') await page.evaluate(() => { const card = document.querySelector('.controls-card'); card.scrollTop = 0; const bar = document.querySelector('.action-bar'); const w = [...document.querySelectorAll('.control-panel-wrap .tray-well')][1]; const sr = w.querySelector('.outline-svg').getBoundingClientRect(); const br = bar.getBoundingClientRect(); card.scrollTop += (sr.top + 4) - (br.top + br.height / 2); });
        await page.waitForTimeout(350);
        const bb = await page.evaluate(() => { const b = document.querySelector('.action-bar').getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
        const clip = { x: Math.max(0, bb.x - 24), y: Math.max(0, bb.y - 60), width: Math.min(cell.vp.width - Math.max(0, bb.x - 24), bb.w + 48), height: Math.min(cell.vp.height - Math.max(0, bb.y - 60), bb.h + 60 + 20) };
        await page.screenshot({ path: sh.path, clip, scale: 'css' });
      }
    } catch (e) { A.error = String(e).slice(0, 300); }
    rec[arm] = A; await ctx.close();
  }
  results.push(rec);
  console.error('done', engine, theme, cell.name);
}
await browser.close();
const js = JSON.stringify(results, null, 1); if (out) writeFileSync(out, js); else console.log(js);
