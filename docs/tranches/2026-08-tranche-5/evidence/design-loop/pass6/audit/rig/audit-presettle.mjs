/**
 * AUDIT rig — the pre-settle 21, read by a NON-AUTHOR, on BOTH the base and the head dist.
 * Independent implementation of the census rule filterBudget.ts states:
 *   spec   = computed filter !== 'none' AND own computed display !== 'none'
 *   device = computed filter !== 'none'                     (display not consulted)
 * Sampling: an init script installs a rAF poller before the first page script runs; peak and
 * settled floor are both reported. Cell: 393x699 dpr3, coarse, no hover — pass 4's descriptor.
 *
 * Usage: node audit-presettle.mjs <baseURL> <engine> <label> [runs]
 */
import { chromium, webkit } from "playwright";

const SAMPLER = `(() => {
  const hit = (el, useDisplay) => {
    const cs = getComputedStyle(el);
    if (!cs.filter || cs.filter === 'none') return false;
    if (useDisplay && cs.display === 'none') return false;
    return true;
  };
  const tag = (el) => el.tagName.toLowerCase() + (el.getAttribute('class') ? '.' + el.getAttribute('class').trim().split(/\\s+/).slice(0,2).join('.') : '');
  const samples = [];
  const snap = () => {
    const all = Array.from(document.querySelectorAll('*'));
    const spec = all.filter((e) => hit(e, true));
    const dev = all.filter((e) => hit(e, false));
    samples.push({ t: Math.round(performance.now()), spec: spec.length, dev: dev.length,
      names: spec.map(tag) });
    requestAnimationFrame(snap);
  };
  requestAnimationFrame(snap);
  window.__auditSamples = samples;
})()`;

const [, , baseURL, engineName, label, runsArg = "3"] = process.argv;
const engine = engineName === "webkit" ? webkit : chromium;
const RUNS = Number(runsArg);
const browser = await engine.launch();
const results = [];
for (let i = 0; i < RUNS; i++) {
  const ctx = await browser.newContext({
    viewport: { width: 393, height: 699 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: engineName !== "webkit",
  });
  await ctx.addInitScript(SAMPLER);
  const page = await ctx.newPage();
  await page.goto(`${baseURL}/?size=3&difficulty=EASY`, { waitUntil: "load" });
  // poll until the population holds still for 900ms
  await page.waitForFunction(
    () => {
      const s = window.__auditSamples || [];
      if (s.length < 10) return false;
      const now = s[s.length - 1].t;
      const last = s[s.length - 1].spec;
      const window900 = s.filter((x) => now - x.t <= 900);
      return window900.length > 5 && window900.every((x) => x.spec === last);
    },
    { timeout: 15000 },
  ).catch(() => {});
  const s = await page.evaluate(() => window.__auditSamples);
  let peakSpec = 0, peakDev = 0, peakAt = 0, peakNames = [];
  for (const x of s) {
    if (x.spec > peakSpec) { peakSpec = x.spec; peakAt = x.t; peakNames = x.names; }
    if (x.dev > peakDev) peakDev = x.dev;
  }
  const settled = s[s.length - 1];
  results.push({ run: i + 1, peakSpec, peakDev, peakAt, settledSpec: settled.spec, settledDev: settled.dev, samples: s.length, peakNames });
  await ctx.close();
}
await browser.close();
console.log(`\n[${label}] ${engineName}  n=${RUNS}  cell 393x699 dpr3 coarse`);
for (const r of results)
  console.log(`  run ${r.run}: PEAK spec ${r.peakSpec} / device ${r.peakDev} at t=${r.peakAt}ms · settled ${r.settledSpec}/${r.settledDev} · ${r.samples} frames`);
const maxPeak = Math.max(...results.map((r) => r.peakSpec));
console.log(`  MAX PEAK spec across runs: ${maxPeak}`);
const tally = {};
for (const n of results[0].peakNames) tally[n] = (tally[n] || 0) + 1;
console.log("  peak population (run 1):");
for (const [k, v] of Object.entries(tally).sort()) console.log(`    ${String(v).padStart(2)} × ${k}`);
