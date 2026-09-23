// G-INFO prototype probe — forked from portfolio/G-INFO/opus-probe/probe.mjs (rAF sampler, scrollIntoView
// hooked) and census/info/probe/probe-desk.mjs. Runs the SAME script on the HEAD control (4256, dist-base)
// and the prototype (4255, dist-proto) for every cell, in the same run, arms interleaved per cell.
//   node probe.mjs <chromium|webkit> <rungs e.g. 1280x800,1024x768> <light|dark> <prm|no> <modes mouse,key> <starts top,end> <out.json>
// Per press: painted-visible fraction of the crib <dl> at press+700 ms by paintedExtent DIFFERENCING
// (dl shown vs visibility:hidden in situ, over the same reading with the crib scrolled fully into view), scrollTop Δ,
// scrollIntoView calls, verbs+"i" rect Δ per frame, the fold's top-edge trace, --action-bar-h.
import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import sharp from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs';
import { writeFileSync } from 'node:fs';

const ARMS = { base: 'http://127.0.0.1:4256/', proto: 'http://127.0.0.1:4255/' };
const [engName, rungArg, theme, prmArg, modeArg, startArg, outFile] = process.argv.slice(2);
const eng = engName === 'webkit' ? webkit : chromium;
const rungs = rungArg.split(',').map((s) => s.split('x').map(Number));
const prm = prmArg === 'prm';
const modes = (modeArg || 'mouse,key').split(',');
const starts = (startArg || 'top,end').split(',');

// pixels whose max channel differs by > 24 between the two shots
async function diffCount(a, b) {
  const A = await sharp(a).removeAlpha().raw().toBuffer();
  const B = await sharp(b).removeAlpha().raw().toBuffer();
  let n = 0;
  for (let i = 0; i < Math.min(A.length, B.length); i += 3)
    if (Math.max(Math.abs(A[i] - B[i]), Math.abs(A[i + 1] - B[i + 1]), Math.abs(A[i + 2] - B[i + 2])) > 24) n++;
  return n;
}
const clipOf = (r, vw, vh) => {
  const x = Math.max(0, r.l), y = Math.max(0, r.t), x2 = Math.min(vw, r.l + r.w), y2 = Math.min(vh, r.t + r.h);
  return x2 - x < 1 || y2 - y < 1 ? null : { x, y, width: x2 - x, height: y2 - y };
};

// painted extent of the dl: shown vs hidden, same pose
async function paintedInSitu(page, vw, vh) {
  const r = await page.evaluate(() => { const b = document.querySelector('#keys-fold .keyboard-legend').getBoundingClientRect(); return { l: b.left, t: b.top, w: b.width, h: b.height }; });
  const clip = clipOf(r, vw, vh);
  if (!clip) return 0;
  const a = await page.screenshot({ clip });
  await page.evaluate(() => new Promise((res) => { document.querySelector('#keys-fold .keyboard-legend').style.visibility = 'hidden'; requestAnimationFrame(() => requestAnimationFrame(res)); }));
  const b = await page.screenshot({ clip });
  await page.evaluate(() => { document.querySelector('#keys-fold .keyboard-legend').style.visibility = ''; });
  return diffCount(a, b);
}
// the reference: the same in-situ differencing with the open crib brought fully into view: the card
// scrolled to its NEW end (census c3's pose for HEAD: 1.000 by rect, 8 px above the bar; a no-op for the
// strip arm, whose crib rides the sticky bar). Same paper, engine and raster: only the position differs.
// (A clone painted on a fixed host read 0.972-0.974 on a crib visibly whole, so it was dropped as biased.)
async function paintedReference(page, vw, vh) {
  await page.evaluate(() => { const c = document.querySelector('.controls-card'); c.scrollTop = c.scrollHeight; });
  await page.waitForTimeout(350);
  return paintedInSitu(page, vw, vh);
}
// ink rows in the flanks beside the bar (the wells' 4 px outset leak), in CSS px of height
async function flankInk(page) {
  const bar = await page.evaluate(() => { const b = document.querySelector('.action-bar').getBoundingClientRect(); const card = document.querySelector('.controls-card'); return { l: b.left, r: b.right, t: b.top, b: b.bottom, bg: getComputedStyle(card).backgroundColor }; });
  const m = bar.bg.match(/\d+/g).map(Number);
  const out = {};
  for (const [side, x] of [['left', bar.l - 8], ['right', bar.r]]) {
    const buf = await page.screenshot({ clip: { x, y: bar.t, width: 8, height: bar.b - bar.t } });
    const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    let rows = 0;
    for (let y = 0; y < info.height; y++) {
      let ink = false;
      for (let xx = 0; xx < info.width; xx++) { const i = (y * info.width + xx) * 3; if (Math.max(Math.abs(data[i] - m[0]), Math.abs(data[i + 1] - m[1]), Math.abs(data[i + 2] - m[2])) > 48) { ink = true; break; } }
      if (ink) rows++;
    }
    out[side] = +(rows / (info.height / (bar.b - bar.t))).toFixed(1);
  }
  out.barH = +(bar.b - bar.t).toFixed(2);
  return out;
}

const browser = await eng.launch();
const out = [];
for (const [w, h] of rungs) for (const start of starts) for (const mode of modes) for (const arm of ['base', 'proto']) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme, deviceScaleFactor: 2, reducedMotion: prm ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const row = { eng: eng.name(), arm, theme, prm, w, h, start, mode };
  try {
    await page.goto(ARMS[arm], { waitUntil: 'load' });
    await page.waitForSelector('.controls-card .action-bar .info-btn', { state: 'attached', timeout: 30000 });
    await page.waitForTimeout(2500);
    const pre = await page.evaluate(async (start) => {
      const R = (b) => ({ l: +b.left.toFixed(2), t: +b.top.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) });
      const card = document.querySelector('.controls-card');
      const grid = document.querySelector('[role="grid"]');
      const pi = { cardW: +card.getBoundingClientRect().width.toFixed(2), cardL: +card.getBoundingClientRect().left.toFixed(2), boardL: grid ? +grid.getBoundingClientRect().left.toFixed(2) : null };
      if (start === 'end') { card.scrollTop = card.scrollHeight; await new Promise((r) => setTimeout(r, 400)); }
      window.__siv = 0; const orig = Element.prototype.scrollIntoView;
      Element.prototype.scrollIntoView = function (o) { window.__siv++; return orig.call(this, o); };
      window.__tPress = null;
      const mark = () => { if (window.__tPress === null) window.__tPress = performance.now(); };
      document.addEventListener('pointerdown', mark, true); document.addEventListener('keydown', mark, true);
      const bar = document.querySelector('.action-bar');
      const verbs = [...bar.querySelectorAll('.action-verbs > .icon-btn, .action-bar > .info-btn')].filter((e) => getComputedStyle(e).display !== 'none');
      window.__verbs = verbs; window.__verbs0 = verbs.map((e) => { const b = e.getBoundingClientRect(); return [b.left, b.top]; });
      return { pi, st: card.scrollTop, sh: card.scrollHeight, ch: card.clientHeight, bar: R(bar.getBoundingClientRect()), barH: card.style.getPropertyValue('--action-bar-h'), spb: getComputedStyle(card).scrollPaddingBottom, nVerbs: verbs.length, info: R(document.querySelector('.info-btn').getBoundingClientRect()), inBar: bar.contains(document.getElementById('keys-fold')) };
    }, start);
    row.pre = pre;
    let flankClosed = null;
    if (start === 'top' && mode === 'mouse') flankClosed = await flankInk(page);
    // sampler
    await page.evaluate(() => {
      window.__s = []; const c = document.querySelector('.controls-card'); const f = document.getElementById('keys-fold');
      const dl = f.querySelector('.keyboard-legend'); const bar = document.querySelector('.action-bar'); let last = performance.now(); const t0 = last;
      const tick = (ts) => {
        const now = performance.now(); const fr = f.getBoundingClientRect(), dr = dl.getBoundingClientRect(), br = bar.getBoundingClientRect();
        let dv = 0; window.__verbs.forEach((e, k) => { const b = e.getBoundingClientRect(); dv = Math.max(dv, Math.abs(b.left - window.__verbs0[k][0]), Math.abs(b.top - window.__verbs0[k][1])); });
        window.__s.push({ t: now, dt: now - last, st: c.scrollTop, foldTop: fr.top, foldH: fr.height, dlTop: dr.top, dlBot: dr.bottom, barTop: br.top, dv, ts });
        last = now; if (now - t0 < 2400) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await page.waitForTimeout(200);
    if (mode === 'mouse') { const b = pre.info; await page.mouse.click(b.l + b.w / 2, b.t + b.h / 2); }
    else { await page.evaluate(() => document.querySelector('.info-btn').focus({ preventScroll: true })); await page.keyboard.press('Enter'); }
    await page.mouse.move(2, 2);
    await page.waitForFunction(() => window.__tPress !== null && performance.now() - window.__tPress >= 695, null, { timeout: 5000 });
    const tShot = await page.evaluate(() => performance.now() - window.__tPress);
    const dVis = await paintedInSitu(page, w, h);
    await page.waitForFunction(() => performance.now() - window.__tPress >= 1300, null, { timeout: 5000 });
    const post = await page.evaluate(() => {
      const R = (b) => ({ l: +b.left.toFixed(2), t: +b.top.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) });
      const card = document.querySelector('.controls-card'); const bar = document.querySelector('.action-bar');
      const dl = document.querySelector('#keys-fold .keyboard-legend').getBoundingClientRect(); const verbsRow = document.querySelector('.action-verbs').getBoundingClientRect();
      return { st: card.scrollTop, sh: card.scrollHeight, ch: card.clientHeight, bar: R(bar.getBoundingClientRect()), barH: card.style.getPropertyValue('--action-bar-h'), spb: getComputedStyle(card).scrollPaddingBottom,
        dl: R(dl), verbsRowTop: +verbsRow.top.toFixed(2), expanded: document.querySelector('.info-btn').getAttribute('aria-expanded'), siv: window.__siv, tPress: window.__tPress, s: window.__s };
    });
    const dRef = await paintedReference(page, w, h);
    const s = post.s.filter((x) => x.t >= post.tPress - 20); delete post.s;
    const fin = s.at(-1);
    const hFinal = fin.foldH;
    // the fold's top-edge trace (proto: rises; base: grows downward under the bar)
    const tops = s.map((x) => x.foldTop);
    let reversal = 0, maxStep = 0, ratio = 0;
    const slope0 = 1 / 0.33; // cubic-bezier(0.33,1,0.68,1): dy/dx at 0 = y1/x1, the curve's peak
    for (let k = 1; k < s.length; k++) {
      const step = s[k - 1].foldTop - s[k].foldTop; // upward positive
      if (step < -0.5) reversal = Math.max(reversal, -step);
      maxStep = Math.max(maxStep, Math.abs(step));
      const fdt = s[k].ts && s[k - 1].ts ? s[k].ts - s[k - 1].ts : s[k].dt; const allowed = (slope0 * hFinal * fdt) / 200; // frame-time (rAF timestamp) delta: the transition samples at the frame time, not at the callback
      if (allowed > 0 && Math.abs(s[k].foldH - s[k - 1].foldH) > 0.01) ratio = Math.max(ratio, Math.abs(s[k].foldH - s[k - 1].foldH) / allowed);
    }
    const firstMove = s.find((x) => Math.abs(x.foldH - s[0].foldH) > 0.5);
    const settle = s.find((x) => Math.abs(x.foldH - hFinal) < 0.5 && x.t >= (firstMove?.t ?? 0));
    const inter = s.filter((x) => x.foldH > 0.5 && x.foldH < hFinal - 0.5).length;
    const win = s.filter((x) => x.t > post.tPress && x.t <= post.tPress + 650);
    Object.assign(row, {
      tShot: +tShot.toFixed(0), dVis, dRef, visFrac: dRef ? +(dVis / dRef).toFixed(3) : null,
      dlBottomAboveVerbs: +(post.verbsRowTop - post.dl.t - post.dl.h).toFixed(2),
      stDelta: +(post.st - pre.st).toFixed(2), siv: post.siv, maxScroll: [pre.sh - pre.ch, post.sh - post.ch],
      verbsMaxDelta: +Math.max(...s.map((x) => x.dv)).toFixed(2),
      trace: { hFinal: +hFinal.toFixed(2), firstMoveMs: firstMove ? +(firstMove.t - post.tPress).toFixed(1) : null, settleMs: settle ? +(settle.t - post.tPress).toFixed(1) : null, intermediateFrames: inter, maxStepPx: +maxStep.toFixed(2), reversalPx: +reversal.toFixed(2), stepRatioVsCurvePeak: +ratio.toFixed(2), topFirst: +tops[0].toFixed(2), topLast: +tops.at(-1).toFixed(2) },
      frames650: { n: win.length, over16_7: win.filter((x) => x.dt > 17.5).length, over25: win.filter((x) => x.dt > 25).length, max: +Math.max(...win.map((x) => x.dt)).toFixed(1) },
      barH: [pre.barH, post.barH], spb: [pre.spb, post.spb], bar: [pre.bar.h, post.bar.h],
      contentBand: { closed: +(pre.ch - pre.bar.h).toFixed(2), open: +(post.ch - post.bar.h).toFixed(2) },
      expanded: post.expanded,
    });
    if (start === 'top' && mode === 'mouse') {
      // re-scroll to the top pose for the leak reading (base's scroll may have moved)
      await page.evaluate(() => { document.querySelector('.controls-card').scrollTop = 0; });
      await page.waitForTimeout(200);
      row.flank = { closed: flankClosed, open: await flankInk(page) };
      // G8: CSS borders inside the strip
      row.borders = await page.evaluate(() => [...document.querySelectorAll('.action-bar *')].filter((e) => { const cs = getComputedStyle(e); return cs.display !== 'none' && ['Top', 'Right', 'Bottom', 'Left'].some((s) => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none'); }).map((e) => { const cs = getComputedStyle(e); return `${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]} ${cs.borderTopWidth}`; }));
      // G5: Tab walk over the card body with the crib open; then the publisher blinded
      const walk = async () => page.evaluate(async () => {
        const c = document.querySelector('.controls-card'); const bar = document.querySelector('.action-bar');
        c.scrollTop = 0; await new Promise((r) => setTimeout(r, 100));
        const foc = [...c.querySelectorAll('button, [href], input, select, [tabindex]:not([tabindex="-1"])')].filter((e) => !bar.contains(e) && e.offsetParent !== null && !e.closest('[inert]') && getComputedStyle(e).visibility !== 'hidden');
        let hidden = 0; const names = [];
        for (const e of foc) { e.focus(); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); const r = e.getBoundingClientRect(); if (r.bottom - bar.getBoundingClientRect().top > 0.5) { hidden++; names.push((e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 16)); } }
        return { n: foc.length, occluded: hidden, names: names.slice(0, 6), spb: getComputedStyle(c).scrollPaddingBottom };
      });
      row.tab = await walk();
      await page.addStyleTag({ content: `.controls-card { scroll-padding-bottom: ${pre.barH || '0px'} !important; }` });
      row.tabBlinded = await walk();
    }
  } catch (e) { row.err = String(e).slice(0, 300); }
  out.push(row);
  await ctx.close();
}
await browser.close();
writeFileSync(outFile, JSON.stringify(out, null, 1));
console.log('wrote', outFile, out.length, 'rows', out.filter((r) => r.err).length, 'errors');
