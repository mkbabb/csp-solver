#!/usr/bin/env node
// PASS-6 LANE D · order (4) — the pre-settle 21, read a SECOND time.
//
// `filterBudget.ts:59` prints the boot-window census as 21 and leaves it UNGATED with a named
// trigger: "a second cold-load reading above 21, or any evidence that the boot window carries a
// beat-driven re-execution." D5-G3 booked the 21 as n=1 — one device arm, one session. This rig
// is the second reading the trigger asks for, on the arm this lane can actually reach.
//
// WHAT IT IS NOT: real MobileSafari on real hardware. The pass-4 figure came from
// `perf-rig-iphone16`, iOS 19, and no emulation substitutes for it. What this arm CAN do is
// sample the same descriptor (393x699, dpr3, coarse pointer, no hover) in both engines and say
// whether the boot window's peak population lands at 21, under it, or over it.
//
// HOW IT SAMPLES: the window is a race — it closes when the bake lands and the rest poses go.
// A single post-load reading would report whatever the sampler happened to catch, so this walks
// the whole window: it polls every frame from navigation until the population has been stable
// for STABLE_MS, and reports the PEAK as well as the settled floor. A budget cares about the
// peak; the trigger is written against it.
//
// Both counting rules are reported, because the whole point of row 3 is that they agree there:
//   spec   — own computed display !== 'none'   (filterBudget.ts's rule)
//   device — display not consulted             (the perf-rig's rule)
//
// Run: BASE=http://127.0.0.1:4245 node <this file>

import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

let root = dirname(fileURLToPath(import.meta.url));
while (!existsSync(join(root, "web/frontend/package.json"))) {
  const up = dirname(root);
  if (up === root) throw new Error("repo root not found above " + import.meta.url);
  root = up;
}
const { chromium, webkit, devices } = createRequire(
  join(root, "web/frontend/package.json"),
)("playwright");

const BASE = process.env.BASE ?? "http://127.0.0.1:4245";
const RUNS = Number(process.env.RUNS ?? 3);
const STABLE_MS = 900;
const MAX_MS = 12000;

// Injected before any page script runs, so sampling starts at the first frame the document has.
const SAMPLER = `(() => {
  const rule = (el, useDisplay) => {
    const cs = getComputedStyle(el);
    if (!cs.filter || cs.filter === 'none') return false;
    if (useDisplay && cs.display === 'none') return false;
    return true;
  };
  const snap = () => {
    const all = Array.from(document.querySelectorAll('*'));
    const spec = all.filter((el) => rule(el, true));
    const dev  = all.filter((el) => rule(el, false));
    const count = (sel) => document.querySelectorAll(sel).length;
    const tag = (el) => {
      const c = (el.getAttribute('class') || '').trim().split(/\\s+/).filter(Boolean).slice(0, 2).join('.');
      return el.tagName.toLowerCase() + (c ? '.' + c : '');
    };
    return {
      t: Math.round(performance.now()),
      sig: spec.map(tag).sort(),
      spec: spec.length,
      device: dev.length,
      rest: count('svg.rest-pose'),
      restActive: count('svg.rest-pose.is-pose-active'),
      logo: count('g.logo-pose'),
      logoActive: count('g.logo-pose.is-active'),
      hidden: count('.baked-hidden'),
    };
  };
  window.__samples = [];
  const tick = () => { try { window.__samples.push(snap()); } catch {} requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
})()`;

const DESC = { width: 393, height: 699, dpr: 3 };

const run = async (engineName, engine, i) => {
  const browser = await engine.launch();
  // Cold every time: a fresh context is a fresh cache, a fresh service worker, fresh storage.
  const ctx = await browser.newContext({
    viewport: { width: DESC.width, height: DESC.height },
    deviceScaleFactor: DESC.dpr,
    isMobile: engineName === "chromium" ? true : undefined,
    hasTouch: true,
    ...(devices["iPhone 15"]?.userAgent ? { userAgent: devices["iPhone 15"].userAgent } : {}),
  });
  const page = await ctx.newPage();
  await page.addInitScript(SAMPLER);
  await page.goto(BASE + "/");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 15000 });

  // Walk the window: stop once the spec population has not moved for STABLE_MS.
  const t0 = Date.now();
  let lastChange = Date.now();
  let prev = -1;
  for (;;) {
    const cur = await page.evaluate(() => {
      const s = window.__samples;
      return s.length ? s[s.length - 1].spec : -1;
    });
    if (cur !== prev) {
      prev = cur;
      lastChange = Date.now();
    }
    if (Date.now() - lastChange > STABLE_MS) break;
    if (Date.now() - t0 > MAX_MS) break;
    await page.waitForTimeout(50);
  }

  const samples = await page.evaluate(() => window.__samples);
  await browser.close();

  if (!samples.length) return { engineName, i, error: "sampler produced nothing" };

  const peakSpec = Math.max(...samples.map((s) => s.spec));
  const peakDevice = Math.max(...samples.map((s) => s.device));
  const at = samples.find((s) => s.spec === peakSpec);
  const settled = samples[samples.length - 1];
  return { engineName, i, n: samples.length, peakSpec, peakDevice, at, settled };
};

const rows = [];
for (const [name, engine] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  for (let i = 1; i <= RUNS; i++) rows.push(await run(name, engine, i));
}

console.log(
  `pre-settle census — ${DESC.width}x${DESC.height} dpr${DESC.dpr}, coarse, cold context per run`,
);
console.log(`base ${BASE}\n`);
console.log(
  "engine    run  frames  PEAK spec  PEAK device   at t(ms)  rest/active  logo/active   settled spec/device",
);
for (const r of rows) {
  if (r.error) {
    console.log(`${r.engineName.padEnd(9)} ${String(r.i).padEnd(4)} ${r.error}`);
    continue;
  }
  console.log(
    `${r.engineName.padEnd(9)} ${String(r.i).padEnd(4)} ${String(r.n).padEnd(6)}  ` +
      `${String(r.peakSpec).padStart(9)}  ${String(r.peakDevice).padStart(11)}   ` +
      `${String(r.at.t).padStart(8)}  ${String(r.at.rest + "/" + r.at.restActive).padStart(11)}  ` +
      `${String(r.at.logo + "/" + r.at.logoActive).padStart(11)}   ` +
      `${r.settled.spec}/${r.settled.device}`,
  );
}

// The peak POPULATION, named element by element, per engine — so a cross-engine delta is a
// surface with a name rather than an unexplained integer.
console.log("\npeak population, by element (run 1 of each engine):");
for (const name of ["chromium", "webkit"]) {
  const r = rows.find((x) => x.engineName === name && x.i === 1 && !x.error);
  if (!r) continue;
  const tally = new Map();
  for (const s of r.at.sig) tally.set(s, (tally.get(s) ?? 0) + 1);
  console.log(`  [${name}] peak ${r.peakSpec} @ t=${r.at.t}ms`);
  for (const [k, v] of [...tally].sort()) console.log(`      ${String(v).padStart(3)}  ${k}`);
}
{
  const c = rows.find((x) => x.engineName === "chromium" && x.i === 1);
  const w = rows.find((x) => x.engineName === "webkit" && x.i === 1);
  if (c?.at && w?.at) {
    const cnt = (a) => a.reduce((m, k) => m.set(k, (m.get(k) ?? 0) + 1), new Map());
    const cc = cnt(c.at.sig);
    const wc = cnt(w.at.sig);
    const keys = [...new Set([...cc.keys(), ...wc.keys()])].sort();
    const diff = keys
      .map((k) => [k, (cc.get(k) ?? 0) - (wc.get(k) ?? 0)])
      .filter(([, d]) => d !== 0);
    console.log(
      diff.length
        ? "\n  DELTA chromium-minus-webkit at peak:\n" +
            diff.map(([k, d]) => `      ${d > 0 ? "+" : ""}${d}  ${k}`).join("\n")
        : "\n  DELTA chromium-minus-webkit at peak: none (same population, same names)",
    );
  }
}

const peaks = rows.filter((r) => !r.error).map((r) => r.peakSpec);
const over = peaks.filter((p) => p > 21);
console.log(
  `\npeaks ${peaks.join(", ")}  — max ${Math.max(...peaks)}  ` +
    `— readings ABOVE 21: ${over.length}`,
);
console.log(
  over.length > 0
    ? "TRIGGER FIRES: a second cold-load reading came in above 21."
    : "TRIGGER DOES NOT FIRE on this arm: no reading above 21.",
);
