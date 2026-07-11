// T3-W12 gate perf probe — one instrument for baseline and current (stash-interleaved).
// DevTools timeline trace, 10s settled, 1440x806, against the :3001 dev server.
// Counts Paint events, full-viewport paints (clip area >= 80% of viewport device px),
// style recalcs, layout, and paint-gap idle evidence.
import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const { chromium } = require('@playwright/test');

const label = process.argv[2] || 'run';
const BASE = 'http://localhost:3001';
const TRACE_MS = 10000;

async function traceState(page, client, state) {
  const events = [];
  client.on('Tracing.dataCollected', (p) => events.push(...p.value));
  const done = new Promise((res) => client.once('Tracing.tracingComplete', res));
  await client.send('Tracing.start', {
    categories: 'disabled-by-default-devtools.timeline,devtools.timeline',
    transferMode: 'ReportEvents',
  });
  await page.waitForTimeout(TRACE_MS);
  await client.send('Tracing.end');
  await done;

  const paints = events.filter((e) => e.name === 'Paint' && e.ph === 'X');
  const dpr = await page.evaluate(() => window.devicePixelRatio);
  const vpArea = 1440 * dpr * 806 * dpr;
  let fullVp = 0;
  for (const p of paints) {
    const clip = p.args?.data?.clip;
    if (!clip) continue;
    const xs = [clip[0], clip[2], clip[4], clip[6]];
    const ys = [clip[1], clip[3], clip[5], clip[7]];
    const area = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
    if (area >= vpArea * 0.8) fullVp++;
  }
  const recalcs = events.filter((e) => e.name === 'UpdateLayoutTree').length;
  const layouts = events.filter((e) => e.name === 'Layout').length;
  const commits = events.filter((e) => e.name === 'Commit').length;
  // idle evidence: gaps between consecutive paint starts
  const ts = paints.map((p) => p.ts).sort((a, b) => a - b);
  let gaps50 = 0, maxGap = 0;
  for (let i = 1; i < ts.length; i++) {
    const g = (ts[i] - ts[i - 1]) / 1000;
    if (g > maxGap) maxGap = g;
    if (g >= 50) gaps50++;
  }
  // clip signatures: what shapes are actually painting?
  const sig = {};
  for (const p of paints) {
    const clip = p.args?.data?.clip;
    if (!clip) continue;
    const xs = [clip[0], clip[2], clip[4], clip[6]];
    const ys = [clip[1], clip[3], clip[5], clip[7]];
    const key = `${Math.round(Math.max(...xs) - Math.min(...xs))}x${Math.round(Math.max(...ys) - Math.min(...ys))}@layer${p.args?.data?.layerId ?? '?'}`;
    sig[key] = (sig[key] || 0) + 1;
  }
  const topSigs = Object.entries(sig).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const s = TRACE_MS / 1000;
  return {
    topPaintClips: topSigs,
    state,
    paints_s: +(paints.length / s).toFixed(1),
    fullvp_s: +(fullVp / s).toFixed(1),
    recalc_s: +(recalcs / s).toFixed(1),
    layout_s: +(layouts / s).toFixed(1),
    commits_s: +(commits / s).toFixed(1),
    maxPaintGapMs: +maxGap.toFixed(0),
    gaps50ms: gaps50,
  };
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 806 } });
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(5000); // draw-in + settle

const client = await page.context().newCDPSession(page);
const out = { label, when: new Date().toISOString() };

out.unsolved = await traceState(page, client, 'unsolved');

// solve: the controls card's Solve button (drawer default-open at 1440)
const solve = page.locator('.controls-card button', { hasText: /solve/i }).first();
await solve.click();
await page.waitForSelector('.solve-success', { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(4500); // celebration crest ~3s + settle
out.solvedScrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
out.innerHeight = await page.evaluate(() => window.innerHeight);
out.solved = await traceState(page, client, 'solved');

console.log(JSON.stringify(out, null, 2));
await browser.close();
