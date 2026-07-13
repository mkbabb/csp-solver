// T4-W1 chromium-residue + murmur-damage trace — reconstructed from r1-perf / crit inline
// recipes. Chromium CDP Tracing captures Paint records (with clip bbox) + RasterTask events
// over an idle window. Reports RasterTask/s and the Paint clip-size histogram (full-viewport
// 1440x900 clips = the murmur's full-viewport damage; cell-box ~40x56 clips = contained).
// Usage: node murmur-trace.mjs <url> <unsolved|solved> <baked|forcelive> [traceMs]
import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
const { chromium } = pw;
import { execSync } from 'node:child_process';

const [url = 'http://127.0.0.1:4191/', state = 'unsolved', arm = 'baked', traceMsRaw] = process.argv.slice(2);
const traceMs = Number(traceMsRaw) || 22000;
const loadavg = execSync('uptime').toString().match(/load averages?: ([\d.]+)/)?.[1] ?? '?';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await context.newPage();
await page.goto(url, { waitUntil: 'load', timeout: 60000 });
await page.waitForFunction(() => document.querySelectorAll('.boil-frame-bitmap').length === 4, null, { timeout: 30000 }).catch(() => {});

if (arm === 'forcelive') {
  await page.addStyleTag({ content: `
    .boil-frame-bitmap { display: none !important; }
    @media screen { .boil-frame-layer.baked-hidden { display: inline !important; } }
  ` });
}

let solveOk = null;
if (state === 'solved') {
  await page.locator('.controls-card button[aria-label="Solve puzzle"]').click().catch(() => {});
  await page.waitForTimeout(2500);
  solveOk = await page.evaluate(() => document.querySelector('.board-wrapper')?.className?.includes('solve-success') ?? false);
  // let the celebration crest pass so we are in the steady murmur pool, not the burst
  await page.waitForTimeout(4000);
}
await page.waitForTimeout(1000);

const client = await context.newCDPSession(page);
const events = [];
client.on('Tracing.dataCollected', (d) => { for (const e of d.value) events.push(e); });
await client.send('Tracing.start', {
  categories: 'disabled-by-default-devtools.timeline,devtools.timeline,disabled-by-default-devtools.timeline.frame',
  transferMode: 'ReportEvents',
});
await page.waitForTimeout(traceMs);
const done = new Promise((r) => client.once('Tracing.tracingComplete', r));
await client.send('Tracing.end');
await done;

// Parse
const secs = traceMs / 1000;
const rasterTasks = events.filter((e) => e.name === 'RasterTask');
const paints = events.filter((e) => e.name === 'Paint' && e.args?.data?.clip);
function bbox(clip) {
  const xs = [], ys = [];
  for (let i = 0; i < clip.length; i += 2) { xs.push(clip[i]); ys.push(clip[i + 1]); }
  return { w: Math.round(Math.max(...xs) - Math.min(...xs)), h: Math.round(Math.max(...ys) - Math.min(...ys)) };
}
const paintBoxes = paints.map((p) => bbox(p.args.data.clip));
// full-viewport = clip spanning >= ~90% of the 1440x900 viewport in both dims
const fullViewport = paintBoxes.filter((b) => b.w >= 1296 && b.h >= 810);
const largest = paintBoxes.slice().sort((a, b) => b.w * b.h - a.w * a.h).slice(0, 5);
// cell-box-ish = small clips (<= ~120x160 CSS px, generous)
const cellBox = paintBoxes.filter((b) => b.w <= 160 && b.h <= 220);

console.log(JSON.stringify({
  url, state, arm, loadavg, traceMs, solveOk,
  totalEvents: events.length,
  rasterTasks: rasterTasks.length,
  rasterPerSec: +(rasterTasks.length / secs).toFixed(2),
  paints: paints.length,
  paintsPerSec: +(paints.length / secs).toFixed(2),
  fullViewportPaints: fullViewport.length,
  fullViewportPerSec: +(fullViewport.length / secs).toFixed(2),
  cellBoxPaints: cellBox.length,
  largestPaints: largest,
}, null, 0));

await browser.close();
