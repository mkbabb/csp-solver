// c2 — amended drawer gate: b4's six criteria rerun on the S5/S3' recut, plus
// gate rows 7 (horizontal-from-under vector + z-under emergence, DPR2) and
// 8 (zero overshoot, monotone relative motion, every mover on the recorded curve,
// one shared clock). Run from web/frontend against :3001.
import { chromium } from 'file:///Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.dirname(new URL(import.meta.url).pathname);
const URL_ = 'http://localhost:3001/?size=3&difficulty=EASY';
const CURVE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const results = { curve: CURVE, glideMs: 520 };

async function load(page) {
  await page.goto(URL_);
  await page.waitForSelector('svg.handwritten-logo', { timeout: 20000 });
  await page.waitForFunction(
    () => document.querySelectorAll('.sudoku-cell .glyph-svg').length > 0,
    null, { timeout: 20000 },
  );
  await page.waitForTimeout(1000);
}

const SAMPLER = `
(async (durMs) => {
  const host = document.querySelector('.board-peek-host');
  const rail = document.querySelector('#controls-drawer');
  const board = document.querySelector('.board-wrapper');
  const tab = document.querySelector('.drawer-tab');
  const mast = document.querySelector('.masthead');
  const grab = (t, tag) => {
    const hr = host.getBoundingClientRect();
    const rr = rail.getBoundingClientRect();
    const br = board.getBoundingClientRect();
    const tr = tab.getBoundingClientRect();
    const anims = [host, rail, tab, mast].map((el) => {
      const a = el.getAnimations().find((x) => x.effect instanceof KeyframeEffect);
      return a ? { easing: a.effect.getTiming().easing, startTime: a.startTime } : null;
    });
    return {
      t, tag,
      host: { l: hr.left, t: hr.top, r: hr.right, w: hr.width },
      rail: { l: rr.left, t: rr.top, r: rr.right, b: rr.bottom, w: rr.width },
      board: { l: br.left, t: br.top, r: br.right, b: br.bottom },
      tab: { w: tr.width },
      hostTf: getComputedStyle(host).transform,
      railTf: getComputedStyle(rail).transform,
      anims,
      boardW: board.offsetWidth,
      gesturing: document.documentElement.classList.contains('drawer-gesturing'),
      closed: document.documentElement.classList.contains('drawer-closed'),
      ariaExpanded: tab.getAttribute('aria-expanded'),
    };
  };
  const out = [grab(-1, 'pre')];
  const t0 = performance.now();
  tab.click();
  out.push(grab(performance.now() - t0, 'sync'));
  await new Promise((res) => {
    function tick() {
      const t = performance.now() - t0;
      out.push(grab(t, 'raf'));
      if (t < durMs) requestAnimationFrame(tick); else res();
    }
    requestAnimationFrame(tick);
  });
  return out;
})`;

const mat = (tf) => {
  if (!tf || tf === 'none') return { tx: 0, ty: 0, sx: 1 };
  const m = tf.match(/matrix\(([^)]+)\)/);
  if (!m) return { tx: 0, ty: 0, sx: 1 };
  const p = m[1].split(',').map(Number);
  return { tx: p[4], ty: p[5], sx: p[0] };
};

function analyze(samples, dir) {
  const pre = samples[0];
  const frames = samples.filter((s) => s.tag === 'raf');
  const f1 = frames[0];
  const settled = frames[frames.length - 1];
  const c1FrameJump = Math.hypot(f1.rail.l - pre.rail.l, f1.rail.t - pre.rail.t);
  let maxStep = 0;
  for (let i = 1; i < frames.length; i++) {
    maxStep = Math.max(maxStep, Math.hypot(
      frames[i].rail.l - frames[i - 1].rail.l, frames[i].rail.t - frames[i - 1].rail.t));
  }
  // C2 — one solid: normalized transform progress host vs rail per frame.
  const h0 = mat(f1.hostTf), r0 = mat(f1.railTf);
  let maxProgGap = 0;
  for (const f of frames.filter((x) => x.gesturing && x.t < 500)) {
    if (Math.abs(h0.tx) < 5 || Math.abs(r0.tx) < 5) continue;
    maxProgGap = Math.max(maxProgGap,
      Math.abs((1 - mat(f.hostTf).tx / h0.tx) - (1 - mat(f.railTf).tx / r0.tx)));
  }
  // C5 — onset.
  let firstMotionFrame = -1;
  for (let i = 0; i < frames.length; i++) {
    const dh = Math.hypot(frames[i].host.l - pre.host.l, frames[i].host.t - pre.host.t);
    const dr = Math.hypot(frames[i].rail.l - pre.rail.l, frames[i].rail.t - pre.rail.t);
    if (dh > 0.5 || dr > 0.5) { firstMotionFrame = i + 1; break; }
  }
  // Row 7 — geometry: rail never above board top; vector horizontal (relative
  // vertical drift vs the board's own center drift); no-peek invariant.
  const railAboveBoard = frames.filter((f) => f.rail.t < f.board.t - 0.5).length;
  const boardCy = (f) => (f.board.t + f.board.b) / 2;
  const relDrift = Math.abs((settled.rail.t - pre.rail.t) - (boardCy(settled) - boardCy(pre)));
  const minLeftCover = Math.min(...frames.map((f) => f.rail.l - f.host.l));
  // Row 8 — monotone relative motion + zero overshoot past the settled pose.
  let monotone = true, maxOvershootPx = 0;
  const sgn = Math.sign(settled.rail.l - f1.rail.l) || 1;
  for (let i = 1; i < frames.length; i++) {
    const d = (frames[i].rail.l - frames[i - 1].rail.l) * sgn;
    if (d < -0.5) monotone = false;
    const past = (frames[i].rail.l - settled.rail.l) * sgn;
    if (past > 0.5) maxOvershootPx = Math.max(maxOvershootPx, past);
  }
  // Row 8 — every mover on the recorded curve, one shared clock.
  const mid = frames.filter((f) => f.gesturing && f.t > 30 && f.t < 400);
  const easings = new Set(), clocks = new Set();
  let moversSeen = 0;
  for (const f of mid) {
    const live = f.anims.filter(Boolean);
    moversSeen = Math.max(moversSeen, live.length);
    for (const a of live) { easings.add(a.easing); clocks.add(a.startTime); }
  }
  const widths = [...new Set(samples.map((s) => s.boardW))];
  const tabWs = frames.map((f) => f.tab.w);
  return {
    dir,
    c1: { frame1JumpPx: +c1FrameJump.toFixed(2), maxInterFrameStepPx: +maxStep.toFixed(2),
      railPaintedTopMin: +Math.min(...frames.map((f) => f.rail.t)).toFixed(1),
      railPaintedTopMax: +Math.max(...frames.map((f) => f.rail.t)).toFixed(1) },
    c2: { maxNormalizedProgressGap: +maxProgGap.toFixed(4) },
    c5: { firstMotionFrame },
    row7: { framesRailAboveBoardTop: railAboveBoard,
      railRelativeVerticalDriftPx: +relDrift.toFixed(2),
      minRailLeftMinusHostLeftPx: +minLeftCover.toFixed(1) },
    row8: { monotoneRelativeMotion: monotone, maxOvershootPastTuckPx: +maxOvershootPx.toFixed(2),
      moversOnOneCurve: [...easings], moversSeenMidGlide: moversSeen,
      distinctStartTimes: clocks.size },
    layout: { distinctBoardWidths: widths, flippedInClickTask: samples[1].boardW !== pre.boardW },
    ariaAtClick: samples[1].ariaExpanded,
    tabApparentW: { min: +Math.min(...tabWs).toFixed(2), max: +Math.max(...tabWs).toFixed(2) },
    frames: frames.length,
  };
}

const browser = await chromium.launch();

// ── Run 1: trace + close/open samplers (C1, C2, C3, C5, rows 7/8) ──────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem('csp-drawer-open', '1'));
  const page = await ctx.newPage();
  await load(page);

  await browser.startTracing(page, {
    path: path.join(OUT, 'c2-trace.json'),
    categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline'],
  });
  const closeSamples = await page.evaluate(`${SAMPLER}(950)`);
  await page.waitForTimeout(300);
  const openSamples = await page.evaluate(`${SAMPLER}(950)`);
  await page.waitForTimeout(300);
  await browser.stopTracing();

  results.close = analyze(closeSamples, 'close');
  results.open = analyze(openSamples, 'open');
  fs.writeFileSync(path.join(OUT, 'c2-samples.json'),
    JSON.stringify({ closeSamples, openSamples }, null, 1));

  const trace = JSON.parse(fs.readFileSync(path.join(OUT, 'c2-trace.json'), 'utf8'));
  const layouts = trace.traceEvents.filter((e) => e.name === 'Layout' && e.dur && e.dur > 5000);
  results.c3 = { layoutsOver5msInTwoGestures: layouts.length,
    layoutDursMs: layouts.map((e) => +(e.dur / 1000).toFixed(1)) };

  // S4 — reversal at 200ms.
  const reclick = await page.evaluate(`
  (async () => {
    const rail = document.querySelector('#controls-drawer');
    const board = document.querySelector('.board-wrapper');
    const tab = document.querySelector('.drawer-tab');
    const out = [];
    const t0 = performance.now();
    tab.click();
    setTimeout(() => tab.click(), 200);
    await new Promise((res) => {
      function tick() {
        const t = performance.now() - t0;
        const rr = rail.getBoundingClientRect();
        out.push({ t, railL: rr.left, railT: rr.top, boardW: board.offsetWidth,
          gesturing: document.documentElement.classList.contains('drawer-gesturing'),
          closed: document.documentElement.classList.contains('drawer-closed'),
          aria: tab.getAttribute('aria-expanded') });
        if (t < 1500) requestAnimationFrame(tick); else res();
      }
      requestAnimationFrame(tick);
    });
    return out;
  })()`);
  let maxRevStep = 0;
  for (let i = 1; i < reclick.length; i++) {
    maxRevStep = Math.max(maxRevStep, Math.hypot(
      reclick[i].railL - reclick[i - 1].railL, reclick[i].railT - reclick[i - 1].railT));
  }
  const last = reclick[reclick.length - 1];
  const reflip = reclick.find((f, i) => i > 0 && f.closed !== reclick[i - 1].closed && !f.closed);
  results.s4 = { maxInterFrameStepPx: +maxRevStep.toFixed(2),
    settledOpen: !last.closed && !last.gesturing && last.aria === 'true',
    layoutReflippedAtMs: reflip ? +reflip.t.toFixed(0) : null };
  fs.writeFileSync(path.join(OUT, 'c2-reclick-samples.json'), JSON.stringify(reclick, null, 1));

  // A11y.
  await page.waitForTimeout(900);
  results.a11y = await page.evaluate(() => ({
    focusInDrawer: !!document.activeElement?.closest('#controls-drawer'),
    open: !document.documentElement.classList.contains('drawer-closed'),
  }));
  await page.evaluate(() => document.querySelector('.drawer-tab').click());
  await page.waitForTimeout(950);
  results.a11yClosedIdle = await page.evaluate(() => ({
    railInert: document.querySelector('#controls-drawer').hasAttribute('inert'),
    railHidden: getComputedStyle(document.querySelector('#controls-drawer')).visibility === 'hidden',
    parkedTranslate: getComputedStyle(document.querySelector('#controls-drawer')).translate,
  }));
  await ctx.close();
}

// ── Run 2: DPR2 — C4 settle crispness + row-7 emergence frames + z-under ──
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('csp-drawer-open', '0'));
  const page = await ctx.newPage();
  await load(page);

  // Row 7 — z-under emergence on OPEN: per-frame, where rail ∩ host overlap is
  // nonempty, elementFromPoint at the overlap's center must NOT be the rail's
  // subtree (the sheet covers the emerging case).
  results.row7zUnder = await page.evaluate(async () => {
    const host = document.querySelector('.board-peek-host');
    const rail = document.querySelector('#controls-drawer');
    const tab = document.querySelector('.drawer-tab');
    const hits = [];
    const t0 = performance.now();
    tab.click(); // open
    await new Promise((res) => {
      (function tick() {
        const t = performance.now() - t0;
        const hr = host.getBoundingClientRect();
        const rr = rail.getBoundingClientRect();
        const l = Math.max(hr.left, rr.left), r = Math.min(hr.right, rr.right);
        const tp = Math.max(hr.top, rr.top), b = Math.min(hr.bottom, rr.bottom);
        if (r - l > 8 && b - tp > 8) {
          const el = document.elementFromPoint((l + r) / 2, (tp + b) / 2);
          hits.push({ t: +t.toFixed(0), overlapW: +(r - l).toFixed(0),
            hitInRail: !!el?.closest('#controls-drawer'),
            hitInHost: !!el?.closest('.board-peek-host') });
        }
        if (t < 600) requestAnimationFrame(tick); else res();
      })();
    });
    return { overlapFrames: hits.length,
      framesHittingRail: hits.filter((h) => h.hitInRail).length,
      framesHittingHost: hits.filter((h) => h.hitInHost).length,
      sample: hits.slice(0, 4) };
  });
  await page.waitForFunction(() => !document.documentElement.classList.contains('drawer-gesturing'), null, { timeout: 3000 });
  await page.waitForTimeout(300);

  // Emergence frame strip at DPR2 (fresh gesture per shot): close it, then open.
  await page.evaluate(() => document.querySelector('.drawer-tab').click());
  await page.waitForFunction(() => !document.documentElement.classList.contains('drawer-gesturing'), null, { timeout: 3000 });
  await page.waitForTimeout(300);
  for (const ms of [70, 150, 280]) {
    await page.evaluate(() => document.querySelector('.drawer-tab').click()); // open
    await page.waitForTimeout(ms);
    await page.screenshot({ path: path.join(OUT, `c2-emerge-open-${ms}-dpr2.png`),
      clip: { x: 700, y: 120, width: 740, height: 680 } });
    await page.waitForFunction(() => !document.documentElement.classList.contains('drawer-gesturing'), null, { timeout: 3000 });
    await page.evaluate(() => document.querySelector('.drawer-tab').click()); // re-close
    await page.waitForFunction(() => !document.documentElement.classList.contains('drawer-gesturing'), null, { timeout: 3000 });
    await page.waitForTimeout(150);
  }

  // C4 — settle crispness, both directions (PRM engage freezes the boil; let the
  // toggle-stack crossfade settle 600ms before shot A — the g2 forensics note).
  await page.evaluate(() => document.querySelector('.drawer-tab').click()); // open
  await page.waitForFunction(() => !document.documentElement.classList.contains('drawer-gesturing'), null, { timeout: 3000 });
  await page.waitForTimeout(300);
  for (const dir of ['close', 'open']) {
    await page.evaluate(() => document.querySelector('.drawer-tab').click());
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, `c2-midglide-${dir}-dpr2.png`) });
    await page.waitForFunction(() => !document.documentElement.classList.contains('drawer-gesturing'), null, { timeout: 3000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(600);
    const shotA = await page.screenshot({ path: path.join(OUT, `c2-settle-${dir}-plus1-dpr2.png`) });
    await page.evaluate(() => new Promise((r) => {
      let n = 0; (function tick() { if (++n >= 29) r(); else requestAnimationFrame(tick); })();
    }));
    const shotB = await page.screenshot({ path: path.join(OUT, `c2-settle-${dir}-plus30-dpr2.png`) });
    results[`c4_${dir}`] = { byteIdentical: shotA.equals(shotB) };
    await page.emulateMedia({ reducedMotion: null });
    await page.waitForTimeout(400);
  }
  await ctx.close();
}

// ── Run 3: PRM parity (C6) ────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem('csp-drawer-open', '1'));
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await load(page);
  results.prm = await page.evaluate(() => {
    const board = document.querySelector('.board-wrapper');
    const before = board.offsetWidth;
    document.querySelector('.drawer-tab').click();
    return {
      sameTaskClosed: document.documentElement.classList.contains('drawer-closed'),
      sameTaskGesturing: document.documentElement.classList.contains('drawer-gesturing'),
      sameTaskAnimations: document.querySelector('#controls-drawer').getAnimations().length,
      boardGrewPx: board.offsetWidth - before,
    };
  });
  await ctx.close();
}

await browser.close();
fs.writeFileSync(path.join(OUT, 'c2-gate-results.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
