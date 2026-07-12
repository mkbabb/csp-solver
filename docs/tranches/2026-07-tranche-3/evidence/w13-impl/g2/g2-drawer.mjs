// T3-W13 §3 drawer gate probe — b4's six acceptance criteria + the S3 mid-glide
// trace + S4 reversal, driven headless at 1440×900 against the live dev server.
// Run: node probe-drawer.mjs   (from web/frontend so playwright resolves)
import { chromium } from 'file:///Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.dirname(new URL(import.meta.url).pathname);
const URL_ = 'http://localhost:3001/?size=3&difficulty=EASY';
const results = {};

async function load(page) {
  await page.goto(URL_);
  await page.waitForSelector('svg.handwritten-logo', { timeout: 20000 });
  await page.waitForFunction(
    () => document.querySelectorAll('.sudoku-cell .glyph-svg').length > 0,
    null,
    { timeout: 20000 },
  );
  await page.waitForTimeout(1000); // reveal wave settles
}

// In-page rAF sampler across one gesture (click fired inside, pre-click sample kept).
const SAMPLER = `
(async (durMs) => {
  const host = document.querySelector('.board-peek-host');
  const rail = document.querySelector('#controls-drawer');
  const board = document.querySelector('.board-wrapper');
  const tab = document.querySelector('.drawer-tab');
  const grab = (t, tag) => {
    const hr = host.getBoundingClientRect();
    const rr = rail.getBoundingClientRect();
    const tr = tab.getBoundingClientRect();
    return {
      t, tag,
      host: { l: hr.left, t: hr.top, r: hr.right, w: hr.width },
      rail: { l: rr.left, t: rr.top, r: rr.right, w: rr.width },
      tab:  { l: tr.left, t: tr.top, w: tr.width, h: tr.height },
      hostTf: getComputedStyle(host).transform,
      railTf: getComputedStyle(rail).transform,
      railTr: getComputedStyle(rail).translate,
      boardW: board.offsetWidth,
      gesturing: document.documentElement.classList.contains('drawer-gesturing'),
      closed: document.documentElement.classList.contains('drawer-closed'),
      ariaExpanded: tab.getAttribute('aria-expanded'),
    };
  };
  const out = [grab(-1, 'pre')];
  const t0 = performance.now();
  tab.click();
  out.push(grab(performance.now() - t0, 'sync')); // same-task, post-click
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
  // C1 — no teleport: first painted frame's rail rect vs pre-click painted rect.
  // (The rail's PAINTED position must be continuous even though layout flipped.)
  const c1FrameJump = Math.hypot(f1.rail.l - pre.rail.l, f1.rail.t - pre.rail.t);
  let maxStep = 0;
  for (let i = 1; i < frames.length; i++) {
    const d = Math.hypot(
      frames[i].rail.l - frames[i - 1].rail.l,
      frames[i].rail.t - frames[i - 1].rail.t,
    );
    maxStep = Math.max(maxStep, d);
  }
  const tops = frames.map((f) => f.rail.t);
  // C2 — one solid: normalized transform progress, host vs rail, per frame.
  const h0 = mat(f1.hostTf), r0 = mat(f1.railTf);
  let maxProgGap = 0;
  const active = frames.filter((f) => f.gesturing && f.t < 470);
  for (const f of active) {
    const h = mat(f.hostTf), r = mat(f.railTf);
    if (Math.abs(h0.tx) < 5 || Math.abs(r0.tx) < 5) continue;
    const ph = 1 - h.tx / h0.tx;
    const pr = 1 - r.tx / r0.tx;
    maxProgGap = Math.max(maxProgGap, Math.abs(ph - pr));
  }
  // C5 — onset: first frame index where painted motion appeared (host or rail
  // moved ≥0.5px from its first-frame painted pose... vs PRE-click pose).
  let firstMotionFrame = -1;
  for (let i = 0; i < frames.length; i++) {
    const dh = Math.hypot(frames[i].host.l - pre.host.l, frames[i].host.t - pre.host.t);
    const dr = Math.hypot(frames[i].rail.l - pre.rail.l, frames[i].rail.t - pre.rail.t);
    if (dh > 0.5 || dr > 0.5) { firstMotionFrame = i + 1; break; }
  }
  // S3 — the case never peeks past the sheet's far (left) edge; also record the
  // overshoot excursion (rail progress > 1 region).
  let minLeftCover = Infinity, maxOvershootPx = 0;
  for (const f of frames) {
    minLeftCover = Math.min(minLeftCover, f.rail.l - f.host.l);
    if (Math.abs(r0.tx) > 5) {
      const pr = 1 - mat(f.railTf).tx / r0.tx;
      if (pr > 1) maxOvershootPx = Math.max(maxOvershootPx, (pr - 1) * Math.abs(r0.tx));
    }
  }
  // Layout truth: board width flips once at onset, never again (classic FLIP).
  const widths = [...new Set(samples.map((s) => s.boardW))];
  const syncFlipped = samples[1].boardW !== pre.boardW;
  // Tab counter-scale: apparent tab width excursion across the glide.
  const tabWs = frames.map((f) => f.tab.w);
  return {
    dir,
    c1: {
      frame1JumpPx: +c1FrameJump.toFixed(2),
      maxInterFrameStepPx: +maxStep.toFixed(2),
      railPaintedTopMin: +Math.min(...tops).toFixed(1),
      railPaintedTopMax: +Math.max(...tops).toFixed(1),
    },
    c2: { maxNormalizedProgressGap: +maxProgGap.toFixed(4) },
    c5: { firstMotionFrame },
    s3: {
      minRailLeftMinusHostLeftPx: +minLeftCover.toFixed(1),
      maxOvershootPastTuckPx: +maxOvershootPx.toFixed(1),
    },
    layout: { distinctBoardWidths: widths, flippedInClickTask: syncFlipped },
    ariaAtClick: samples[1].ariaExpanded,
    tabApparentW: { min: +Math.min(...tabWs).toFixed(2), max: +Math.max(...tabWs).toFixed(2) },
    frames: frames.length,
  };
}

const browser = await chromium.launch();

// ── Run 1: perf trace + close/open samplers (C1, C2, C3, C5, S3) ──────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem('csp-drawer-open', '1'));
  const page = await ctx.newPage();
  await load(page);

  await browser.startTracing(page, {
    path: path.join(OUT, 'drawer-trace.json'),
    categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline'],
  });
  const closeSamples = await page.evaluate(`${SAMPLER}(900)`);
  await page.waitForTimeout(300);
  const openSamples = await page.evaluate(`${SAMPLER}(900)`);
  await page.waitForTimeout(300);
  await browser.stopTracing();

  results.close = analyze(closeSamples, 'close');
  results.open = analyze(openSamples, 'open');
  fs.writeFileSync(path.join(OUT, 'drawer-samples.json'), JSON.stringify({ closeSamples, openSamples }, null, 1));

  // C3 — Layout events >5ms across the traced window (two gestures → expect 2).
  const trace = JSON.parse(fs.readFileSync(path.join(OUT, 'drawer-trace.json'), 'utf8'));
  const layouts = trace.traceEvents.filter(
    (e) => e.name === 'Layout' && e.dur && e.dur > 5000,
  );
  const allLayouts = trace.traceEvents.filter((e) => e.name === 'Layout' && e.dur);
  results.c3 = {
    layoutsOver5msInTwoGestures: layouts.length,
    layoutDursMs: layouts.map((e) => +(e.dur / 1000).toFixed(1)),
    allLayoutCount: allLayouts.length,
  };

  // S4 — mid-glide re-click reversal: close, re-click at ~200ms, sample through.
  const reclick = await page.evaluate(`
  (async () => {
    const host = document.querySelector('.board-peek-host');
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
        const hr = host.getBoundingClientRect();
        out.push({ t, railL: rr.left, railT: rr.top, hostL: hr.left, boardW: board.offsetWidth,
          gesturing: document.documentElement.classList.contains('drawer-gesturing'),
          closed: document.documentElement.classList.contains('drawer-closed'),
          aria: tab.getAttribute('aria-expanded') });
        if (t < 1400) requestAnimationFrame(tick); else res();
      }
      requestAnimationFrame(tick);
    });
    return out;
  })()`);
  let maxRevStep = 0, prevF = null;
  for (const f of reclick) {
    if (prevF) maxRevStep = Math.max(maxRevStep, Math.hypot(f.railL - prevF.railL, f.railT - prevF.railT));
    prevF = f;
  }
  const last = reclick[reclick.length - 1];
  const reflipAt = reclick.find((f, i) => i > 0 && f.closed !== reclick[i - 1].closed && !f.closed);
  results.s4 = {
    maxInterFrameStepPx: +maxRevStep.toFixed(2),
    settledOpen: !last.closed && !last.gesturing && last.aria === 'true',
    finalBoardW: last.boardW,
    layoutReflippedAtMs: reflipAt ? +reflipAt.t.toFixed(0) : null,
  };
  fs.writeFileSync(path.join(OUT, 'drawer-reclick-samples.json'), JSON.stringify(reclick, null, 1));

  // A11y at open settle: focus inside the drawer.
  await page.waitForTimeout(800);
  results.a11y = await page.evaluate(() => ({
    focusInDrawer: !!document.activeElement?.closest('#controls-drawer'),
    railInert: document.querySelector('#controls-drawer').hasAttribute('inert'),
    open: !document.documentElement.classList.contains('drawer-closed'),
  }));
  // Closed-idle inert:
  await page.evaluate(() => document.querySelector('.drawer-tab').click());
  await page.waitForTimeout(900);
  results.a11yClosedIdle = await page.evaluate(() => ({
    railInert: document.querySelector('#controls-drawer').hasAttribute('inert'),
    railHidden: getComputedStyle(document.querySelector('#controls-drawer')).visibility === 'hidden',
    parkedTranslate: getComputedStyle(document.querySelector('#controls-drawer')).translate,
  }));
  await ctx.close();
}

// ── Run 2: DPR2 — C4 settle crispness + mid-glide screenshot ──────────
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await ctx.addInitScript(() => localStorage.setItem('csp-drawer-open', '1'));
  const page = await ctx.newPage();
  await load(page);

  for (const dir of ['close', 'open']) {
    await page.evaluate(() => document.querySelector('.drawer-tab').click());
    // Mid-glide DPR2 frame at the overshoot crest (~330ms).
    await page.waitForTimeout(320);
    await page.screenshot({ path: path.join(OUT, `midglide-${dir}-dpr2.png`) });
    await page.waitForFunction(
      () => !document.documentElement.classList.contains('drawer-gesturing'),
      null, { timeout: 3000 },
    );
    // Freeze the (still-shipped) perpetual boil so the diff isolates settle work:
    // PRM engage force-clears every scheduler subscriber in place.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const shotA = await page.screenshot({ path: path.join(OUT, `settle-${dir}-plus1-dpr2.png`) });
    await page.evaluate(() => new Promise((r) => {
      let n = 0; (function tick() { if (++n >= 29) r(); else requestAnimationFrame(tick); })();
    }));
    const shotB = await page.screenshot({ path: path.join(OUT, `settle-${dir}-plus30-dpr2.png`) });
    // Pixel diff in-page via canvas.
    const diff = await page.evaluate(
      async ([a, b]) => {
        const im = (b64) => new Promise((res) => {
          const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + b64;
        });
        const [ia, ib] = await Promise.all([im(a), im(b)]);
        const c = document.createElement('canvas');
        c.width = ia.width; c.height = ia.height;
        const g = c.getContext('2d', { willReadFrequently: true });
        g.drawImage(ia, 0, 0);
        const da = g.getImageData(0, 0, c.width, c.height).data;
        g.clearRect(0, 0, c.width, c.height);
        g.drawImage(ib, 0, 0);
        const db = g.getImageData(0, 0, c.width, c.height).data;
        let diffPx = 0, maxD = 0;
        for (let i = 0; i < da.length; i += 4) {
          const d = Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]);
          if (d > 6) diffPx++;
          if (d > maxD) maxD = d;
        }
        return { totalPx: da.length / 4, diffPx, maxChannelSumDelta: maxD };
      },
      [shotA.toString('base64'), shotB.toString('base64')],
    );
    results[`c4_${dir}`] = { ...diff, byteIdentical: shotA.equals(shotB) };
    await page.emulateMedia({ reducedMotion: null });
    await page.waitForTimeout(400);
  }
  await ctx.close();
}

// ── Run 3: PRM parity (C6) ─────────────────────────────────────────────
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
fs.writeFileSync(path.join(OUT, 'drawer-gate-results.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
