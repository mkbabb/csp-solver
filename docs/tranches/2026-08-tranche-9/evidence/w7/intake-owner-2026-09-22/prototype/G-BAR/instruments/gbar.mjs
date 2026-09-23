// G-BAR prototype instrument — forks census/panel-bar/probe.mjs (the leak pose, flanks, toViewportB)
// and portfolio/G-BAR/opus-probe/probe.mjs (differential coverage / leak / daylight / painted
// contrast), plus paintedExtent-style centroids (G3), a Tab walk (G10), the note berth (G11), the
// tag census (G12), landscape clearances (G13), focus rings (G14), the glide discontinuity, and a
// π signature. Runs every arm in the SAME run: proto (1.5/4/3) and tab (?lip=tab, 2.5/3/0) on
// 127.0.0.1:4259, base (HEAD 1e6cfbbf src) on 127.0.0.1:4260. READ-ONLY on the product.
// usage: node gbar.mjs <engine> <out.json>   env: CELLS=a,b  THEMES=light,dark  ARMS=proto,tab,base
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-21/web/frontend/package.json');
const pw = require('playwright'); const sharp = require('sharp');
const engine = process.argv[2] || 'chromium'; const out = process.argv[3];
const BOARD = 'ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw';
const URLS = { proto: `http://127.0.0.1:4259/?board=${BOARD}`, tab: `http://127.0.0.1:4259/?board=${BOARD}&lip=tab`, base: `http://127.0.0.1:4260/?board=${BOARD}` };
const ALL = [
  { name: '1280x800-fine', vp: { width: 1280, height: 800 }, touch: false, kind: 'rail' },
  { name: '1024x768-fine', vp: { width: 1024, height: 768 }, touch: false, kind: 'rail' },
  { name: '1440x900-fine', vp: { width: 1440, height: 900 }, touch: false, kind: 'rail' },
  { name: '1280x800-coarse', vp: { width: 1280, height: 800 }, touch: true, kind: 'rail' },
  { name: '390x844-coarse', vp: { width: 390, height: 844 }, touch: true, kind: 'dock' },
  { name: '430x932-coarse', vp: { width: 430, height: 932 }, touch: true, kind: 'dock' },
  { name: '844x390-coarse', vp: { width: 844, height: 390 }, touch: true, kind: 'land' },
  { name: '812x375-coarse', vp: { width: 812, height: 375 }, touch: true, kind: 'land' },
];
const CELLS = process.env.CELLS ? ALL.filter((c) => process.env.CELLS.split(',').includes(c.name)) : ALL;
const THEMES = (process.env.THEMES || 'light,dark').split(',');
const ARMS = (process.env.ARMS || 'proto,tab,base').split(',');
const DPR = 2;
const r2 = (n) => (n == null || !isFinite(n) ? null : Math.round(n * 100) / 100);
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const cr = (a, b) => { const la = lum(a), lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };

// ── in-page helpers (stringified into every evaluate) ──────────────────────────────────────────
const HELPERS = `
  window.__g = {
    sc: () => document.querySelector('.card-body') || document.querySelector('.controls-card'),
    card: () => document.querySelector('.controls-card'),
    bar: () => document.querySelector('.action-bar'),
    lip: () => document.querySelector('.tool-lip'),
    lipSvg: () => document.querySelector('.tool-lip > .outline-svg'),
    wells: () => [...document.querySelectorAll('.control-panel-wrap .tray-well')],
    wellSvgs: () => [...document.querySelectorAll('.control-panel-wrap .tray-well > .outline-svg')],
    R: (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height, r: b.right, b: b.bottom }; },
    frame: (lip) => (__g.lip() || __g.bar()),
  };`;

async function ready(page, url, touch) {
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForSelector('svg.handwritten-logo', { timeout: 20000 });
  await page.waitForFunction(() => document.querySelectorAll('.sudoku-cell .glyph-svg').length > 0, null, { timeout: 20000 });
  await page.addScriptTag({ content: HELPERS });
}
async function settle(page, ms = 5000) {
  let last = '', same = 0; const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const s = await page.evaluate(() => JSON.stringify([__g.card()?.getBoundingClientRect(), __g.bar()?.getBoundingClientRect()]));
    if (s === last) { if (++same >= 3) break; } else same = 0; last = s; await page.waitForTimeout(120);
  }
  return Date.now() - t0;
}
async function grab(page, clip) {
  const buf = await page.screenshot({ scale: 'device', clip });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  return { data, W: info.width, H: info.height, C: info.channels, ox: clip.x, oy: clip.y };
}
// css → device px inside a grab
const X = (g, x) => Math.round((x - g.ox) * DPR); const Y = (g, y) => Math.round((y - g.oy) * DPR);
const pix = (g, x, y) => { if (x < 0 || y < 0 || x >= g.W || y >= g.H) return [0, 0, 0]; const i = (y * g.W + x) * g.C; return [g.data[i], g.data[i + 1], g.data[i + 2]]; };
const dif = (a, b, x, y) => { const p = pix(a, x, y), q = pix(b, x, y); return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]); };
async function hideGrab(page, sel, clip, on = true) {
  await page.evaluate(([s, v]) => { for (const e of document.querySelectorAll(s)) e.style.visibility = v ? 'hidden' : ''; }, [sel, on]);
  await page.waitForTimeout(90);
  const g = await grab(page, clip);
  await page.evaluate((s) => { for (const e of document.querySelectorAll(s)) e.style.visibility = ''; }, sel);
  await page.waitForTimeout(60);
  return g;
}
const clipOf = (r, pad, vp) => { const x = Math.max(0, Math.floor(r.x - pad)), y = Math.max(0, Math.floor(r.y - pad)); return { x, y, width: Math.min(vp.width - x, Math.ceil(r.w + 2 * pad)), height: Math.min(vp.height - y, Math.ceil(r.h + 2 * pad)) }; };
// ink mask of (a vs b) in css rect → list of [x,y] device px
function mask(a, b, rect, thr = 60) {
  const m = []; for (let y = Y(a, rect.y); y < Y(a, rect.y + rect.h); y++) for (let x = X(a, rect.x); x < X(a, rect.x + rect.w); x++) { const d = dif(a, b, x, y); if (d > thr) m.push([x, y, d]); } return m;
}

// geometry + the one-hand read + π anchors
const GEOM = () => {
  const { R } = __g; const card = __g.card(), sc = __g.sc(), bar = __g.bar(), lip = __g.lip(), lsvg = __g.lipSvg();
  const foot = document.querySelector('#card-foot');
  const borders = bar ? [bar, ...bar.querySelectorAll('*')].filter((e) => !(e instanceof SVGElement) && e.tagName !== 'KBD').map((e) => { const s = getComputedStyle(e); const w = ['Top', 'Right', 'Bottom', 'Left'].map((k) => parseFloat(s[`border${k}Width`]) || 0); return { c: String(e.className?.baseVal ?? e.className).slice(0, 40), w: Math.max(...w) }; }).filter((q) => q.w > 0) : null;
  const paths = lip ? [...lip.querySelectorAll(':scope > svg path')].filter((p) => getComputedStyle(p.parentElement).display !== 'none') : [];
  const scs = sc ? getComputedStyle(sc) : null;
  return {
    card: R(card), sc: sc ? { ...R(sc), cls: sc.className.split(' ')[0], scrollH: sc.scrollHeight, clientH: sc.clientHeight, scrollTop: sc.scrollTop, spb: scs.scrollPaddingBottom, spt: scs.scrollPaddingTop, padT: scs.paddingTop, padR: scs.paddingRight, padL: scs.paddingLeft, gutter: scs.scrollbarGutter, cardPadT: scs.getPropertyValue('--card-pad-t'), barH: getComputedStyle(card).getPropertyValue('--action-bar-h'), foldBelow: sc.hasAttribute('data-fold-below') } : null,
    foot: foot ? { ...R(foot), padB: getComputedStyle(foot).paddingBottom, hasBar: !!foot.querySelector('.action-bar') } : null,
    bar: bar ? { ...R(bar), position: getComputedStyle(bar).position, z: getComputedStyle(bar).zIndex, bg: getComputedStyle(bar).backgroundColor, parent: bar.parentElement?.id || bar.parentElement?.className?.split(' ')[0] } : null,
    lip: lip ? { ...R(lip), svg: R(lsvg), paths: paths.length, sw: paths.map((p) => p.getAttribute('stroke-width')), pruned: lsvg?.classList.contains('is-pruned'), poseNodes: lsvg ? [...lsvg.querySelectorAll('g.boil-pose')].filter((g) => getComputedStyle(g).display !== 'none').length : 0, willChange: lsvg ? [...lsvg.querySelectorAll('g.boil-pose')].map((g) => getComputedStyle(g).willChange).filter((w) => w !== 'auto').length : 0 } : null,
    borders,
    ring: (() => { const g = document.querySelector('.info-glyph'); if (!g) return null; const s = getComputedStyle(g); return { w: s.borderTopWidth, disp: getComputedStyle(g.parentElement).display }; })(),
    board: R(document.querySelector('.board-wrapper')), masthead: R(document.querySelector('.handwritten-logo')), caseSvg: R(document.querySelector('.drawer-case > .outline-svg')),
    verbs: bar ? [...bar.querySelectorAll('.action-verbs > .icon-btn')].map(R) : [],
    play: R(document.querySelector('.play-controls')), playParent: document.querySelector('.play-controls')?.parentElement?.id || null,
    wells: __g.wells().map((w) => ({ tag: w.querySelector('.washi-tag')?.textContent.trim(), ...R(w) })),
    vp: { w: innerWidth, h: innerHeight },
    filters: [...document.querySelectorAll('*')].filter((e) => { const f = getComputedStyle(e).filter; return (f && f !== 'none') || e.getAttribute?.('filter'); }).length,
  };
};

// π signature: every element OUTSIDE the tool strip, in document order, keyed by an index path
// stable across arms (the strip, the new body/foot wrappers and their pseudo-free boxes skipped).
const SIG = () => {
  const skip = (e) => e.closest('.action-bar') || e.id === 'card-foot' || e.classList?.contains('card-body');
  const P = ['color', 'backgroundColor', 'opacity', 'borderTopWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth', 'boxShadow', 'filter', 'fontSize', 'fontWeight', 'visibility', 'display'];
  const out = [];
  for (const e of document.body.querySelectorAll('*')) {
    if (skip(e)) continue;
    if (e.closest('svg') && e.tagName.toLowerCase() !== 'svg') continue; // boil poses flip on the beat
    const b = e.getBoundingClientRect(); const s = getComputedStyle(e);
    out.push([e.tagName.toLowerCase() + '.' + String(e.className?.baseVal ?? e.className).split(' ').filter((c) => !c.startsWith('data-v')).slice(0, 3).join('.'), [b.x, b.y, b.width, b.height].map((n) => Math.round(n * 10) / 10).join(','), P.map((p) => s[p]).join('|')]);
  }
  return out;
};

async function openDrawer(page, touch) {
  const tab = page.locator('.drawer-tab').first();
  const exp = await tab.getAttribute('aria-expanded').catch(() => null);
  if (exp === 'false') { if (touch) await tab.tap(); else await tab.click(); }
  return exp;
}

const results = [];
const browser = await pw[engine].launch();
for (const theme of THEMES) for (const cell of CELLS) for (const arm of ARMS) {
  const ctx = await browser.newContext({ viewport: cell.vp, hasTouch: cell.touch, isMobile: cell.touch && cell.vp.width < 1024, colorScheme: theme, deviceScaleFactor: DPR });
  const page = await ctx.newPage();
  const A = { engine, theme, cell: cell.name, arm };
  try {
    await ready(page, URLS[arm], cell.touch);
    A.pointer = await page.evaluate(() => ({ coarse: matchMedia('(pointer: coarse)').matches, hover: matchMedia('(hover: hover)').matches, touch: navigator.maxTouchPoints }));
    // ── the glide discontinuity (dock + landscape: the sheet slides; the rail case glides too)
    await page.evaluate(() => {
      window.__glide = []; const t0 = performance.now();
      const tick = () => { const c = __g.card(), f = __g.lip() || __g.bar(); if (c && f) { const a = c.getBoundingClientRect(), b = f.getBoundingClientRect(); window.__glide.push([performance.now() - t0, b.x - a.x, b.y - a.y, a.y]); } if (performance.now() - t0 < 1400) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    A.tabAtLoad = await openDrawer(page, cell.touch);
    await page.waitForTimeout(1450);
    const gl = await page.evaluate(() => window.__glide);
    { let jumps = 0, maxd = 0; for (let i = 1; i < gl.length; i++) { const d = Math.hypot(gl[i][1] - gl[i - 1][1], gl[i][2] - gl[i - 1][2]); maxd = Math.max(maxd, d); if (d > 0.5) jumps++; } A.glide = { frames: gl.length, stripVsCardJumps: jumps, maxStepPx: r2(maxd), cardTravel: r2(gl.length ? gl[0][3] - gl[gl.length - 1][3] : null) }; }
    A.settleMs = await settle(page);
    A.top = await page.evaluate(GEOM);
    A.sig = await page.evaluate(SIG);
    const vp = cell.vp;
    const F = () => page.evaluate(() => __g.R(__g.lip() || __g.bar()));
    // ── G1 coverage + G8 lip contrast + sublabel contrast (scrollTop 0; landscape: the strip scrolled into view)
    if (cell.kind === 'land') { await page.evaluate(() => { const f = __g.lip() || __g.bar(); const sc = __g.sc(); const fr = f.getBoundingClientRect(), sr = sc.getBoundingClientRect(); sc.scrollTop += (fr.top + fr.height / 2) - (sr.top + sr.height / 2); }); await page.waitForTimeout(300); }
    {
      const b = await F(); const clip = clipOf(b, 24, vp);
      const g1 = await grab(page, clip);
      if (A.top.lip) {
        const g0 = await hideGrab(page, '.tool-lip > .outline-svg', clip);
        const m = mask(g1, g0, { x: b.x - 12, y: b.y - 12, w: b.w + 24, h: b.h + 24 });
        const has = new Set(m.map(([x, y]) => x + ',' + y));
        const o = A.top.lip.svg ? (b.x - A.top.lip.svg.x) : 4;
        const cov = (lo, hi, a0, a1, horiz) => { let n = 0, t = 0; for (let r = a0; r < a1; r++) { t++; let hit = false; for (let f = lo; f < hi && !hit; f++) if (has.has(horiz ? r + ',' + f : f + ',' + r)) hit = true; if (hit) n++; } return r2(n / t); };
        const bx0 = X(g1, b.x), bx1 = X(g1, b.r), by0 = Y(g1, b.y), by1 = Y(g1, b.b), O = Math.round((o + 4) * DPR);
        const paper = pix(g0, X(g0, b.x + 2), Y(g0, b.y + 2));
        const mx = Math.max(...m.map((q) => q[2]));
        const core = m.filter((q) => q[2] > 0.6 * mx).map(([x, y]) => cr(pix(g1, x, y), paper));
        let minY = 1e9, maxY = -1, minX = 1e9, maxX = -1; for (const [x, y] of m) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
        A.lipPaint = { maskPx: m.length, outset: r2(o), coverage: { top: cov(by0 - O, by0, bx0, bx1, true), bottom: cov(by1, by1 + O, bx0, bx1, true), left: cov(bx0 - O, bx0, by0, by1, false), right: cov(bx1, bx1 + O, by0, by1, false) },
          extentCss: { left: r2(b.x - (minX / DPR + g1.ox)), right: r2((maxX + 1) / DPR + g1.ox - b.r), top: r2(b.y - (minY / DPR + g1.oy)), bottom: r2((maxY + 1) / DPR + g1.oy - b.b) },
          lowestInkToViewportBottom: r2(vp.height - ((maxY + 1) / DPR + g1.oy)), contrastCore: { median: r2(med(core)), min: r2(Math.min(...core)), n: core.length }, paper };
      } else {
        // HEAD: the census's top-band read (ink in the bar's top 3 px) — the R3 absence
        const paper = pix(g1, X(g1, b.x + b.w / 2), Y(g1, b.y + 2)); let n = 0, t = 0;
        for (let y = Y(g1, b.y); y < Y(g1, b.y + 3); y++) for (let x = X(g1, b.x); x < X(g1, b.r); x++) { t++; const p = pix(g1, x, y); if (Math.abs(p[0] - paper[0]) + Math.abs(p[1] - paper[1]) + Math.abs(p[2] - paper[2]) > 90) n++; }
        A.lipPaint = { none: true, topBandInk: n, of: t };
      }
      // sublabels: painted text core (the darkest 25 % of pixels that differ from paper) vs paper
      const subs = await page.evaluate(() => [...(__g.bar()?.querySelectorAll('.action-verbs .icon-sublabel') || [])].filter((s) => s.getBoundingClientRect().width).map((s) => { const b = s.getBoundingClientRect(); return { t: s.textContent.trim(), x: b.x, y: b.y, w: b.width, h: b.height }; }));
      const paper = pix(g1, X(g1, b.x + 3), Y(g1, b.y + 3));
      A.sublabels = subs.map((s) => { const cs = []; for (let y = Y(g1, s.y); y < Y(g1, s.y + s.h); y++) for (let x = X(g1, s.x); x < X(g1, s.x + s.w); x++) { const c = cr(pix(g1, x, y), paper); if (c > 1.2) cs.push(c); } cs.sort((a, q) => q - a); const top = cs.slice(0, Math.max(1, Math.floor(cs.length / 4))); return { t: s.t, coreMedian: r2(med(top)), max: r2(cs[0]) }; });
      A.paperAtTop = paper;
    }
    const scrolls = A.top.sc && A.top.sc.scrollH > A.top.sc.clientH + 4;
    // ── G2 leak pose
    if (scrolls && cell.kind !== 'land') {
      await page.evaluate(() => {
        const sc = __g.sc(); const w = __g.wells()[1]; const sr = w.querySelector(':scope > .outline-svg').getBoundingClientRect();
        const f = __g.lip() || __g.bar(); const fr = f.getBoundingClientRect();
        // HEAD: the census pose (the well's top stroke on the bar's mid-line). PROTO: the lip is
        // below the clip edge, so the pose is the well's top stroke 12 px above the body's edge,
        // inside the fade band — the nearest a well can come.
        const target = document.querySelector('.card-body') ? sc.getBoundingClientRect().bottom - 12 : fr.top + fr.height / 2;
        sc.scrollTop += (sr.top + 4) - target;
      });
      await page.waitForTimeout(400);
      const L = await page.evaluate(() => ({ f: __g.R(__g.lip() || __g.bar()), bar: __g.R(__g.bar()), sc: __g.R(__g.sc()), card: __g.R(__g.card()), foldBelow: __g.sc().hasAttribute('data-fold-below'), svg: __g.R(__g.lipSvg()) }));
      A.leakPose = { foldBelow: L.foldBelow };
      const reg = { x: L.sc.x - 4, y: L.sc.y + L.sc.h - 80, w: L.sc.w + 8, h: (L.f.b + 64) - (L.sc.y + L.sc.h - 80) };
      const clip = clipOf(reg, 4, vp);
      const v = await grab(page, clip);
      const h = await hideGrab(page, '.control-panel-wrap .tray-well > .outline-svg', clip);
      const b = L.bar; const top = L.svg ? L.svg.y : b.y;
      // census form: 7 px flank columns over the frame's height + 2 px above its top stroke, vs paper
      const paper = pix(v, X(v, b.x + b.w / 2), Y(v, b.y + 2));
      const ink = (x0, x1, y0, y1) => { let n = 0; for (let y = Y(v, y0); y < Y(v, y1); y++) for (let x = X(v, x0); x < X(v, x1); x++) { const p = pix(v, x, y); if (Math.abs(p[0] - paper[0]) + Math.abs(p[1] - paper[1]) + Math.abs(p[2] - paper[2]) > 90) n++; } return n / (DPR * DPR); };
      // the lip's own strokes sit in those columns on proto, so the census read is taken on the
      // WELLS' differential there (wells shown vs hidden) — the leak is the wells' ink, not the lip's.
      const dcnt = (x0, x1, y0, y1) => { let n = 0; for (let y = Y(v, y0); y < Y(v, y1); y++) for (let x = X(v, x0); x < X(v, x1); x++) if (dif(v, h, x, y) > 60) n++; return n / (DPR * DPR); };
      A.leak = {
        censusRaw: { left: r2(ink(b.x - 7, b.x, top - 2, b.b)), right: r2(ink(b.r, b.r + 7, top - 2, b.b)) },
        censusWellsDiff: { left: r2(dcnt(b.x - 7, b.x, top - 2, b.b)), right: r2(dcnt(b.r, b.r + 7, top - 2, b.b)) },
        // rows clamped 2 px inside the card: the case's own 3 px frame BOILS on the beat just below it (measured noise)
        opusDiff: { left: r2(dcnt(b.x - 8, b.x, b.y, Math.min(b.b + 60, L.card.b - 2))), right: r2(dcnt(b.r, b.r + 8, b.y, Math.min(b.b + 60, L.card.b - 2))), inside: r2(dcnt(b.x, b.r, b.y, Math.min(b.b + 60, L.card.b - 2))) },
        // the fade band's opaque end (the body's last 6 px), in the padding band beside the content (proto's G2 subject)
        fadeEndPadBand: { left: r2(dcnt(L.sc.x, b.x, L.sc.b - 6, L.sc.b)), right: r2(dcnt(b.r, L.sc.r, L.sc.b - 6, L.sc.b)) },
        fadeBandPad: { left: r2(dcnt(L.sc.x, b.x, L.sc.b - 32, L.sc.b)), right: r2(dcnt(b.r, L.sc.r, L.sc.b - 32, L.sc.b)) },
        fadeBandContent: r2(dcnt(b.x, b.r, L.sc.b - 32, L.sc.b)),
      };
      if (arm !== 'base') { // negative control: the fade narrowed to the content box
        await page.addStyleTag({ content: '.card-foot::before { left: 20px !important; right: 20px !important; } @media (max-width: 1023.98px) { .card-foot::before { left: 8px !important; right: 8px !important; } }' });
        await page.waitForTimeout(120);
        const v2 = await grab(page, clip);
        const h2 = await hideGrab(page, '.control-panel-wrap .tray-well > .outline-svg', clip);
        const d2 = (x0, x1, y0, y1) => { let n = 0; for (let y = Y(v2, y0); y < Y(v2, y1); y++) for (let x = X(v2, x0); x < X(v2, x1); x++) if (dif(v2, h2, x, y) > 60) n++; return n / (DPR * DPR); };
        A.leak.negNarrowFade = { fadeEndPadBand: { left: r2(d2(L.sc.x, b.x, L.sc.b - 6, L.sc.b)), right: r2(d2(b.r, L.sc.r, L.sc.b - 6, L.sc.b)) }, fadeBandPad: { left: r2(d2(L.sc.x, b.x, L.sc.b - 32, L.sc.b)), right: r2(d2(b.r, L.sc.r, L.sc.b - 32, L.sc.b)) } };
        await page.evaluate(() => { const s = [...document.querySelectorAll('style')].pop(); s.remove(); });
      }
    }
    // ── scroll END: G4 rhythm + G3 alignment
    await page.evaluate(() => { const c = __g.sc(); c.scrollTop = c.scrollHeight; });
    await page.waitForTimeout(400);
    A.end = await page.evaluate(GEOM);
    if (A.top.lip) {
      const readEnd = async () => {
        const E = await page.evaluate(() => { const ws = __g.wellSvgs(); const lipB = __g.R(__g.lip()); let near = null; for (const s of ws) { const b = s.getBoundingClientRect(); if (b.bottom <= lipB.y + 1 && (!near || b.bottom > near.getBoundingClientRect().bottom)) near = s; } const i = ws.indexOf(near); ws.forEach((s, k) => s.setAttribute('data-gbar', k === i ? 'near' : k === i - 1 ? 'prev' : '')); return { lip: lipB, well: __g.R(near), prev: i > 0 ? __g.R(ws[i - 1]) : null, sc: __g.R(__g.sc()) }; });
        const reg = { x: E.lip.x - 16, y: Math.max(E.sc.y, E.well.y), w: E.lip.w + 32, h: E.lip.b + 10 - Math.max(E.sc.y, E.well.y) };
        const clip = clipOf(reg, 2, vp);
        const all = await grab(page, clip);
        const noWell = await hideGrab(page, '[data-gbar="near"]', clip);
        const noLip = await hideGrab(page, '.tool-lip > .outline-svg', clip);
        // per column across the lip's inner run: the well's lowest bottom-stroke row, the lip's top-stroke rows
        const wy0 = Y(all, E.well.b - 12), wy1 = Y(all, E.well.b + 2), ly0 = Y(all, E.lip.y - 10), ly1 = Y(all, E.lip.y + 2);
        const s2s = [], day = [];
        for (let x = X(all, E.lip.x + 8); x < X(all, E.lip.r - 8); x += 2) {
          let wsum = 0, wn = 0, wlow = -1; for (let y = wy0; y < wy1; y++) { const d = dif(all, noWell, x, y); if (d > 60) { wsum += y * d; wn += d; wlow = y; } }
          let lsum = 0, ln = 0, lhigh = -1; for (let y = ly0; y < ly1; y++) { const d = dif(all, noLip, x, y); if (d > 60) { lsum += y * d; ln += d; if (lhigh < 0) lhigh = y; } }
          if (wn && ln) { s2s.push((lsum / ln - wsum / wn) / DPR); day.push((lhigh - wlow - 1) / DPR); }
        }
        // G3: side-stroke centroids over the middle rows each frame owns in this clip
        const cen = (a, b0, x0, x1, y0, y1) => { let s = 0, n = 0; for (let y = Y(a, y0); y < Y(a, y1); y++) for (let x = X(a, x0); x < X(a, x1); x++) { const d = dif(a, b0, x, y); if (d > 60) { s += x * d; n += d; } } return n ? s / n / DPR + a.ox : null; };
        const wm0 = Math.max(E.sc.y, E.well.y) + 6, wm1 = E.well.b - 10, lm0 = E.lip.y + 8, lm1 = E.lip.b - 8;
        const wl = cen(all, noWell, E.lip.x - 10, E.lip.x + 2, wm0, wm1), ll = cen(all, noLip, E.lip.x - 10, E.lip.x + 2, lm0, lm1);
        const wr = cen(all, noWell, E.lip.r - 2, E.lip.r + 10, wm0, wm1), lr = cen(all, noLip, E.lip.r - 2, E.lip.r + 10, lm0, lm1);
        // the reference: the painted stroke-to-stroke between the two wells above (prev bottom → near top)
        let inter = null;
        if (E.prev && E.prev.b > E.sc.y + 4) {
          const reg2 = { x: E.lip.x - 4, y: Math.max(E.sc.y, E.prev.b - 16), w: E.lip.w + 8, h: E.well.y + 16 - Math.max(E.sc.y, E.prev.b - 16) };
          const c2 = clipOf(reg2, 0, vp); const a2 = await grab(page, c2);
          const noPrev = await hideGrab(page, '[data-gbar="prev"]', c2); const noNear = await hideGrab(page, '[data-gbar="near"]', c2);
          const iv = [], idy = [];
          for (let x = X(a2, E.lip.x + 8); x < X(a2, E.lip.r - 8); x += 2) {
            let ps = 0, pn = 0, plow = -1; for (let y = 0; y < a2.H; y++) { const d = dif(a2, noPrev, x, y); if (d > 60) { ps += y * d; pn += d; plow = y; } }
            let ns = 0, nn = 0, nhigh = -1; for (let y = 0; y < a2.H; y++) { const d = dif(a2, noNear, x, y); if (d > 60) { ns += y * d; nn += d; if (nhigh < 0) nhigh = y; } }
            if (pn && nn) { iv.push((ns / nn - ps / pn) / DPR); idy.push((nhigh - plow - 1) / DPR); }
          }
          inter = { cols: iv.length, s2s: { min: r2(Math.min(...iv)), med: r2(med(iv)), max: r2(Math.max(...iv)) }, daylight: { min: r2(Math.min(...idy)), med: r2(med(idy)) }, boxGap: r2(E.well.y + 4 - (E.prev.b - 4)) };
        }
        await page.evaluate(() => __g.wellSvgs().forEach((s) => s.removeAttribute('data-gbar')));
        return { interWell: inter, cols: s2s.length, s2s: { min: r2(Math.min(...s2s)), med: r2(med(s2s)), max: r2(Math.max(...s2s)) }, daylight: { min: r2(Math.min(...day)), med: r2(med(day)) }, boxGap: r2(E.lip.y - E.well.b), align: { wellL: r2(wl), lipL: r2(ll), dL: r2(ll - wl), wellR: r2(wr), lipR: r2(lr), dR: r2(lr - wr) } };
      };
      A.rhythm = await readEnd();
      if (cell.kind !== 'land') {
        await page.addStyleTag({ content: '.card-foot .action-bar { margin-top: 0 !important; }' });
        await page.waitForTimeout(150);
        await page.evaluate(() => { const c = __g.sc(); c.scrollTop = c.scrollHeight; });
        await page.waitForTimeout(250);
        A.rhythmNeg = await readEnd();
        await page.evaluate(() => { [...document.querySelectorAll('style')].pop().remove(); });
        await page.waitForTimeout(150);
      }
    }
    // ── G5: the foot on the inset (dock) — the lip's lowest ink at 0.625rem and at 0.5rem
    if (cell.kind === 'dock' && A.lipPaint && !A.lipPaint.none) {
      A.foot = { padB: A.top.foot?.padB, lowestInk_0625: A.lipPaint.lowestInkToViewportBottom };
      await page.addStyleTag({ content: '@media (max-width: 1023.98px) and (orientation: portrait) { .card-foot { padding-bottom: max(0.5rem, env(safe-area-inset-bottom)) !important; } }' });
      await page.waitForTimeout(200); await settle(page, 2000);
      const b = await F(); const clip = clipOf(b, 16, vp);
      const g1 = await grab(page, clip); const g0 = await hideGrab(page, '.tool-lip > .outline-svg', clip);
      let maxY = -1; for (let y = 0; y < g1.H; y++) for (let x = 0; x < g1.W; x += 1) if (dif(g1, g0, x, y) > 60) maxY = Math.max(maxY, y);
      A.foot.lowestInk_05 = r2(vp.height - ((maxY + 1) / DPR + g1.oy));
      A.foot.padB_05 = await page.evaluate(() => getComputedStyle(document.querySelector('#card-foot')).paddingBottom);
      await page.evaluate(() => { [...document.querySelectorAll('style')].pop().remove(); });
      await page.waitForTimeout(200); await settle(page, 2000);
    }
    // ── scroll: the strip must not move while the body scrolls (the scroll discontinuity)
    if (scrolls && cell.kind !== 'land') {
      const s = await page.evaluate(async () => {
        const sc = __g.sc(); const f = () => (__g.lip() || __g.bar()).getBoundingClientRect(); const c = () => __g.card().getBoundingClientRect();
        const rows = []; for (let t = 0; t <= sc.scrollHeight; t += 37) { sc.scrollTop = t; await new Promise((r) => requestAnimationFrame(r)); rows.push([f().y - c().y, f().x - c().x]); }
        let jumps = 0, maxd = 0; for (let i = 1; i < rows.length; i++) { const d = Math.hypot(rows[i][0] - rows[i - 1][0], rows[i][1] - rows[i - 1][1]); maxd = Math.max(maxd, d); if (d > 0.5) jumps++; }
        return { steps: rows.length, jumps, maxd };
      });
      A.scrollStill = { steps: s.steps, jumps: s.jumps, maxStepPx: r2(s.maxd) };
    }
    // ── G12 the tag census: step the scroll; a VISIBLE tag whose well has left it is an orphan
    if (scrolls && (cell.name === '1280x800-fine' || cell.name === '390x844-coarse')) {
      A.tags = await page.evaluate(async () => {
        const sc = __g.sc(); let orphans = 0, pinnedSeen = 0, clippedAbove = 0, steps = 0;
        const edge = () => sc.getBoundingClientRect().top;
        for (let t = 0; t <= sc.scrollHeight; t += 23) {
          sc.scrollTop = t; await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); steps++;
          for (const w of __g.wells()) { const tag = w.querySelector('.washi-tag'); if (!tag) continue; const s = getComputedStyle(tag); if (+s.opacity < 0.5 || s.visibility === 'hidden') continue;
            const tb = tag.getBoundingClientRect(), wb = w.getBoundingClientRect(); if (tb.bottom < edge() || tb.top > sc.getBoundingClientRect().bottom) continue;
            if (s.position === 'sticky' && tb.top - (wb.top - 12) > 0.5) pinnedSeen++;
            if (wb.bottom < tb.top - 1) orphans++;
            if (tb.top < edge() - 1 - parseFloat(getComputedStyle(sc).paddingTop)) clippedAbove++; }
        }
        sc.scrollTop = 0;
        return { steps, pinnedSeen, orphans, clippedAbove, cardPadT: getComputedStyle(sc).getPropertyValue('--card-pad-t'), padT: getComputedStyle(sc).paddingTop, sentinelTop: getComputedStyle(sc, '::before').top };
      });
    }
    // ── rail fine 1280: G10 Tab walk (+ neg control), G11 notes, G14 focus rings, the i's crib
    if (cell.name === '1280x800-fine' || (cell.name === '390x844-coarse' && theme === 'light')) {
      const walk = async () => page.evaluate(async () => {
        const sc = __g.sc(); sc.scrollTop = 0; await new Promise((r) => requestAnimationFrame(r));
        const foc = [...sc.querySelectorAll('button, a[href], input, select, [tabindex]:not([tabindex="-1"])')].filter((e) => !e.closest('.action-bar') && !e.disabled && e.offsetParent !== null && !e.closest('[inert]') && e.getBoundingClientRect().width > 0);
        let under = 0, worst = -1e9; const hits = [];
        for (const e of foc) { e.focus({ focusVisible: true }); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          const s = sc.getBoundingClientRect(); const bar = __g.bar(); const sticky = bar && sc.contains(bar) && getComputedStyle(bar).position === 'sticky';
          // the band a control must clear: the opaque sticky bar (HEAD, always painted) and the 2rem fade above
          // the clip edge / the bar (both arms), which is painted only while data-fold-below is set
          const edge = sticky ? bar.getBoundingClientRect().top : s.bottom; const fadeOn = sc.hasAttribute('data-fold-below');
          const b = e.getBoundingClientRect(); const over = b.bottom - (fadeOn ? edge - 32 : edge); worst = Math.max(worst, over);
          if (over > 0.5 && b.top < s.bottom) { under++; hits.push((e.getAttribute('aria-label') || e.textContent.trim()).slice(0, 24) + ':' + over.toFixed(1) + (fadeOn ? '' : '(bar)')); } }
        return { controls: foc.length, underFade: under, worstPx: Math.round(worst * 10) / 10, hits: hits.slice(0, 6) };
      });
      A.tabWalk = await walk();
      if (arm === 'proto') { await page.addStyleTag({ content: '.card-body { scroll-padding-bottom: 0 !important; }' }); A.tabWalkNeg = await walk(); await page.evaluate(() => { [...document.querySelectorAll('style')].pop().remove(); }); }
    }
    if (cell.name === '1280x800-fine') {
      // G11: each verb's hover note sits in the foot's bottom band, under the lip's bottom stroke
      await page.evaluate(() => { __g.sc().scrollTop = 0; });
      const notes = [];
      for (let i = 0; i < 4; i++) {
        const btn = page.locator('.action-verbs > .icon-btn').nth(i); await btn.hover(); await page.waitForTimeout(260);
        notes.push(await page.evaluate((i) => { const b = document.querySelectorAll('.action-verbs > .icon-btn')[i]; const n = b.querySelector('.washi-label'); const nr = n.getBoundingClientRect(); const f = __g.R(__g.lip() || __g.bar()); const sc = __g.R(__g.sc()); const svg = __g.R(__g.lipSvg());
          const covers = [...__g.sc().querySelectorAll('button')].filter((c) => { const r = c.getBoundingClientRect(); const vis = Math.max(0, Math.min(r.bottom, sc.b) - Math.max(r.top, sc.y)); return vis > 0 && r.right > nr.left && r.left < nr.right && Math.min(r.bottom, sc.b) > nr.top && Math.max(r.top, sc.y) < nr.bottom; }).length;
          return { op: +getComputedStyle(n).opacity, topBelowFrameBottom: Math.round((nr.top - f.b) * 100) / 100, topBelowStroke: svg ? Math.round((nr.top - svg.b) * 100) / 100 : null, noteBottomToCard: Math.round((__g.card().getBoundingClientRect().bottom - nr.bottom) * 100) / 100, coversBodyControls: covers }; }, i));
      }
      A.notes = notes;
      // the berth note (invite verb, in the players well): hover it → the note in the foot reads 1
      const inv = page.locator('.invite-btn').first();
      if (await inv.count()) { await page.evaluate(() => { const b = document.querySelector('.invite-btn'); b.scrollIntoView({ block: 'center' }); }); await page.waitForTimeout(200); await inv.hover(); await page.waitForTimeout(260);
        A.berth = await page.evaluate(() => { const n = document.querySelector('.berth-note'); if (!n) return null; const nr = n.getBoundingClientRect(); const f = __g.R(__g.lip() || __g.bar()); return { op: +getComputedStyle(n).opacity, topBelowFrameBottom: Math.round((nr.top - f.b) * 100) / 100, inFoot: !!n.closest('#card-foot') }; }); }
      await page.mouse.move(5, 5); await page.waitForTimeout(200);
      // G14: each verb's focus-visible ring vs the lip's ink (differential), keyboard focus
      if (A.top.lip) {
        const b = await F(); const clip = clipOf(b, 12, vp);
        await page.addStyleTag({ content: '.washi-label { visibility: hidden !important; }' });
        await page.evaluate(() => document.activeElement?.blur());
        const base0 = await grab(page, clip); const noLip = await hideGrab(page, '.tool-lip > .outline-svg', clip);
        const lipInk = new Set(mask(base0, noLip, { x: b.x - 10, y: b.y - 10, w: b.w + 20, h: b.h + 20 }).map(([x, y]) => x + ',' + y));
        A.rings = [];
        for (let i = 0; i < 4; i++) {
          await page.evaluate((i) => { document.querySelectorAll('.action-verbs > .icon-btn')[i].focus({ focusVisible: true }); }, i);
          await page.keyboard.press('Shift'); await page.waitForTimeout(120);
          const fv = await page.evaluate(() => document.activeElement?.matches(':focus-visible'));
          const g = await grab(page, clip);
          // ring ink = focused vs unfocused, excluding the button's own glyph change (outside the button box only)
          const br = await page.evaluate((i) => __g.R(document.querySelectorAll('.action-verbs > .icon-btn')[i]), i);
          let ring = 0, overlap = 0, outsideInner = 0;
          for (let y = 0; y < g.H; y++) for (let x = 0; x < g.W; x++) { const cx = x / DPR + g.ox, cy = y / DPR + g.oy; const inside = cx > br.x + 2 && cx < br.r - 2 && cy > br.y + 2 && cy < br.b - 2; if (inside) continue; if (dif(g, base0, x, y) > 60) { ring++; if (lipInk.has(x + ',' + y)) overlap++; if (cx < b.x || cx > b.r || cy < b.y || cy > b.b) outsideInner++; } }
          A.rings.push({ fv, ringPx: ring, overlapPx: overlap, outsideLipInnerEdgePx: outsideInner });
        }
        await page.evaluate(() => document.activeElement?.blur());
      }
      // the i's crib: press it; the crib must land inside the body's frame (above the bottom fade)
      if (await page.locator('.info-btn').count()) {
        await page.evaluate(() => { __g.sc().scrollTop = 0; });
        await page.locator('.info-btn').click(); await page.waitForTimeout(900);
        A.crib = await page.evaluate(() => { const k = document.getElementById('keys-fold').getBoundingClientRect(); const s = __g.sc().getBoundingClientRect(); const bar = __g.bar(); const band = __g.sc().contains(bar) ? bar.getBoundingClientRect().top : s.bottom; return { cribTop: Math.round(k.top), cribBottom: Math.round(k.bottom), frameTop: Math.round(s.top), clearBottom: Math.round(band), inFrame: k.top >= s.top - 1 && k.bottom <= band + 1, bottomOverPx: Math.round(k.bottom - band) }; });
      }
    }
    // ── G13 landscape: the lip in place; clearances to the play row and the last well
    if (cell.kind === 'land' && A.top.lip) {
      await page.evaluate(() => { const c = __g.sc(); c.scrollTop = c.scrollHeight; });
      await page.waitForTimeout(300);
      const E = await page.evaluate(() => ({ lip: __g.R(__g.lip()), play: __g.R(document.querySelector('.play-controls')), sc: __g.R(__g.sc()) }));
      const reg = { x: E.lip.x - 12, y: E.lip.y - 24, w: E.lip.w + 24, h: E.lip.h + 48 };
      const clip = clipOf(reg, 0, vp); const all = await grab(page, clip); const noLip = await hideGrab(page, '.tool-lip > .outline-svg', clip);
      const noPlay = await hideGrab(page, '.play-controls', clip);
      // per column: the lip's lowest ink vs the play row's highest ink (daylight), and the lip's lowest
      // ink vs the play row's BOX top (the gate's box form)
      const day = []; let lipMax = -1;
      for (let x = X(all, E.lip.x + 6); x < X(all, E.lip.r - 6); x += 2) {
        let low = -1, pt = -1;
        for (let y = 0; y < all.H; y++) { if (dif(all, noLip, x, y) > 60) low = y; }
        for (let y = 0; y < all.H; y++) { if (dif(all, noPlay, x, y) > 60) { pt = y; break; } }
        lipMax = Math.max(lipMax, low);
        if (low >= 0 && pt >= 0) day.push((pt - low - 1) / DPR);
      }
      const lipBotCss = (lipMax + 1) / DPR + all.oy;
      A.land = { lipInFlow: A.end.bar?.parent, lipInkToPlayBoxTop: E.play ? r2(E.play.y - lipBotCss) : null, lipToPlayInkDaylight: { min: r2(Math.min(...day)), med: r2(med(day)), cols: day.length }, topDaylightPerColumn: A.rhythm ? A.rhythm.daylight : null, boxShadow: await page.evaluate(() => getComputedStyle(__g.bar()).boxShadow) };
    }
  } catch (e) { A.error = String(e).slice(0, 400); }
  results.push(A);
  await ctx.close();
  console.error('done', engine, theme, cell.name, arm, A.error ? 'ERR ' + A.error.slice(0, 120) : '');
}
await browser.close();
const js = JSON.stringify(results, null, 1); if (out) writeFileSync(out, js); else console.log(js);
