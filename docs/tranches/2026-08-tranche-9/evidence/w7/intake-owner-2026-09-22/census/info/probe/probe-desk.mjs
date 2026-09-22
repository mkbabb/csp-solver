// census:info — the rail's `i` (GameControlPanel .info-btn → #keys-fold) at desk rungs, both engines.
import { chromium, webkit } from 'playwright';
const BASE = 'http://127.0.0.1:4251/';
const eng = process.argv[2] === 'webkit' ? webkit : chromium;
const rungs = (process.argv[3] || '1280x800,1440x900,1280x720').split(',').map(s => s.split('x').map(Number));
const themes = (process.argv[4] || 'light').split(',');
const out = [];
const browser = await eng.launch();
for (const theme of themes) for (const [w, h] of rungs) for (const start of ['top', 'end']) for (const mode of (process.argv[5]||'mouse,key').split(',')) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme, deviceScaleFactor: 2, reducedMotion: process.argv[6] === 'prm' ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForSelector('.controls-card .action-bar', { timeout: 30000 });
  await page.waitForTimeout(2500);
  const pre = await page.evaluate(async (start) => {
    const card = document.querySelector('.controls-card');
    const btn = document.querySelector('.info-btn');
    const cs = btn ? getComputedStyle(btn) : null;
    if (start === 'end') { card.scrollTop = card.scrollHeight; await new Promise(r => setTimeout(r, 300)); }
    // instrument scrollIntoView
    window.__siv = [];
    const orig = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (o) {
      const r = this.getBoundingClientRect(); const c = document.querySelector('.controls-card');
      const cr = c.getBoundingClientRect(); const br = document.querySelector('.action-bar').getBoundingClientRect();
      window.__siv.push({ id: this.id, opts: o, t: performance.now(), foldH: +r.height.toFixed(2), foldTop: +r.top.toFixed(2), foldBot: +r.bottom.toFixed(2),
        cardTop: +cr.top.toFixed(2), cardBot: +cr.bottom.toFixed(2), barTop: +br.top.toFixed(2), scrollTop: c.scrollTop,
        spb: getComputedStyle(c).scrollPaddingBottom, spt: getComputedStyle(c).scrollPaddingTop, cls: this.className });
      return orig.call(this, o);
    };
    const r = (el) => { const b = el.getBoundingClientRect(); return { top: +b.top.toFixed(2), bottom: +b.bottom.toFixed(2), h: +b.height.toFixed(2), left: +b.left.toFixed(2), w: +b.width.toFixed(2) }; };
    const ccs = getComputedStyle(card);
    return {
      infoBtns: document.querySelectorAll('.info-btn').length,
      btnDisplay: cs && cs.display, btnRect: btn && r(btn),
      overflowY: ccs.overflowY, scrollTop: card.scrollTop, scrollHeight: card.scrollHeight, clientHeight: card.clientHeight,
      maxScroll: card.scrollHeight - card.clientHeight, cardRect: r(card), barRect: r(document.querySelector('.action-bar')),
      foldRect: r(document.getElementById('keys-fold')), dlRect: r(document.querySelector('#keys-fold .keyboard-legend')),
      spb: ccs.scrollPaddingBottom, spt: ccs.scrollPaddingTop, padB: ccs.paddingBottom, borderTop: ccs.borderTopWidth,
      fineHover: matchMedia('(hover: hover) and (pointer: fine)').matches, prm: matchMedia('(prefers-reduced-motion: reduce)').matches,
      docScroll: document.scrollingElement.scrollTop,
      foldTransition: getComputedStyle(document.getElementById('keys-fold')).transition,
    };
  }, start);
  if (!pre.infoBtns || pre.btnDisplay === 'none') { out.push({ eng: eng.name(), theme, w, h, start, pre, note: 'no visible i' }); await ctx.close(); continue; }
  // sampler for 1500 ms after the click
  await page.evaluate(() => {
    window.__s = []; const t0 = performance.now(); const c = document.querySelector('.controls-card');
    const f = document.getElementById('keys-fold'); const dl = f.querySelector('.keyboard-legend'); const bar = document.querySelector('.action-bar');
    window.__t0 = t0;
    const tick = () => { const t = performance.now() - t0; const fr = f.getBoundingClientRect(), dr = dl.getBoundingClientRect(), br = bar.getBoundingClientRect(), cr = c.getBoundingClientRect();
      window.__s.push({ t: +t.toFixed(1), st: +c.scrollTop.toFixed(2), sh: c.scrollHeight, foldH: +fr.height.toFixed(2), dlTop: +dr.top.toFixed(2), dlBot: +dr.bottom.toFixed(2), barTop: +br.top.toFixed(2), cardTop: +cr.top.toFixed(2) });
      if (t < 1500) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  if (mode === 'mouse') { const b = await page.evaluate(() => { const r = document.querySelector('.info-btn').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); await page.mouse.click(b.x, b.y); }
  else { await page.evaluate(() => document.querySelector('.info-btn').focus({ preventScroll: true })); await page.keyboard.press('Enter'); }
  await page.waitForTimeout(1700);
  const post = await page.evaluate(() => {
    const c = document.querySelector('.controls-card'); const f = document.getElementById('keys-fold');
    const dl = f.querySelector('.keyboard-legend'); const bar = document.querySelector('.action-bar');
    const cr = c.getBoundingClientRect(), dr = dl.getBoundingClientRect(), br = bar.getBoundingClientRect(), fr = f.getBoundingClientRect();
    const visTop = cr.top + parseFloat(getComputedStyle(c).borderTopWidth); const visBot = br.top; // the bar is opaque, z 60
    const inter = Math.max(0, Math.min(dr.bottom, visBot) - Math.max(dr.top, visTop));
    return { expanded: document.querySelector('.info-btn').getAttribute('aria-expanded'), scrollTop: c.scrollTop, scrollHeight: c.scrollHeight, maxScroll: c.scrollHeight - c.clientHeight,
      foldRect: { top: +fr.top.toFixed(2), bottom: +fr.bottom.toFixed(2), h: +fr.height.toFixed(2) }, dlRect: { top: +dr.top.toFixed(2), bottom: +dr.bottom.toFixed(2), h: +dr.height.toFixed(2) },
      barTop: +br.top.toFixed(2), cardTop: +cr.top.toFixed(2), cardBottom: +cr.bottom.toFixed(2),
      dlVisiblePx: +inter.toFixed(2), dlVisibleFrac: +(inter / dr.height).toFixed(3), dlBelowBarPx: +Math.max(0, dr.bottom - visBot).toFixed(2),
      siv: window.__siv, samples: window.__s };
  });
  const s = post.samples; const sts = s.map(x => x.st);
  const summary = { n: s.length, stFirst: sts[0], stLast: sts.at(-1), stMin: Math.min(...sts), stMax: Math.max(...sts), foldHFirst: s[0]?.foldH, foldHLast: s.at(-1)?.foldH,
    foldSettleMs: (s.find(x => Math.abs(x.foldH - s.at(-1).foldH) < 0.5) || {}).t, stChangeMs: (s.find(x => Math.abs(x.st - sts[0]) > 0.5) || {}).t,
    stSettleMs: (s.find(x => Math.abs(x.st - sts.at(-1)) < 0.5) || {}).t,
    worstDlBelowBar: Math.max(...s.map(x => x.dlBot - x.barTop)).toFixed(2), keyframes: s.filter((_, i) => i % 6 === 0 && i < 40).map(x => `${x.t}:st${x.st}/h${x.foldH}/dlBot${x.dlBot}/bar${x.barTop}`) };
  delete post.samples;
  const shot = `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/.owner-intake/info/${eng.name()}-${theme}-${w}x${h}-${start}-${mode}${process.argv[6]||""}.png`;
  await page.screenshot({ path: shot, clip: { x: Math.max(0, pre.cardRect.left - 8), y: 0, width: Math.min(pre.cardRect.w + 16, w), height: h } });
  out.push({ eng: eng.name(), theme, w, h, start, mode, pre, post, summary, shot });
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(out, null, 1));
