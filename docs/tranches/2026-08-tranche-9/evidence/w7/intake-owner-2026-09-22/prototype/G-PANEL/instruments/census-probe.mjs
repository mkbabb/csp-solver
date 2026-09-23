// census:panel-bar — T9-M17 (new-game panel) + T9-M18 (tool strip) on MAIN 1e6cfbbf, served on 127.0.0.1:4252.
// usage: node probe.mjs <engine> [outJson] ; READ-ONLY on the product.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const pw = require('playwright');
const engine = process.argv[2] || 'chromium';
const out = process.argv[3];
// G-PANEL copy: BASE re-pointed by env (proto 4257 / control 4258), OUT = argv[3] as before; nothing else changed.
const BASE = (process.env.BASE || 'http://127.0.0.1:4257') + '/?size=3&difficulty=MEDIUM';
const CELLS = [
  { name: '390x844-coarse', vp: { width: 390, height: 844 }, touch: true },
  { name: '430x932-coarse', vp: { width: 430, height: 932 }, touch: true },
  { name: '1280x800-fine', vp: { width: 1280, height: 800 }, touch: false },
  { name: '1280x800-coarse', vp: { width: 1280, height: 800 }, touch: true },
  { name: '1440x900-fine', vp: { width: 1440, height: 900 }, touch: false },
];
if (process.env.CELLS) CELLS.splice(0, CELLS.length, ...JSON.parse(process.env.CELLS));
const THEMES = (process.env.THEMES || 'light,dark').split(',');
const SHOTS = process.env.SHOTS ? JSON.parse(process.env.SHOTS) : [];

const measure = () => {
  const r2 = (n) => Math.round(n * 100) / 100;
  const R = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: r2(b.x), y: r2(b.y), w: r2(b.width), h: r2(b.height), b: r2(b.bottom), r: r2(b.right) }; };
  const cs = (el, p) => el ? getComputedStyle(el, p) : null;
  const textRects = (root) => {
    // painted-text line boxes (Range over text nodes), in viewport px
    const out = []; const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; while ((n = tw.nextNode())) {
      if (!n.textContent.trim()) continue;
      const pe = n.parentElement; if (!pe || pe.closest('.sr-only')) continue;
      const s = getComputedStyle(pe); if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) continue;
      const rg = document.createRange(); rg.selectNodeContents(n);
      for (const q of rg.getClientRects()) if (q.width > 0 && q.height > 0) out.push({ x: q.x, y: q.y, w: q.width, h: q.height, t: n.textContent.trim().slice(0, 16) });
    }
    return out;
  };
  const ink = (root) => {
    // union-free sum of text line boxes + visible svg icon boxes inside root (approximate ink area)
    const t = textRects(root); let a = 0; for (const q of t) a += q.w * q.h;
    for (const s of root.querySelectorAll('button svg')) { const b = s.getBoundingClientRect(); if (b.width && getComputedStyle(s).display !== 'none') a += b.width * b.height; }
    return { area: a, lines: t.length, maxRight: t.length ? Math.max(...t.map((q) => q.x + q.w)) : 0, minLeft: t.length ? Math.min(...t.map((q) => q.x)) : 0 };
  };
  const card = document.querySelector('.controls-card');
  const zone = document.querySelector('.new-game-zone');
  const wrap = document.querySelector('.control-panel-wrap');
  const res = { html: document.documentElement.className, mobileArm: !!document.querySelector('.mobile-control-panel') };
  if (card) {
    const c = cs(card);
    res.card = { rect: R(card), clientH: card.clientHeight, scrollH: card.scrollHeight, scrollTop: card.scrollTop, clientW: card.clientWidth,
      pad: [c.paddingTop, c.paddingRight, c.paddingBottom, c.paddingLeft].join(' '), maxHeight: c.maxHeight, overflowY: c.overflowY,
      bg: c.backgroundColor, scrollPadB: c.scrollPaddingBottom, cardPadB: c.getPropertyValue('--card-pad-b'), actionBarH: c.getPropertyValue('--action-bar-h') };
  }
  const caseEl = document.querySelector('.drawer-case');
  if (caseEl) { const svg = caseEl.querySelector(':scope > svg, :scope > .outline-container svg, svg'); res.case = { rect: R(caseEl), svg: R(svg), padB: cs(caseEl).paddingBottom, padInline: cs(caseEl).paddingLeft + ' ' + cs(caseEl).paddingRight }; }
  res.viewport = { w: innerWidth, h: innerHeight, vvH: visualViewport?.height };
  if (zone) {
    const z = R(zone);
    const tag = zone.querySelector('.washi-tag');
    const heads = [...zone.querySelectorAll('h2')].map((h) => ({ rect: R(h), text: h.textContent.trim().replace(/\s+/g, ' '), font: cs(h).fontFamily.split(',')[0] + ' ' + cs(h).fontSize + ' ' + cs(h).fontWeight, lh: cs(h).lineHeight, mt: cs(h).marginTop, mb: cs(h).marginBottom }));
    const inner = [...(zone.querySelector('.control-panel-filtered')?.querySelectorAll(':scope > *') || [])].map((e) => ({ cls: e.className, rect: R(e), display: cs(e).display }));
    const selectors = [...zone.querySelectorAll('.ctrl-options')].map((o) => {
      const s = cs(o);
      return { cls: o.className, visible: s.display !== 'none', rect: R(o), flexDir: s.flexDirection, align: s.alignItems, justify: s.justifyContent, gap: s.rowGap + '/' + s.columnGap, wrap: s.flexWrap,
        btns: [...o.querySelectorAll('button')].map((b) => { const bs = cs(b); const tr = textRects(b)[0]; return { label: b.textContent.trim(), pressed: b.getAttribute('aria-pressed'), rect: R(b), textW: tr ? r2(tr.w) : 0, textH: tr ? r2(tr.h) : 0, font: bs.fontSize, lh: bs.lineHeight, pad: bs.paddingTop + ' ' + bs.paddingRight + ' ' + bs.paddingBottom + ' ' + bs.paddingLeft, minH: bs.minHeight, minW: bs.minWidth, align: bs.textAlign, color: bs.color }; }) };
    });
    const sections = [...zone.querySelectorAll('.staged-section')].map((s) => { const rr = R(s); const k = ink(s); return { rect: rr, inkArea: r2(k.area), inkRatio: r2(k.area / (rr.w * rr.h)), inkSpanX: r2(k.maxRight - k.minLeft), spanRatioX: r2((k.maxRight - k.minLeft) / rr.w), borderTop: cs(s).borderTopWidth + ' ' + cs(s).borderTopColor, mt: cs(s).marginTop, pt: cs(s).paddingTop }; });
    const dealRow = zone.querySelector('.deal-row'); const dk = dealRow ? ink(dealRow) : null;
    const zk = ink(zone);
    const tabs = zone.querySelector('.mobile-heading-row');
    const tabBtns = tabs ? [...tabs.querySelectorAll('button')].map((b) => ({ text: b.textContent.trim().replace(/\s+/g, ' '), rect: R(b), expanded: b.getAttribute('aria-expanded') })) : null;
    res.zone = { rect: z, pad: cs(zone).padding, inkArea: r2(zk.area), inkRatio: r2(zk.area / (z.w * z.h)), tag: { rect: R(tag), text: tag?.textContent.trim(), font: tag ? cs(tag).fontSize : null, pos: tag ? cs(tag).position : null }, heads, inner, selectors, sections,
      tabs: tabs ? { rect: R(tabs), btns: tabBtns } : null,
      dealRow: dealRow ? { rect: R(dealRow), inkRatio: r2(dk.area / (R(dealRow).w * R(dealRow).h)), borderTop: cs(dealRow).borderTopWidth, mt: cs(dealRow).marginTop, pt: cs(dealRow).paddingTop, deal: R(dealRow.querySelector('.deal-btn')), tally: R(dealRow.querySelector('.difficulty-tally')) } : null };
    // content box whitespace: zone inner width used by widest line
    res.zone.inkSpanX = r2(zk.maxRight - zk.minLeft); res.zone.spanRatioX = r2((zk.maxRight - zk.minLeft) / z.w);
  }
  // wells (every compartment) — heights, to price the case
  res.wells = [...document.querySelectorAll('.control-panel-wrap .tray-well')].map((w) => ({ tag: w.querySelector('.washi-tag')?.textContent.trim(), rect: R(w), mt: cs(w).marginTop, mb: cs(w).marginBottom }));
  const div = document.querySelector('.peek-hold-surface'); res.divider = R(div);
  // (b) the tool strip
  const bar = document.querySelector('.action-bar');
  if (bar) {
    const s = cs(bar), sb = cs(bar, '::before'), sa = cs(bar, '::after');
    const ancOutline = bar.closest('.outline-container, [class*="hand-drawn"]');
    const outlinesInside = bar.querySelectorAll('svg path').length;
    res.bar = { rect: R(bar), position: s.position, bottom: s.bottom, zIndex: s.zIndex, bg: s.backgroundColor, grid: s.gridTemplateColumns, padBlock: s.paddingTop + ' ' + s.paddingBottom, padInline: s.paddingLeft + ' ' + s.paddingRight,
      border: ['Top', 'Right', 'Bottom', 'Left'].map((k) => s[`border${k}Width`] + ' ' + s[`border${k}Style`]).join(' | '), boxShadow: s.boxShadow, outline: s.outlineStyle + ' ' + s.outlineWidth, borderRadius: s.borderRadius,
      before: { content: sb.content, h: sb.height, opacity: sb.opacity, bg: sb.backgroundImage.slice(0, 80) }, after: { content: sa.content, h: sa.height, bg: sa.backgroundColor },
      drawnChildren: [...bar.children].map((c) => c.className?.baseVal ?? c.className).slice(0, 8),
      verbs: R(bar.querySelector('.action-verbs')),
      btns: [...bar.querySelectorAll('.action-verbs > .icon-btn')].map((b) => { const sv = b.querySelector('svg'); const lab = b.querySelector('.icon-sublabel'); return { label: lab?.textContent.trim(), rect: R(b), svg: R(sv), labelFont: lab ? cs(lab).fontSize : null }; }),
      info: (() => { const i = bar.querySelector('.info-btn'); return i ? { rect: R(i), display: cs(i).display, border: cs(i).borderTopWidth + ' ' + cs(i).borderTopStyle } : null; })(),
      fadeBelowAttr: card?.hasAttribute('data-fold-below') ?? null };
    if (card) { const cr = card.getBoundingClientRect(), br = bar.getBoundingClientRect(); const c = getComputedStyle(card);
      const innerL = cr.left + parseFloat(c.paddingLeft) + parseFloat(c.borderLeftWidth), innerR = cr.right - parseFloat(c.paddingRight) - parseFloat(c.borderRightWidth) - (card.offsetWidth - card.clientWidth - parseFloat(c.borderLeftWidth) - parseFloat(c.borderRightWidth));
      res.bar.rel = { toCardLeft: r2(br.left - cr.left), toCardRight: r2(cr.right - br.right), toCardBottom: r2(cr.bottom - br.bottom), toContentL: r2(br.left - innerL), toContentR: r2(innerR - br.right), toViewportBottom: r2(innerHeight - br.bottom) };
      if (caseEl) { const k = caseEl.getBoundingClientRect(); res.bar.rel.toCaseBottom = r2(k.bottom - br.bottom); res.bar.rel.toCaseLeft = r2(br.left - k.left); res.bar.rel.toCaseRight = r2(k.right - br.right); }
    }
  }
  const pc = document.querySelector('.play-controls'); res.playControls = pc ? { rect: R(pc), parent: pc.parentElement?.id || pc.parentElement?.className } : null;
  const fold = document.querySelector('#fold-tools'); res.foldTools = fold ? { rect: R(fold), padB: cs(fold).paddingBottom } : null;
  res.tapFloor = getComputedStyle(document.documentElement).getPropertyValue('--tap-floor');
  res.typeOption = getComputedStyle(document.documentElement).getPropertyValue('--type-option');
  return res;
};

const results = [];
const browser = await pw[engine].launch();
for (const theme of THEMES) for (const cell of CELLS) {
  const ctx = await browser.newContext({ viewport: cell.vp, hasTouch: cell.touch, isMobile: cell.touch && engine !== 'firefox' && cell.vp.width < 1024, colorScheme: theme, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const rec = { engine, theme, cell: cell.name };
  try {
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForSelector('svg.handwritten-logo', { timeout: 20000 });
    await page.waitForFunction(() => document.querySelectorAll('.sudoku-cell .glyph-svg').length > 0, null, { timeout: 20000 });
    rec.pointer = await page.evaluate(() => ({ coarse: matchMedia('(pointer: coarse)').matches, hover: matchMedia('(hover: hover)').matches }));
    const tab = page.locator('.drawer-tab');
    const exp = await tab.getAttribute('aria-expanded').catch(() => null);
    rec.tabExpandedAtLoad = exp;
    if (exp === 'false') { if (cell.touch) await tab.tap(); else await tab.click(); }
    // settle: two consecutive frames agree on the card rect, polled (the dock sheet SLIDES)
    let last = '', same = 0, t0 = Date.now();
    while (Date.now() - t0 < 4000) {
      const s = await page.evaluate(() => JSON.stringify(document.querySelector('.controls-card')?.getBoundingClientRect()));
      if (s === last) { if (++same >= 3) break; } else same = 0; last = s; await page.waitForTimeout(120);
    }
    rec.settleMs = Date.now() - t0;
    rec.atTop = await page.evaluate(measure);
    // scroll the card to its end, read the bar again (sticky relation at the end pose)
    await page.evaluate(() => { const c = document.querySelector('.controls-card'); if (c) c.scrollTop = c.scrollHeight; });
    await page.waitForTimeout(300);
    const end = await page.evaluate(measure);
    rec.atEnd = { card: end.card, bar: end.bar };
    // LEAK pose (M18): scroll so the 'pencils' well's top stroke rides the bar's vertical middle,
    // then read (i) the geometry of every drawn frame vs the bar box and (ii) PAINTED ink in the bar's
    // flanks and in its own top band, off a css-scale screenshot decoded by sharp.
    const geo = await page.evaluate(() => {
      const card = document.querySelector('.controls-card'); const bar = document.querySelector('.action-bar');
      const wells = [...document.querySelectorAll('.control-panel-wrap .tray-well')];
      const w = wells[1]; if (!card || !bar || !w) return null;
      const svg = w.querySelector(':scope > .outline-svg, .outline-svg');
      const br = bar.getBoundingClientRect(), sr = svg.getBoundingClientRect();
      card.scrollTop += (sr.top + 4) - (br.top + br.height / 2);
      return true;
    });
    await page.waitForTimeout(400);
    rec.leak = await page.evaluate(() => {
      const r2 = (n) => Math.round(n * 100) / 100;
      const bar = document.querySelector('.action-bar'); const br = bar.getBoundingClientRect();
      const caseSvg = document.querySelector('.drawer-case')?.querySelector(':scope > .outline-svg');
      const cs = caseSvg?.getBoundingClientRect();
      const cstroke = caseSvg ? getComputedStyle(caseSvg.querySelector('path') || caseSvg).strokeWidth : null;
      const wells = [...document.querySelectorAll('.control-panel-wrap .tray-well')].map((w) => { const s = w.querySelector('.outline-svg').getBoundingClientRect(); return { tag: w.querySelector('.washi-tag')?.textContent.trim(), svg: { x: r2(s.x), y: r2(s.y), r: r2(s.right), b: r2(s.bottom) }, overlapsBarY: s.bottom > br.top && s.top < br.bottom, flankL: r2(br.left - s.left), flankR: r2(s.right - br.right) }; });
      return { bar: { x: r2(br.x), y: r2(br.y), r: r2(br.right), b: r2(br.bottom) }, caseSvg: cs ? { x: r2(cs.x), y: r2(cs.y), r: r2(cs.right), b: r2(cs.bottom), stroke: cstroke } : null, wells, scrollTop: document.querySelector('.controls-card').scrollTop };
    });
    if (rec.leak) {
      const sharp = require('sharp');
      const buf = await page.screenshot({ scale: 'css' });
      const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
      const px = (x, y) => { const i = (y * info.width + x) * info.channels; return [data[i], data[i + 1], data[i + 2]]; };
      const b = rec.leak.bar; const bg = px(Math.round((b.x + b.r) / 2), Math.round(b.y + 2));
      const inkCount = (x0, x1, y0, y1) => { let n = 0, t = 0; for (let y = Math.max(0, Math.floor(y0)); y < Math.min(info.height, Math.ceil(y1)); y++) for (let x = Math.max(0, Math.floor(x0)); x < Math.min(info.width, Math.ceil(x1)); x++) { t++; const p = px(x, y); if (Math.abs(p[0] - bg[0]) + Math.abs(p[1] - bg[1]) + Math.abs(p[2] - bg[2]) > 90) n++; } return { ink: n, of: t }; };
      rec.leak.paint = { bg, leftFlank: inkCount(b.x - 7, b.x, b.y, b.b), rightFlank: inkCount(b.r, b.r + 7, b.y, b.b), barTopBand: inkCount(b.x, b.r, b.y, b.y + 3), barBottomBand: inkCount(b.x, b.r, b.b - 2, b.b + 1) };
    }
    for (const sh of SHOTS) if (sh.cell === cell.name && sh.theme === theme && sh.engine === engine) {
      if (sh.scroll === 'top') { await page.evaluate(() => { document.querySelector('.controls-card').scrollTop = 0; }); await page.waitForTimeout(300); }
      if (sh.scroll === 'mid') { await page.evaluate(() => { const c = document.querySelector('.controls-card'); c.scrollTop = 200; }); await page.waitForTimeout(300); }
      const el = page.locator(sh.sel).first();
      const bb = await el.boundingBox();
      const pad = sh.pad ?? 12;
      const clip = { x: Math.max(0, bb.x - pad), y: Math.max(0, bb.y - (sh.padTop ?? pad)), width: Math.min(cell.vp.width - Math.max(0, bb.x - pad), bb.width + 2 * pad), height: Math.min(cell.vp.height - Math.max(0, bb.y - (sh.padTop ?? pad)), (sh.h ?? bb.height) + (sh.padTop ?? pad) + pad) };
      await page.screenshot({ path: sh.path, clip, scale: sh.scale || 'css' });
      rec.shot = (rec.shot || []).concat({ path: sh.path, clip });
    }
  } catch (e) { rec.error = String(e).slice(0, 300); }
  results.push(rec);
  await ctx.close();
}
await browser.close();
const js = JSON.stringify(results, null, 1);
if (out) writeFileSync(out, js); else console.log(js);
