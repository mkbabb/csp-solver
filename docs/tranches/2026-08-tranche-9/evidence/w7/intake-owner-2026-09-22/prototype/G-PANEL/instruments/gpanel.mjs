// G-PANEL gate probe (T9-M17) — reads G1–G9 geometry, G6/G10 from PAINTED bytes, G13 across a chip press.
// usage: BASE=http://127.0.0.1:4257 node gpanel.mjs <engine> <out.json>
//   env: CELLS (json [{name,w,h,touch}]), THEMES (light,dark), GAMES (sudoku,futoshiki), PLANTS (json {name: css}),
//        SHOTS (json [{cell,theme,game,sel,path,pad,css}]), ARMED=1 (read the coarse rail armed), PANEL=1 (test-10 read)
// READ-ONLY on the product: every plant is an in-page style tag in its own context.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const pw = require('playwright');
const sharp = require('sharp');

const engine = process.argv[2] || 'chromium';
const out = process.argv[3];
const BASE = process.env.BASE || 'http://127.0.0.1:4257';
// Encoded payloads minted with persistence.ts:189-201's codec (version byte 1 + `rawSize.cells[.clues]`, base64url).
const PAYLOAD = {
  sudoku: '?size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5',
  futoshiki: '?game=futoshiki&board=ATUuMTAwMDIwMDAzMDAwMDQwMDA1MDAwMDEwMC4',
};
const CELLS = process.env.CELLS ? JSON.parse(process.env.CELLS) : [{ name: '1280x800-fine', w: 1280, h: 800, touch: false }];
const THEMES = (process.env.THEMES || 'light').split(',');
const GAMES = (process.env.GAMES || 'sudoku').split(',');
const PLANTS = process.env.PLANTS ? JSON.parse(process.env.PLANTS) : { none: '' };
const SHOTS = process.env.SHOTS ? JSON.parse(process.env.SHOTS) : [];
const PRM = process.env.PRM === '1';

const measure = () => {
  const r2 = (n) => Math.round(n * 100) / 100;
  const R = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: r2(b.x), y: r2(b.y), w: r2(b.width), h: r2(b.height), b: r2(b.bottom), r: r2(b.right) }; };
  const T = (el) => { // painted text line box (union of the element's own text rects)
    if (!el) return null; const rg = document.createRange(); rg.selectNodeContents(el);
    const qs = [...rg.getClientRects()].filter((q) => q.width > 0 && q.height > 0); if (!qs.length) return null;
    const x = Math.min(...qs.map((q) => q.x)), y = Math.min(...qs.map((q) => q.y)), r = Math.max(...qs.map((q) => q.right)), b = Math.max(...qs.map((q) => q.bottom));
    return { x: r2(x), y: r2(y), w: r2(r - x), h: r2(b - y), b: r2(b), r: r2(r) };
  };
  const vis = (el) => el.getClientRects().length > 0;
  const card = document.querySelector('.controls-card');
  const zone = document.querySelector('.new-game-zone');
  const res = {
    regime: { coarse: matchMedia('(pointer: coarse)').matches, row: matchMedia('(min-width: 1024px)').matches, rail: !!document.querySelector('.controls-card .control-panel-wrap') && !document.querySelector('.mobile-control-panel'), prm: matchMedia('(prefers-reduced-motion: reduce)').matches },
    card: card ? { ...R(card), clientW: card.clientWidth, scrollW: card.scrollWidth, clientH: card.clientHeight, scrollH: card.scrollHeight, scrollTop: card.scrollTop } : null,
    board: R(document.querySelector('.board-group')),
    zone: R(zone),
    zoneStep: getComputedStyle(zone).getPropertyValue('--zone-step'),
    panelH: R(document.querySelector('.controls-card .control-panel-wrap'))?.h ?? null,
  };
  const tag = zone.querySelector('.washi-tag'); res.tag = R(tag);
  res.sections = [...zone.querySelectorAll('.staged-section')].map((s) => ({ rect: R(s), pt: getComputedStyle(s).paddingTop, mt: getComputedStyle(s).marginTop, h2: R(s.querySelector('h2')), h2Text: T(s.querySelector('h2')) }));
  // every chip group in the card, staged and live
  res.groups = [...document.querySelectorAll('.controls-card .ctrl-options')].filter(vis).map((o) => {
    const kids = [...o.children].filter((k) => k.classList.contains('ctrl-btn') && vis(k));
    const rects = kids.map((k) => R(k));
    const tops = [...new Set(rects.map((r) => Math.round(r.y * 10) / 10))];
    // neighbour gaps both axes: same line → x gap; consecutive lines → y gap (min over lines)
    let gx = Infinity, gy = Infinity;
    for (let i = 1; i < rects.length; i++) if (Math.abs(rects[i].y - rects[i - 1].y) < 0.5) gx = Math.min(gx, rects[i].x - rects[i - 1].r);
    const lines = tops.map((t) => rects.filter((r) => Math.abs(Math.round(r.y * 10) / 10 - t) < 0.05));
    for (let i = 1; i < lines.length; i++) gy = Math.min(gy, Math.min(...lines[i].map((r) => r.y)) - Math.max(...lines[i - 1].map((r) => r.b)));
    return { cls: o.className, staged: !!o.closest('.staged-section'), labels: kids.map((k) => k.textContent.trim()), boxes: rects.map((r) => `${r.w}x${r.h}`), rects, lineCount: tops.length, lineFirstX: lines.map((l) => l[0].x), gapX: gx === Infinity ? null : r2(gx), gapY: gy === Infinity ? null : r2(gy), firstText: T(kids[0]), dir: getComputedStyle(o).flexDirection, contain: getComputedStyle(o).contain };
  });
  const dr = zone.querySelector('.deal-row');
  const btn = dr.querySelector('.deal-btn'); const lab = btn.querySelector('.icon-sublabel'); const tally = dr.querySelector('.difficulty-tally');
  res.deal = { row: R(dr), rowPad: getComputedStyle(dr).paddingTop, rowMt: getComputedStyle(dr).marginTop, btn: R(btn), btnPadInline: getComputedStyle(btn).paddingLeft, die: R(btn.querySelector('svg')), label: T(lab), labelText: lab.textContent.trim(), tally: R(tally), tallyLabel: T(tally?.querySelector('.dt-label')), marks: R(tally?.querySelector('.dt-marks')) };
  if (tally) { const a = res.deal.btn, b = res.deal.tally; const ix = Math.max(0, Math.min(a.r, b.r) - Math.max(a.x, b.x)), iy = Math.max(0, Math.min(a.b, b.b) - Math.max(a.y, b.y)); res.deal.intersect = r2(ix * iy); res.deal.clearX = r2(b.x - a.r); res.deal.baselineDelta = res.deal.label && res.deal.tallyLabel ? r2(res.deal.tallyLabel.b - res.deal.label.b) : null; }
  const bar = document.querySelector('.action-bar'); res.bar = R(bar);
  // the next well's tape (pencils) vs the fade line
  const wells = [...document.querySelectorAll('.control-panel-wrap .tray-well')];
  const t2 = wells[1]?.querySelector('.washi-tag');
  res.nextTape = t2 ? { rect: R(t2), opacity: getComputedStyle(t2).opacity, underBar: t2.hasAttribute('data-under-bar'), text: t2.textContent.trim() } : null;
  res.ctrlMin = (() => { const bs = [...document.querySelectorAll('.controls-card .ctrl-btn')].filter(vis).map((b) => b.getBoundingClientRect()); return bs.length ? { minW: r2(Math.min(...bs.map((b) => b.width))), minH: r2(Math.min(...bs.map((b) => b.height))), n: bs.length } : null; })();
  return res;
};

// painted-ink left edge inside a rect (CSS px) on a device-scale screenshot, vs the paper sampled beside it
function inkLeft(img, rect, dpr) {
  const { data, info } = img; const px = (x, y) => { const i = (y * info.width + x) * info.channels; return [data[i], data[i + 1], data[i + 2]]; };
  const y0 = Math.max(0, Math.floor(rect.y * dpr)), y1 = Math.min(info.height, Math.ceil(rect.b * dpr));
  const x0 = Math.max(0, Math.floor((rect.x - 6) * dpr)), x1 = Math.min(info.width, Math.ceil(rect.r * dpr));
  const bg = px(Math.max(0, x0), Math.floor((y0 + y1) / 2));
  for (let x = x0; x < x1; x++) for (let y = y0; y < y1; y++) { const p = px(x, y); if (Math.abs(p[0] - bg[0]) + Math.abs(p[1] - bg[1]) + Math.abs(p[2] - bg[2]) > 90) return Math.round((x / dpr) * 100) / 100; }
  return null;
}
// AA from painted bytes: paper = median of a 3-px ring outside the text rect; ink = the pixel of max luminance distance inside it
function aa(img, rect, dpr) {
  const { data, info } = img; const px = (x, y) => { const i = (y * info.width + x) * info.channels; return [data[i], data[i + 1], data[i + 2]]; };
  const L = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  // the glyph band only: the top 70 % of the line box, so a selected chip's scribble (drawn under the word) never stands in for its ink
  const X0 = Math.floor(rect.x * dpr), X1 = Math.ceil(rect.r * dpr), Y0 = Math.floor(rect.y * dpr), Y1 = Math.ceil((rect.y + 0.7 * (rect.b - rect.y)) * dpr), YB = Math.ceil(rect.b * dpr);
  const ring = []; for (let x = X0 - 3; x < X1 + 3; x++) for (const y of [Y0 - 3, Y0 - 2, YB + 1, YB + 2]) if (x >= 0 && y >= 0 && x < info.width && y < info.height) ring.push(L(px(x, y)));
  ring.sort((a, b) => a - b); const paper = ring[Math.floor(ring.length / 2)];
  const inks = []; for (let y = Y0; y < Y1; y++) for (let x = X0; x < X1; x++) inks.push(L(px(x, y)));
  // the ink = the 98th-percentile distance from paper (robust to one stray anti-aliased pixel)
  inks.sort((a, b) => Math.abs(b - paper) - Math.abs(a - paper));
  const ink = inks[Math.floor(inks.length * 0.02)];
  const hi = Math.max(ink, paper), lo = Math.min(ink, paper);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

const results = [];
const browser = await pw[engine].launch();
for (const game of GAMES) for (const theme of THEMES) for (const cell of CELLS) for (const [plant, css] of Object.entries(PLANTS)) {
  const ctx = await browser.newContext({ viewport: { width: cell.w, height: cell.h }, hasTouch: cell.touch, isMobile: cell.mobile ?? (cell.touch && cell.w < 1024), colorScheme: theme, deviceScaleFactor: 2, reducedMotion: PRM ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const rec = { engine, game, theme, cell: cell.name, plant };
  try {
    await page.goto(BASE + '/' + PAYLOAD[game], { waitUntil: 'load' });
    await page.waitForSelector('svg.handwritten-logo', { timeout: 20000 });
    await page.waitForSelector('.controls-card .ctrl-btn', { state: 'attached', timeout: 20000 });
    await page.waitForTimeout(600);
    rec.url = page.url().replace(BASE, '');
    const tab = page.locator('.drawer-tab');
    if ((await tab.count()) && (await tab.getAttribute('aria-expanded')) === 'false') { if (cell.touch) await tab.tap(); else await tab.click(); }
    // settle: the card rect agrees across 3 polls ≥120 ms apart (the dock sheet SLIDES ~700 ms)
    let last = '', same = 0; const t0 = Date.now();
    while (Date.now() - t0 < 5000) { const s = await page.evaluate(() => JSON.stringify(document.querySelector('.controls-card')?.getBoundingClientRect())); if (s === last) { if (++same >= 3) break; } else same = 0; last = s; await page.waitForTimeout(120); }
    rec.settleMs = Date.now() - t0;
    if (css) { await page.addStyleTag({ content: css }); await page.waitForTimeout(150); }
    await page.evaluate(() => { const c = document.querySelector('.controls-card'); if (c) c.scrollTop = 0; });
    await page.waitForTimeout(250);
    rec.m = await page.evaluate(measure);
    // painted reads: G6 ink-left edges, G10 AA — at a pose where the zone is clear of the bar's fade
    rec.aaScroll = await page.evaluate(() => { const c = document.querySelector('.controls-card'); const d = document.querySelector('.new-game-zone .deal-row'); const bar = document.querySelector('.action-bar'); const over = d.getBoundingClientRect().bottom - (bar.getBoundingClientRect().top - 40); if (over > 0) c.scrollTop += over; return c.scrollTop; });
    await page.waitForTimeout(250);
    rec.mAA = await page.evaluate(measure);
    const shot = await page.screenshot({ scale: 'device' });
    const img = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
    const m = rec.mAA; const stagedGroups = m.groups.filter((g) => g.staged);
    rec.ink = {
      h2: m.sections[0]?.h2Text ? inkLeft(img, m.sections[0].h2Text, 2) : null,
      chip: stagedGroups[0]?.firstText ? inkLeft(img, stagedGroups[0].firstText, 2) : null,
      die: m.deal.die ? inkLeft(img, m.deal.die, 2) : null,
    };
    const rects = await page.evaluate(() => {
      const T = (el) => { if (!el) return null; const rg = document.createRange(); rg.selectNodeContents(el); const qs = [...rg.getClientRects()].filter((q) => q.width > 0); if (!qs.length) return null; return { x: Math.min(...qs.map((q) => q.x)), y: Math.min(...qs.map((q) => q.y)), r: Math.max(...qs.map((q) => q.right)), b: Math.max(...qs.map((q) => q.bottom)) }; };
      const z = document.querySelector('.new-game-zone');
      const unsel = z.querySelector('.ctrl-btn[aria-pressed="false"]');
      const lvl = [...z.querySelectorAll('.staged-section')].at(-1);
      return { unselectedChip: T(unsel), selectedLevel: T(lvl?.querySelector('.ctrl-btn[aria-pressed="true"]')), levelH2: T(lvl?.querySelector('h2')), dealt: T(z.querySelector('.dt-label')), dealSublabel: T(z.querySelector('.deal-btn .icon-sublabel')) };
    });
    rec.aa = Object.fromEntries(Object.entries(rects).map(([k, r]) => [k, r ? aa(img, r, 2) : null]));
    delete rec.mAA;
    await page.evaluate(() => { document.querySelector('.controls-card').scrollTop = 0; });
    await page.waitForTimeout(200);
    if (process.env.ARMED === '1') {
      await page.evaluate(() => { const l = document.querySelector('.new-game-zone .deal-btn .icon-sublabel'); l.textContent = 'sure?'; l.classList.add('is-armed'); });
      await page.waitForTimeout(100);
      rec.armed = await page.evaluate(measure).then((mm) => ({ deal: mm.deal }));
    }
    for (const sh of SHOTS) if (sh.cell === cell.name && sh.theme === theme && sh.game === game && (sh.plant ?? 'none') === plant) {
      if (sh.css) { await page.addStyleTag({ content: sh.css }); await page.waitForTimeout(150); }
      if (sh.scrollSel) { await page.evaluate((s) => { const c = document.querySelector('.controls-card'); const e = document.querySelector(s); c.scrollTop += e.getBoundingClientRect().top - c.getBoundingClientRect().top - 24; }, sh.scrollSel); await page.waitForTimeout(250); }
      const bb = await page.locator(sh.sel).first().boundingBox(); const pad = sh.pad ?? 10;
      const clip = { x: Math.max(0, bb.x - pad), y: Math.max(0, bb.y - pad), width: Math.min(cell.w, bb.width + 2 * pad), height: Math.min(cell.h - Math.max(0, bb.y - pad), bb.height + 2 * pad) };
      await page.screenshot({ path: sh.path, clip, scale: 'device' });
    }
  } catch (e) { rec.error = String(e).slice(0, 400); }
  results.push(rec);
  await ctx.close();
}
await browser.close();
const js = JSON.stringify(results, null, 1);
if (out) writeFileSync(out, js); else console.log(js);
