// T4-W1 perf probe — reconstructed from s1.md / crit-safari.md inline recipes.
// Idle fps (in-page rAF histogram) + process-CPU proxy for WebKit/Chromium at DPR2/1440x900.
// arm ∈ {baked, forcelive}: baked = as-shipped (bitmap <image> swap, no live filter);
//   forcelive = inject CSS to hide the baked bitmaps and un-hide the live grain-static
//   <g> stack, reproducing the pre-W1 per-beat filter re-raster on the SAME build.
// Usage: node perf-probe.mjs <webkit|chromium> <baked|forcelive> <url> [idleMs]
import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
const { webkit, chromium } = pw;
import { execSync } from 'node:child_process';

const [engineName, arm, url = 'http://127.0.0.1:4191/', idleMsRaw] = process.argv.slice(2);
const idleMs = Number(idleMsRaw) || 8000;
const engine = engineName === 'chromium' ? chromium : webkit;

function loadavg() {
  const s = execSync('uptime').toString();
  return s.match(/load averages?: ([\d.]+)/)?.[1] ?? '?';
}
// Aggregate CPU% (ps pcpu — a decaying lifetime average per crit-safari; corroboration only)
// over pids whose command matches the engine's helper processes, excluding a baseline pid set.
function enginePids(re, exclude) {
  const out = execSync('ps -Ao pid,pcpu,comm').toString().trim().split('\n').slice(1);
  const rows = [];
  for (const line of out) {
    const m = line.trim().match(/^(\d+)\s+([\d.]+)\s+(.*)$/);
    if (!m) continue;
    const [, pid, pcpu, comm] = m;
    if (re.test(comm) && !exclude.has(pid)) rows.push({ pid, pcpu: Number(pcpu), comm });
  }
  return rows;
}

const HELPER_RE = engineName === 'chromium'
  ? /Chromium|chrome_crashpad|Google Chrome/i
  : /WebKit|WebContent|\.GPU|Networking|playwright.*[Ww]ebkit/i;

const before = new Set(enginePids(HELPER_RE, new Set()).map((r) => r.pid));

const browser = await engine.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await context.newPage();
await page.goto(url, { waitUntil: 'load', timeout: 60000 });

// Wait for the grid to settle to the baked steady state (4 <image> siblings present).
await page.waitForFunction(() => document.querySelectorAll('.boil-frame-bitmap').length === 4, null, { timeout: 30000 })
  .catch(() => {});
const bakedCount = await page.evaluate(() => document.querySelectorAll('.boil-frame-bitmap').length);
const liveCount = await page.evaluate(() => document.querySelectorAll('.boil-frame-layer').length);

if (arm === 'forcelive') {
  // Reproduce the pre-W1 cost: drop the baked bitmaps, un-hide the live grain-static stack
  // so its filter re-rasters on every beat opacity flip again.
  await page.addStyleTag({ content: `
    .boil-frame-bitmap { display: none !important; }
    @media screen { .boil-frame-layer.baked-hidden { display: inline !important; } }
  ` });
}
await page.waitForTimeout(1500); // settle

// CPU sample window (two ps reads bracketing the idle window)
const pidsNow = enginePids(HELPER_RE, before);
const cpuStart = pidsNow.reduce((a, r) => a + r.pcpu, 0);

// In-page rAF fps histogram + setTimeout(0) responsiveness, over idleMs.
const feel = await page.evaluate((ms) => new Promise((resolve) => {
  const deltas = [];
  let last = performance.now();
  let frames = 0;
  const respSamples = [];
  const t0 = performance.now();
  function tick(now) {
    deltas.push(now - last);
    last = now;
    frames++;
    const s = performance.now();
    setTimeout(() => respSamples.push(performance.now() - s), 0);
    if (now - t0 < ms) requestAnimationFrame(tick);
    else {
      const sorted = deltas.slice(1).sort((a, b) => a - b);
      const pct = (p) => sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] : 0;
      const secs = (performance.now() - t0) / 1000;
      resolve({
        fps: +(frames / secs).toFixed(1),
        rafP50: +pct(0.5).toFixed(1),
        rafP95: +pct(0.95).toFixed(1),
        rafMax: +Math.max(...sorted).toFixed(1),
        jank100: sorted.filter((d) => d > 100).length,
        jank250: sorted.filter((d) => d > 250).length,
        respMax: respSamples.length ? +Math.max(...respSamples).toFixed(1) : 0,
        frames,
        secs: +secs.toFixed(1),
      });
    }
  }
  requestAnimationFrame(tick);
}), idleMs);

const pidsEnd = enginePids(HELPER_RE, before);
const cpuEnd = pidsEnd.reduce((a, r) => a + r.pcpu, 0);

console.log(JSON.stringify({
  engine: engineName, arm, url,
  loadavg: loadavg(),
  bakedCount, liveCount,
  cpuPidsPcpu: +((cpuStart + cpuEnd) / 2).toFixed(1),
  cpuPidCount: pidsEnd.length,
  ...feel,
}, null, 0));

await browser.close();
