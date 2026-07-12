// T3-W13 GATE g2 — toggle-crisp + toggle-storybook rows, first-party.
// DPR2, 1440x900, headless --enable-gpu, drives :3001 (owner tabs untouched).
// Crisp: static A/B (promoted vs unpromoted) at warp 1.09 / 0.3 + CSS plush flex,
//        b2 probe2 recipe adapted to the warp architecture, under PRM (frozen poses).
// Storybook: full-gesture rAF sampler (beat table), rAF-gap frame-time analysis,
//        CDP trace (shipped vs filter-none attribution control), retarget, PRM.
import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
import fs from 'fs';
const { chromium } = pw;
const OUT =
  '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13-impl/g2';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = {};

const browser = await chromium.launch({ headless: true, args: ['--enable-gpu'] });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
await sleep(1500);

// force light start
await page.evaluate(() => {
  if (document.documentElement.classList.contains('dark'))
    document.querySelector('.sun-moon-toggle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
});
await sleep(1600);

const box = await page.$eval('.sun-moon-toggle', (el) => {
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
});
const clip = { x: box.x - 20, y: box.y - 20, width: box.w + 40, height: box.h + 40 };
const edgeClip = { x: box.x + 30, y: box.y + 30, width: 150, height: 150 };
results.toggleBox = box;

// ── 1. STORYBOOK: full-gesture sampler (light → dark) ────────────────────
const gesture = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const btn = document.querySelector('.sun-moon-toggle');
      const sun = document.querySelector('.toggle-sun');
      const moon = document.querySelector('.toggle-moon');
      const inIcon = moon, outIcon = sun; // light → dark
      const inWarp = moon.querySelector('.warp');
      const outWarp = sun.querySelector('.warp');
      const stars = [...moon.querySelectorAll('.twinkle-star')].slice(0, 3);
      const parse = (m) => {
        if (!m || m === 'none') return { s: 1, r: 0, tx: 0, ty: 0 };
        const p = m.slice(m.indexOf('(') + 1, -1).split(',').map(Number);
        return {
          s: +Math.hypot(p[0], p[1]).toFixed(4),
          r: +((Math.atan2(p[1], p[0]) * 180) / Math.PI).toFixed(2),
          tx: +p[4].toFixed(2),
          ty: +p[5].toFixed(2),
        };
      };
      const preDark = document.documentElement.classList.contains('dark');
      const samples = [];
      const t0 = performance.now();
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      const syncDark = document.documentElement.classList.contains('dark'); // same task
      let turningClearedAt = null;
      function tick() {
        const t = performance.now() - t0;
        const iw = parse(getComputedStyle(inWarp).transform);
        const ow = parse(getComputedStyle(outWarp).transform);
        const iIcon = getComputedStyle(inIcon);
        const oIcon = getComputedStyle(outIcon);
        samples.push({
          t: +t.toFixed(1),
          inS: iw.s, inR: iw.r, inTy: iw.ty,
          outS: ow.s, outR: ow.r, outTy: ow.ty,
          inOp: +parseFloat(iIcon.opacity).toFixed(3),
          outOp: +parseFloat(oIcon.opacity).toFixed(3),
          inIconTf: iIcon.transform === 'none' ? 'none' : parse(iIcon.transform),
          inIconScale: iIcon.scale,
          inIconTranslate: iIcon.translate,
          starS: stars.map((s) => getComputedStyle(s).scale),
          turning: btn.classList.contains('is-turning'),
        });
        if (!btn.classList.contains('is-turning') && turningClearedAt === null && t > 100)
          turningClearedAt = +t.toFixed(0);
        if (t < 1300) requestAnimationFrame(tick);
        else resolve({ preDark, syncDark, firstFrameDark: samples[0] ? document.documentElement.classList.contains('dark') : null, samples, turningClearedAt });
      }
      requestAnimationFrame(tick);
    }),
);
fs.writeFileSync(`${OUT}/g2-gesture-samples.json`, JSON.stringify(gesture, null, 1));
{
  const s = gesture.samples;
  const crest = s.reduce((m, x) => (x.inS > m.inS ? x : m), s[0]);
  const wringDone = s.find((x) => x.outS <= 0.065);
  const covis = s.filter((x) => x.t >= 240 && x.t <= 340).map((x) => ({ t: x.t, inOp: x.inOp, outOp: x.outOp }));
  const stageEmpty = s.filter((x) => x.t < 900 && x.inOp < 0.02 && x.outOp < 0.02);
  const rotMin = Math.min(...s.map((x) => Math.min(x.inR, x.outR)));
  const rotMax = Math.max(...s.map((x) => Math.max(x.inR, x.outR)));
  const iconTx = Math.max(...s.map((x) => (x.inIconTf === 'none' ? 0 : Math.abs(x.inIconTf.tx))));
  // star pop onsets: first t where computed scale rises above 0.25
  const starOnsets = [0, 1, 2].map((i) => {
    const hit = s.find((x) => parseFloat(x.starS[i]) > 0.25);
    return hit ? hit.t : null;
  });
  // plush flex: any frame after 860 where icon CSS scale is anisotropic
  const plush = s.filter((x) => x.t > 860 && x.t < 1020 && x.inIconScale !== 'none' && x.inIconScale !== '1' && x.inIconScale.includes(' '));
  // rAF gap analysis (frame-time, in-page half)
  const deltas = [];
  for (let i = 1; i < s.length; i++) if (s[i].t <= 1050) deltas.push(s[i].t - s[i - 1].t);
  const sorted = [...deltas].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const dropped = deltas.filter((d) => d > median * 1.75);
  results.storybook = {
    themeFlip: { preDark: gesture.preDark, syncDark: gesture.syncDark, flippedSameTask: gesture.syncDark !== gesture.preDark },
    wringDownCompleteAt: wringDone ? wringDone.t : null,
    crest: { t: crest.t, scale: crest.inS },
    coVisible240_340: covis.every((c) => c.inOp > 0.02 && c.outOp > 0.02),
    coVisibleSamples: covis.slice(0, 4),
    stageEmptyFrames: stageEmpty.length,
    turningClearedAt: gesture.turningClearedAt,
    rotRangeDeg: [rotMin, rotMax],
    maxIconTranslateXPx: iconTx,
    starPopOnsets: starOnsets,
    plushFlexFrames: plush.length,
    plushSample: plush[0] ?? null,
    raf: { frames: deltas.length, medianMs: +median.toFixed(2), maxGapMs: +Math.max(...deltas).toFixed(2), gapsOver1_75x: dropped.length, gapList: dropped.map((d) => +d.toFixed(1)) },
  };
}
// settle dark, then back to light
await sleep(800);
await page.locator('.sun-moon-toggle').dispatchEvent('click');
await sleep(1600);

// ── 2. FRAME-TIME TRACE (CDP) — shipped, then filter-none attribution control ──
async function traceGesture(name, injectCss) {
  if (injectCss)
    await page.evaluate((css) => {
      const s = document.createElement('style');
      s.id = 'g2-attr';
      s.textContent = css;
      document.head.appendChild(s);
    }, injectCss);
  await browser.startTracing(page, {
    path: `${OUT}/g2-toggle-trace-${name}.json`,
    categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.frame'],
  });
  const raf = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const btn = document.querySelector('.sun-moon-toggle');
        const ts = [];
        const t0 = performance.now();
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        function tick() {
          const t = performance.now() - t0;
          ts.push(+t.toFixed(1));
          if (t < 1100) requestAnimationFrame(tick);
          else resolve(ts);
        }
        requestAnimationFrame(tick);
      }),
  );
  await sleep(300);
  await browser.stopTracing();
  await page.evaluate(() => document.getElementById('g2-attr')?.remove());
  // parse trace
  const trace = JSON.parse(fs.readFileSync(`${OUT}/g2-toggle-trace-${name}.json`, 'utf8'));
  const ev = trace.traceEvents;
  const paints = ev.filter((e) => e.name === 'Paint' && e.dur);
  const rasters = ev.filter((e) => e.name === 'RasterTask' && e.dur);
  const droppedEv = ev.filter((e) => /DroppedFrame/i.test(e.name));
  const pipeline = ev.filter((e) => e.name === 'PipelineReporter');
  const droppedPipeline = pipeline.filter((e) => {
    const st = e.args?.chrome_frame_reporter?.state || e.args?.data?.state || '';
    return /DROPPED/i.test(JSON.stringify(st));
  });
  const sum = (a) => a.reduce((x, e) => x + e.dur, 0) / 1000;
  const deltas = [];
  for (let i = 1; i < raf.length; i++) if (raf[i] <= 1050) deltas.push(raf[i] - raf[i - 1]);
  const sorted = [...deltas].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const gaps = deltas.filter((d) => d > median * 1.75);
  const r = {
    rafFrames: deltas.length,
    rafMedianMs: +median.toFixed(2),
    rafMaxGapMs: +Math.max(...deltas).toFixed(2),
    rafGapsOver1_75x: gaps.length,
    paintCount: paints.length,
    paintSumMs: +sum(paints).toFixed(1),
    paintMaxMs: +(Math.max(0, ...paints.map((e) => e.dur)) / 1000).toFixed(2),
    rasterCount: rasters.length,
    rasterSumMs: +sum(rasters).toFixed(1),
    rasterMaxMs: +(Math.max(0, ...rasters.map((e) => e.dur)) / 1000).toFixed(2),
    droppedFrameEvents: droppedEv.length,
    pipelineReports: pipeline.length,
    pipelineDropped: droppedPipeline.length,
  };
  // settle + toggle back to light
  await sleep(600);
  await page.locator('.sun-moon-toggle').dispatchEvent('click');
  await sleep(1600);
  return r;
}
results.frameTimeShipped = await traceGesture('shipped', null);
results.frameTimeNoFilter = await traceGesture('nofilter', '.toggle-icon { filter: none !important; }');

// ── 3. Live frame captures: crest / scale-0.3 / plush ────────────────────
async function frameShot(name, tMs, c = clip) {
  await page.locator('.sun-moon-toggle').dispatchEvent('click');
  await sleep(tMs);
  await page.screenshot({ path: `${OUT}/${name}.png`, clip: c });
  await sleep(1400);
  await page.locator('.sun-moon-toggle').dispatchEvent('click');
  await sleep(1400);
}
await frameShot('g2-crest-t560', 560);
await frameShot('g2-crest-edge-t560', 560, edgeClip);
await frameShot('g2-bloom-scale03-t118', 118);
await frameShot('g2-plush-t930', 930);

// ── 4. Mid-flight re-click retarget ──────────────────────────────────────
const retarget = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const btn = document.querySelector('.sun-moon-toggle');
      const moonWarp = document.querySelector('.toggle-moon .warp');
      const sc = (m) => {
        if (m === 'none') return 1;
        const p = m.slice(m.indexOf('(') + 1, -1).split(',').map(Number);
        return Math.hypot(p[0], p[1]);
      };
      const samples = [];
      const t0 = performance.now();
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      let reclicked = false;
      function tick() {
        const t = performance.now() - t0;
        if (t >= 400 && !reclicked) {
          reclicked = true;
          btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
        samples.push({ t: Math.round(t), moonS: +sc(getComputedStyle(moonWarp).transform).toFixed(4) });
        if (t < 1600) requestAnimationFrame(tick);
        else
          resolve({
            samples,
            dark: document.documentElement.classList.contains('dark'),
            turning: btn.classList.contains('is-turning'),
          });
      }
      requestAnimationFrame(tick);
    }),
);
fs.writeFileSync(`${OUT}/g2-retarget-samples.json`, JSON.stringify(retarget, null, 1));
{
  let maxJump = 0, atClick = 0;
  for (let i = 1; i < retarget.samples.length; i++) {
    const d = Math.abs(retarget.samples[i].moonS - retarget.samples[i - 1].moonS);
    if (retarget.samples[i].t > 410 && d > maxJump) maxJump = d;
    if (retarget.samples[i].t > 395 && retarget.samples[i].t < 430) atClick = Math.max(atClick, d);
  }
  results.retarget = { settledDark: retarget.dark, turningCleared: !retarget.turning, maxJumpAfterReclick: +maxJump.toFixed(4), maxJumpAtReclickWindow: +atClick.toFixed(4) };
}
await sleep(1500);

// ── 5. STATIC CRISP A/B (PRM context — frozen poses, deterministic content) ──
const abCtx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
});
const ab = await abCtx.newPage();
await ab.goto('http://localhost:3001', { waitUntil: 'networkidle' });
await sleep(1500);
const abBox = await ab.$eval('.sun-moon-toggle', (el) => {
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
});
const abClip = { x: abBox.x - 10, y: abBox.y - 10, width: abBox.w + 20, height: abBox.h + 20 };

async function abShot(name, wc, extraCss) {
  await ab.evaluate(
    ({ wc, extraCss }) => {
      let s = document.getElementById('g2-ab');
      if (!s) {
        s = document.createElement('style');
        s.id = 'g2-ab';
        document.head.appendChild(s);
      }
      s.textContent = `
        .corner-right { will-change: ${wc} !important; }
        .toggle-rest { visibility: hidden !important; }
        .sun-moon-toggle .toggle-icon.is-active { visibility: visible !important; opacity: 1 !important; }
        ${extraCss}`;
    },
    { wc, extraCss },
  );
  await sleep(500);
  const buf = await ab.screenshot({ path: `${OUT}/${name}.png`, clip: abClip });
  return buf.toString('base64');
}
async function compare(a, b) {
  return ab.evaluate(async ([a, b]) => {
    const im = (b64) =>
      new Promise((res) => {
        const i = new Image();
        i.onload = () => res(i);
        i.src = 'data:image/png;base64,' + b64;
      });
    const [ia, ib] = await Promise.all([im(a), im(b)]);
    const gray = (img) => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      const out = new Float32Array(c.width * c.height);
      for (let i = 0; i < out.length; i++)
        out[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
      return { g: out, w: c.width, h: c.height };
    };
    const energy = ({ g, w, h }) => {
      let e = 0;
      for (let y = 1; y < h - 1; y++)
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x;
          const gx = g[i + 1] - g[i - 1];
          const gy = g[i + w] - g[i - w];
          e += gx * gx + gy * gy;
        }
      return e;
    };
    const ga = gray(ia), gb = gray(ib);
    let mad = 0;
    for (let i = 0; i < ga.g.length; i++) mad += Math.abs(ga.g[i] - gb.g[i]);
    return {
      energyA: Math.round(energy(ga)),
      energyB: Math.round(energy(gb)),
      energyRatio: +(energy(ga) / energy(gb)).toFixed(4),
      meanAbsDiff: +(mad / ga.g.length).toFixed(3),
    };
  }, [a, b]);
}

const scenarios = [
  ['crest1_09', '.sun-moon-toggle .toggle-icon.is-active .warp { transition: none !important; transform: scale(1.09) !important; }'],
  ['warp0_3', '.sun-moon-toggle .toggle-icon.is-active .warp { transition: none !important; transform: scale(0.3) !important; }'],
  ['plushflex', '.sun-moon-toggle .toggle-icon.is-active .warp { transition: none !important; transform: none !important; } .sun-moon-toggle .toggle-icon.is-active { scale: 1.04 0.96 !important; }'],
];
results.crispAB = {};
for (const [name, css] of scenarios) {
  const p = await abShot(`g2-ab-${name}-promoted`, 'transform', css);
  const u = await abShot(`g2-ab-${name}-unpromoted`, 'auto', css);
  results.crispAB[name] = await compare(p, u);
}
await abCtx.close();

// ── 6. PRM parity ─────────────────────────────────────────────────────────
const prmCtx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
});
const prm = await prmCtx.newPage();
await prm.goto('http://localhost:3001', { waitUntil: 'networkidle' });
await sleep(1500);
const prmRest = await prm.evaluate(() => {
  const warp = document.querySelector('.toggle-moon .warp');
  const rests = Array.from(document.querySelectorAll('.toggle-rest')).map((el) => ({
    vis: getComputedStyle(el).visibility,
    op: getComputedStyle(el).opacity,
    transition: getComputedStyle(el).transitionDuration,
  }));
  return { warpTransform: getComputedStyle(warp).transform, rests };
});
await prm.locator('.sun-moon-toggle').dispatchEvent('click');
await sleep(80);
const prmMid = await prm.evaluate(() => ({
  dark: document.documentElement.classList.contains('dark'),
  turning: document.querySelector('.sun-moon-toggle').classList.contains('is-turning'),
  liveVis: Array.from(document.querySelectorAll('.toggle-icon')).map((el) => getComputedStyle(el).visibility),
}));
results.prm = { rest: prmRest, midFlip: prmMid };
await prm.screenshot({ path: `${OUT}/g2-prm-dark.png`, clip });
await prmCtx.close();

await browser.close();
fs.writeFileSync(`${OUT}/g2-toggle-results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
