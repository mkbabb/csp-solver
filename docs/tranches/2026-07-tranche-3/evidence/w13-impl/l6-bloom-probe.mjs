// T3-W13 l6 — Bloom verification probe (DPR2, headless, drives :3001 directly;
// never touches owner tabs). Captures: rest stack, wring/bloom/crest/plush frames,
// warp-scale-0.3 frame, twist checkpoint (-15/-8/0), re-click retarget, PRM parity.
import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
import fs from 'fs';
const { chromium } = pw;
const OUT =
  '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13-impl/l6-captures';
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ headless: true, args: ['--enable-gpu'] });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
await sleep(1200);

// force light start
await page.evaluate(() => {
  if (document.documentElement.classList.contains('dark'))
    document.querySelector('.sun-moon-toggle').dispatchEvent(new MouseEvent('click', { bubbles: true }));
});
await sleep(1500);

const box = await page.$eval('.sun-moon-toggle', (el) => {
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
});
const clip = { x: box.x - 20, y: box.y - 20, width: box.w + 40, height: box.h + 40 };
const edgeClip = { x: box.x + 30, y: box.y + 30, width: 150, height: 150 };
console.log('TOGGLE BOX', JSON.stringify(box));

// ── 0. rest state: stacks hold the stage, live parked ──
const rest = await page.evaluate(() => {
  const vis = (sel) =>
    Array.from(document.querySelectorAll(sel)).map((el) => getComputedStyle(el).visibility);
  const activePoses = Array.from(
    document.querySelectorAll('.toggle-rest.is-active .rest-pose'),
  ).filter((el) => parseFloat(getComputedStyle(el).opacity) > 0);
  const warp = document.querySelector('.toggle-moon .warp');
  return {
    live: vis('.toggle-icon'),
    stacks: vis('.toggle-rest'),
    visiblePoses: activePoses.map((el) => el.getAttribute('filter')),
    parkedWarp: getComputedStyle(warp).transform,
    poseFilterCount: document.querySelectorAll('filter[id^="wobble-celestial-p"]').length,
  };
});
console.log('REST', JSON.stringify(rest, null, 1));
await page.screenshot({ path: `${OUT}/rest-light-stack.png`, clip });
await page.screenshot({ path: `${OUT}/rest-edge.png`, clip: edgeClip });

// ── 1. full-gesture rAF sampler (crest measurement, checkpoint 2) ──
async function sampleGesture() {
  return page.evaluate(
    () =>
      new Promise((resolve) => {
        const btn = document.querySelector('.sun-moon-toggle');
        const wasDark = document.documentElement.classList.contains('dark');
        const incoming = document.querySelector(
          wasDark ? '.toggle-sun .warp' : '.toggle-moon .warp',
        );
        const outgoing = document.querySelector(
          wasDark ? '.toggle-moon .warp' : '.toggle-sun .warp',
        );
        const sc = (m) => {
          if (m === 'none') return 1;
          const [a, b] = m.slice(7, -1).split(',').map(Number);
          return Math.hypot(a, b);
        };
        const rot = (m) => {
          if (m === 'none') return 0;
          const [a, b] = m.slice(7, -1).split(',').map(Number);
          return (Math.atan2(b, a) * 180) / Math.PI;
        };
        const samples = [];
        const t0 = performance.now();
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        function tick() {
          const t = performance.now() - t0;
          const gi = getComputedStyle(incoming).transform;
          const go = getComputedStyle(outgoing).transform;
          samples.push({
            t: Math.round(t),
            inS: +sc(gi).toFixed(4),
            inR: +rot(gi).toFixed(2),
            outS: +sc(go).toFixed(4),
            outR: +rot(go).toFixed(2),
          });
          if (t < 1150) requestAnimationFrame(tick);
          else resolve(samples);
        }
        requestAnimationFrame(tick);
      }),
  );
}
const samples = await sampleGesture(); // light → dark
await sleep(600);
fs.writeFileSync(`${OUT}/gesture-samples.json`, JSON.stringify(samples, null, 1));
const crest = samples.reduce((m, s) => (s.inS > m.inS ? s : m), samples[0]);
const near03 = samples.reduce(
  (m, s) => (Math.abs(s.inS - 0.3) < Math.abs(m.inS - 0.3) ? s : m),
  samples[0],
);
const wringEnd = samples.filter((s) => s.t >= 330 && s.t <= 360)[0];
console.log('CREST', JSON.stringify(crest), 'NEAR-0.3', JSON.stringify(near03));
console.log('WRING-END(~340ms)', JSON.stringify(wringEnd));

// back to light
await page.locator('.sun-moon-toggle').dispatchEvent('click');
await sleep(1500);

// ── 2. timed frame captures — one gesture per capture (deterministic transitions) ──
async function frameShot(name, tMs, c = clip) {
  await page.locator('.sun-moon-toggle').dispatchEvent('click');
  await sleep(tMs);
  await page.screenshot({ path: `${OUT}/${name}.png`, clip: c });
  await sleep(1400); // settle
  await page.locator('.sun-moon-toggle').dispatchEvent('click'); // toggle back
  await sleep(1400);
  console.log('SHOT', name, '@', tMs);
}
await frameShot('wring-mid-t170', 170);
await frameShot(`bloom-scale03-t${near03.t}`, near03.t);
await frameShot('crest-t560', 560);
await frameShot('crest-edge-t560', 560, edgeClip);
await frameShot('plush-t930', 930);

// ── 3. twist checkpoint (-15 shipped / -8 / 0) — mid-wring captures ──
for (const deg of [-8, 0]) {
  await page.evaluate((d) => {
    let s = document.getElementById('probe-twist');
    if (!s) {
      s = document.createElement('style');
      s.id = 'probe-twist';
      document.head.appendChild(s);
    }
    s.textContent = `.sun-moon-toggle.is-turning .toggle-icon:not(.is-active) .warp { transform: scale(0.06) rotate(${d}deg) translateY(6px) !important; }`;
  }, deg);
  await frameShot(`twist-${Math.abs(deg)}-t170`, 170);
}
await page.evaluate(() => document.getElementById('probe-twist')?.remove());
// shipped -15 already captured as wring-mid-t170

// ── 4. mid-flight re-click retarget ──
const retarget = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const btn = document.querySelector('.sun-moon-toggle');
      const moonWarp = document.querySelector('.toggle-moon .warp');
      const sc = (m) => {
        if (m === 'none') return 1;
        const [a, b] = m.slice(7, -1).split(',').map(Number);
        return Math.hypot(a, b);
      };
      const samples = [];
      const t0 = performance.now();
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true })); // light→dark
      let reclicked = false;
      function tick() {
        const t = performance.now() - t0;
        if (t >= 400 && !reclicked) {
          reclicked = true;
          btn.dispatchEvent(new MouseEvent('click', { bubbles: true })); // dark→light mid-flight
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
fs.writeFileSync(`${OUT}/retarget-samples.json`, JSON.stringify(retarget, null, 1));
// max inter-frame jump in moon scale after the re-click (continuity check)
let maxJump = 0;
for (let i = 1; i < retarget.samples.length; i++) {
  const d = Math.abs(retarget.samples[i].moonS - retarget.samples[i - 1].moonS);
  if (retarget.samples[i].t > 410 && d > maxJump) maxJump = d;
}
console.log('RETARGET dark=', retarget.dark, 'turning=', retarget.turning, 'maxJump=', maxJump.toFixed(4));
await sleep(1500);
await page.screenshot({ path: `${OUT}/retarget-settled.png`, clip });

// ── 5. PRM parity ──
const prmCtx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
});
const prm = await prmCtx.newPage();
await prm.goto('http://localhost:3001', { waitUntil: 'networkidle' });
await sleep(1200);
const prmState = await prm.evaluate(() => {
  const warp = document.querySelector('.toggle-moon .warp');
  const rests = Array.from(document.querySelectorAll('.toggle-rest')).map((el) => ({
    cls: el.className,
    vis: getComputedStyle(el).visibility,
    op: getComputedStyle(el).opacity,
    transition: getComputedStyle(el).transitionDuration,
  }));
  return { warp: getComputedStyle(warp).transform, rests };
});
console.log('PRM', JSON.stringify(prmState, null, 1));
await prm.locator('.sun-moon-toggle').dispatchEvent('click');
await sleep(100);
const prmMid = await prm.evaluate(() => ({
  dark: document.documentElement.classList.contains('dark'),
  turning: document.querySelector('.sun-moon-toggle').classList.contains('is-turning'),
  liveVis: Array.from(document.querySelectorAll('.toggle-icon')).map(
    (el) => getComputedStyle(el).visibility,
  ),
}));
console.log('PRM MID-FLIP', JSON.stringify(prmMid));
await sleep(600);
await prm.screenshot({ path: `${OUT}/prm-dark.png`, clip });
await prmCtx.close();

await browser.close();
console.log('DONE');
