// RUN: node census-stats.mjs raw/<tag>            (reduces the interleaved arms in that dir)
//
// Reducer over A1 bake-census windows: encodes per surface, the toBlob bill, the pipeline
// wall and board-ready, base arm against cured arm, medians and ranges.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const med = (a) => {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const f = (n) => (Number.isFinite(n) ? n.toFixed(1) : "—");
const rng = (a) => (a.length ? `${f(Math.min(...a))}–${f(Math.max(...a))}` : "—");
const disjoint = (a, b) => Math.max(...a) < Math.min(...b) || Math.max(...b) < Math.min(...a);

for (const dir of process.argv.slice(2)) {
  const arms = { base: [], cured: [] };
  for (const name of readdirSync(dir).sort()) {
    if (!name.endsWith(".jsonl")) continue;
    const arm = name.startsWith("cured") ? "cured" : "base";
    const lines = readFileSync(join(dir, name), "utf8").trim().split("\n").map((l) => JSON.parse(l));
    const meta = lines.find((l) => l.k === "meta");
    for (const w of lines.filter((l) => l.k === "window")) {
      const ev = w.cold.ev;
      const ends = ev.filter((e) => e.k === "toBlob:end");
      const starts = ev.filter((e) => e.k === "toBlob:start");
      const bySurface = {};
      for (const e of ends) bySurface[e.surface] = (bySurface[e.surface] || 0) + 1;
      arms[arm].push({
        meta,
        encodes: ends.length,
        bill: ends.reduce((a, e) => a + e.ms, 0),
        wall: ends.length ? ends[ends.length - 1].t - starts[0].t : 0,
        lastEncode: ends.length ? ends[ends.length - 1].t : 0,
        boardReady: w.cold.boardReady,
        bySurface,
        taint: w.cold.taint,
        bytes: ends.reduce((a, e) => a + (e.bytes || 0), 0),
      });
    }
  }
  const m0 = arms.base[0]?.meta || {};
  console.log(`\n### ${dir}`);
  console.log(
    `${m0.engine} · CPU ${m0.cpuThrottle} · ${m0.net} · ${m0.cache} · ${m0.vp} · dpr ${m0.vp === "mobile" ? 3 : 2} · base :4252 vs cured :4253 · instrument A1/bake-census.mjs (unmodified)`,
  );
  const cols = ["encodes", "bill", "wall", "lastEncode", "boardReady"];
  const pick = (arm, c) => arms[arm].map((r) => r[c]).filter((v) => Number.isFinite(v));
  console.log("mark | base median (range) | cured median (range) | delta | disjoint");
  for (const c of cols) {
    const b = pick("base", c);
    const u = pick("cured", c);
    console.log(
      `${c} | ${f(med(b))} (${rng(b)}) | ${f(med(u))} (${rng(u)}) | ${f(med(u) - med(b))} | ${disjoint(b, u)}`,
    );
  }
  const surf = (arm) => {
    const all = {};
    for (const r of arms[arm]) for (const [k, v] of Object.entries(r.bySurface)) (all[k] ||= []).push(v);
    return Object.entries(all)
      .map(([k, v]) => `${k} ${med(v)}`)
      .join(" · ");
  };
  console.log(`per-surface encodes | base: ${surf("base") || "none"} | cured: ${surf("cured") || "none"}`);
  console.log(
    `windows | base ${arms.base.length} (taint ${arms.base.filter((r) => r.taint).length}) · cured ${arms.cured.length} (taint ${arms.cured.filter((r) => r.taint).length})`,
  );
}
