// G-INFO opus: the crib-in-the-strip arm applied by DOM move on MAIN (no src edit), vs the HEAD arm.
import { chromium, webkit } from 'playwright';
const BASE = 'http://127.0.0.1:4259/';
const eng = process.argv[2] === 'webkit' ? webkit : chromium;
const rungs = (process.argv[3] || '1280x800,1440x900,1280x720').split(',').map(s => s.split('x').map(Number));
const theme = process.argv[4] || 'light';
const prm = process.argv[5] === 'prm';
const out = [];
const browser = await eng.launch();
const R = (b) => ({ t: +b.top.toFixed(2), b: +b.bottom.toFixed(2), l: +b.left.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) });
for (const [w, h] of rungs) for (const arm of (process.env.ARMS||'head,strip').split(',')) for (const start of ['top', 'end']) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme, deviceScaleFactor: 2, reducedMotion: prm ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForSelector('.controls-card .action-bar .info-btn', { timeout: 30000 });
  await page.waitForTimeout(2500);
  const pre = await page.evaluate(async ({ arm, start }) => {
    const R = (b) => ({ t: +b.top.toFixed(2), b: +b.bottom.toFixed(2), l: +b.left.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) });
    const card = document.querySelector('.controls-card');
    const board = document.querySelector('.scene-board, .board-frame, [role="grid"]');
    const before = { card: R(card.getBoundingClientRect()), board: board && R(board.getBoundingClientRect()) };
    if (arm.startsWith('strip')) {
      const bar = document.querySelector('.action-bar'); const fold = document.getElementById('keys-fold');
      const st = document.createElement('style');
      st.textContent = `.action-bar{grid-template-rows:auto auto}
        .action-bar > #keys-fold{grid-column:1 / -1;grid-row:1}
        .action-bar > .action-verbs{grid-row:2}
        .action-bar > .info-btn{grid-row:2}`;
      document.head.append(st);
      bar.prepend(fold);
      if (arm === 'strip-slide') {
        const st2 = document.createElement('style');
        st2.textContent = `.action-bar > #keys-fold{transition:none !important;position:relative;z-index:0}
          .action-bar > #keys-fold > div{background:var(--color-card)}
          .action-bar > .action-verbs, .action-bar > .info-btn{position:relative;z-index:1;background:var(--color-card)}`;
        document.head.append(st2);
        const inner = fold.firstElementChild;
        new MutationObserver(() => { if (fold.classList.contains('is-open')) { const H = inner.firstElementChild.getBoundingClientRect().height + 8; inner.animate([{ transform: `translateY(${H + 6}px)` }, { transform: 'translateY(0)' }], { duration: 200, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }); } }).observe(fold, { attributes: true, attributeFilter: ['class'] });
      }
      await new Promise(r => setTimeout(r, 400));
    }
    if (arm === 'strip-nopub') { const c = card; const o = c.style.setProperty.bind(c.style); window.__armNoPub = () => { c.style.setProperty = (k, v, p) => { if (k.startsWith('--action-bar-h') || k.startsWith('--card-pad')) return; return o(k, v, p); }; }; }
    if (start === 'end') { card.scrollTop = card.scrollHeight; await new Promise(r => setTimeout(r, 400)); }
    // neuter the HEAD scroll in the strip arm (the design deletes it); count it in both
    window.__siv = 0; const orig = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (o) { window.__siv++; if (arm.startsWith('strip') && this.id === 'keys-fold') return; return orig.call(this, o); };
    const after = { card: R(card.getBoundingClientRect()), board: board && R(board.getBoundingClientRect()) };
    return { boardSel: board && board.className, before, after, st: card.scrollTop, sh: card.scrollHeight, ch: card.clientHeight,
      verbs: [...document.querySelectorAll('.action-verbs .icon-btn')].map(b => R(b.getBoundingClientRect())),
      info: R(document.querySelector('.info-btn').getBoundingClientRect()), bar: R(document.querySelector('.action-bar').getBoundingClientRect()),
      spb: getComputedStyle(card).scrollPaddingBottom };
  }, { arm, start });
  await page.evaluate(() => {
    window.__s = []; const t0 = performance.now(); const c = document.querySelector('.controls-card');
    const dl = document.querySelector('#keys-fold .keyboard-legend'); const bar = document.querySelector('.action-bar'); const i = document.querySelector('.info-btn');
    let last = t0;
    const tick = () => { const now = performance.now(); const t = now - t0; const dr = dl.getBoundingClientRect(), br = bar.getBoundingClientRect(), ir = i.getBoundingClientRect();
      window.__s.push({ t: +t.toFixed(1), dt: +(now - last).toFixed(1), st: +c.scrollTop.toFixed(2), dlTop: +dr.top.toFixed(2), dlBot: +dr.bottom.toFixed(2), barTop: +br.top.toFixed(2), iTop: +ir.top.toFixed(2) });
      last = now; if (t < 1200) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  await page.evaluate(() => window.__armNoPub && window.__armNoPub()); const b = pre.info; await page.mouse.click(b.l + b.w / 2, b.t + b.h / 2);
  await page.waitForTimeout(1400);
  const post = await page.evaluate(() => {
    const R = (b) => ({ t: +b.top.toFixed(2), b: +b.bottom.toFixed(2), l: +b.left.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) });
    const c = document.querySelector('.controls-card'); const dl = document.querySelector('#keys-fold .keyboard-legend');
    const bar = document.querySelector('.action-bar'); const cr = c.getBoundingClientRect(); const dr = dl.getBoundingClientRect(); const br = bar.getBoundingClientRect();
    const inBar = bar.contains(dl);
    // visible = inside the card's box; in HEAD arm the bar occludes from its top
    const visTop = cr.top, visBot = inBar ? cr.bottom : br.top;
    const inter = Math.max(0, Math.min(dr.bottom, visBot) - Math.max(dr.top, visTop));
    // tab walk occlusion: every focusable in the card body (not the bar) — focus it, read rect vs bar top
    const foc = [...c.querySelectorAll('button, [href], input, select, [tabindex]:not([tabindex="-1"])')].filter(e => !bar.contains(e) && e.offsetParent !== null && !e.closest('[inert]'));
    return { st: c.scrollTop, sh: c.scrollHeight, dl: R(dr), bar: R(br), visFrac: +(inter / dr.height).toFixed(3),
      verbs: [...document.querySelectorAll('.action-verbs .icon-btn')].map(b => R(b.getBoundingClientRect())),
      info: R(document.querySelector('.info-btn').getBoundingClientRect()), card: R(cr), spb: getComputedStyle(c).scrollPaddingBottom,
      barH: getComputedStyle(document.documentElement).getPropertyValue('--action-bar-h') || getComputedStyle(c).getPropertyValue('--action-bar-h'),
      nFoc: foc.length, siv: window.__siv, samples: window.__s };
  });
  // tab walk: focus each body focusable via keyboard-like focus() and measure occlusion by the bar
  const occl = await page.evaluate(async () => {
    const c = document.querySelector('.controls-card'); const bar = document.querySelector('.action-bar');
    const foc = [...c.querySelectorAll('button, [href], input, select, [tabindex]:not([tabindex="-1"])')].filter(e => !bar.contains(e) && e.offsetParent !== null && !e.closest('[inert]') && getComputedStyle(e).visibility !== 'hidden');
    let hidden = 0, worst = 0, names = [];
    for (const e of foc) { e.focus(); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); const r = e.getBoundingClientRect(); const bt = bar.getBoundingClientRect().top; const ov = r.bottom - bt; if (ov > 0.5) { hidden++; worst = Math.max(worst, ov); names.push((e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 18)); } }
    return { n: foc.length, occluded: hidden, worstPx: +worst.toFixed(2), names: names.slice(0, 6) };
  });
  const s = post.samples; delete post.samples;
  const dts = s.map(x => x.dt).slice(1).sort((a, b) => a - b);
  const stSet = [...new Set(s.map(x => x.st))];
  const iTops = s.map(x => x.iTop); const dlTops = s.map(x => x.dlTop);
  let monotone = true; for (let k = 1; k < dlTops.length; k++) if (arm.startsWith('strip') && dlTops[k] > dlTops[k - 1] + 0.01) monotone = false;
  const firstFull = s.find(x => Math.abs(x.dlTop - s.at(-1).dlTop) < 0.5);
  out.push({ eng: eng.name(), theme, prm, w, h, arm, start,
    pi: { cardW: pre.before.card.w, cardWAfterMove: pre.after.card.w, cardL: [pre.before.card.l, pre.after.card.l], boardL: [pre.before.board?.l, pre.after.board?.l], boardSel: pre.boardSel },
    preSt: pre.st, postSt: post.st, maxScroll: [pre.sh - pre.ch, post.sh - pre.ch], siv: post.siv,
    visFrac: post.visFrac, dl: post.dl, barPre: pre.bar, barPost: post.bar,
    infoDelta: +(post.info.t - pre.info.t).toFixed(2), verbsDelta: post.verbs.map((v, k) => +(v.t - pre.verbs[k].t).toFixed(2)),
    iTopRange: [Math.min(...iTops), Math.max(...iTops)], dlTopMonotoneUp: monotone, settleMs: firstFull?.t,
    frames: { n: s.length, median: dts[dts.length >> 1], max: dts.at(-1), over16_7: dts.filter(d => d > 17.5).length, over25: dts.filter(d => d > 25).length },
    stValues: stSet.slice(0, 6), spb: [pre.spb, post.spb], tabWalk: occl });
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(out, null, 1));
