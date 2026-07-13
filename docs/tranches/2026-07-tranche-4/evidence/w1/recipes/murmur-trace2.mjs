// Enhanced murmur trace: resolves Paint nodeIds + reports full-viewport paint cadence.
// Usage: node murmur-trace2.mjs <url> <unsolved|solved> <baked|nocontain> [traceMs]
import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
const { chromium } = pw;
import { execSync } from 'node:child_process';

const [url = 'http://127.0.0.1:4191/', state = 'solved', arm = 'baked', traceMsRaw] = process.argv.slice(2);
const traceMs = Number(traceMsRaw) || 20000;
const loadavg = execSync('uptime').toString().match(/load averages?: ([\d.]+)/)?.[1] ?? '?';

function attr(node, key) {
  const a = node.attributes || [];
  for (let i = 0; i < a.length; i += 2) if (a[i] === key) return a[i + 1];
  return '';
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await context.newPage();
await page.goto(url, { waitUntil: 'load', timeout: 60000 });
await page.waitForFunction(() => document.querySelectorAll('.boil-frame-bitmap').length === 4, null, { timeout: 30000 }).catch(() => {});

if (arm === 'nocontain') await page.addStyleTag({ content: `.glyph-svg { contain: none !important; }` });

let solveOk = null;
if (state === 'solved') {
  await page.locator('.controls-card button[aria-label="Solve puzzle"]').click().catch(() => {});
  await page.waitForTimeout(2500);
  solveOk = await page.evaluate(() => document.querySelector('.board-wrapper')?.className?.includes('solve-success') ?? false);
  await page.waitForTimeout(5000);
}
await page.waitForTimeout(1000);

const client = await context.newCDPSession(page);
await client.send('DOM.enable');
await client.send('DOM.getDocument', { depth: -1 });
const events = [];
client.on('Tracing.dataCollected', (d) => { for (const e of d.value) events.push(e); });
await client.send('Tracing.start', {
  categories: 'disabled-by-default-devtools.timeline,devtools.timeline',
  transferMode: 'ReportEvents',
});
await page.waitForTimeout(traceMs);
const done = new Promise((r) => client.once('Tracing.tracingComplete', r));
await client.send('Tracing.end');
await done;

const paints = events.filter((e) => e.name === 'Paint' && e.args?.data?.clip);
function bbox(clip) {
  const xs = [], ys = [];
  for (let i = 0; i < clip.length; i += 2) { xs.push(clip[i]); ys.push(clip[i + 1]); }
  return { w: Math.round(Math.max(...xs) - Math.min(...xs)), h: Math.round(Math.max(...ys) - Math.min(...ys)) };
}
const rows = paints.map((p) => ({ ts: p.ts, dur: p.dur || 0, ...bbox(p.args.data.clip), nodeId: p.args.data.nodeId }));
const full0 = rows.filter((r) => r.w >= 1296 && r.h >= 810);
const cell0 = rows.filter((r) => r.w <= 160 && r.h <= 220);
const avg = (a) => a.length ? +(a.reduce((s, r) => s + r.dur, 0) / a.length / 1000).toFixed(3) : 0; // us->ms
const durStats = { fullViewportAvgMs: avg(full0), cellBoxAvgMs: avg(cell0), fullViewportMaxMs: +(Math.max(0, ...full0.map((r) => r.dur)) / 1000).toFixed(3) };
const full = rows.filter((r) => r.w >= 1296 && r.h >= 810);
const fullTs = full.map((r) => r.ts / 1000).sort((a, b) => a - b);
const gaps = [];
for (let i = 1; i < fullTs.length; i++) gaps.push(Math.round(fullTs[i] - fullTs[i - 1]));
const nodeIds = [...new Set(full.map((r) => r.nodeId).filter(Boolean))];
const resolved = [];
for (const nid of nodeIds.slice(0, 15)) {
  try {
    const { nodeIds: fe } = await client.send('DOM.pushNodesByBackendIdsToFrontend', { backendNodeIds: [nid] });
    const { node } = await client.send('DOM.describeNode', { nodeId: fe[0] });
    resolved.push({ nodeId: nid, name: node.localName || node.nodeName, class: attr(node, 'class'), id: attr(node, 'id') });
  } catch (e) { resolved.push({ nodeId: nid, err: String(e).slice(0, 60) }); }
}
// size histogram
const sizes = {};
for (const r of rows) { const k = `${r.w}x${r.h}`; sizes[k] = (sizes[k] || 0) + 1; }

console.log(JSON.stringify({
  url, state, arm, loadavg, traceMs, solveOk,
  totalPaints: paints.length,
  fullViewportPaints: full.length,
  fullViewportPerSec: +(full.length / (traceMs / 1000)).toFixed(2),
  durStats,
  fullVpGapsMs: gaps.slice(0, 14),
  fullVpNodeResolved: resolved,
  sizeHistogram: Object.fromEntries(Object.entries(sizes).sort((a, b) => b[1] - a[1]).slice(0, 12)),
}, null, 1));

await browser.close();
