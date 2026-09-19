// RUN: node stats.mjs <base.jsonl> <cured.jsonl>
// T9-W8 §8.2 cure C01 — per-window quantities out of A1's `bake-census.mjs` raws, so a delta
// can be read against the arm's own SPREAD rather than against a median alone. A delta inside
// the spread is not a move; this prints both so the reader can say which it is.
//
// encodes            — toBlob:end count, all surfaces
// discardedMs        — Σ, over every surface that ran two rounds, of the FIRST round's
//                      toBlob:sync ms (rounds split by encode order within a surface, which is
//                      how A1's `double-bake-proof.mjs` prices it)
// encodeMs           — Σ toBlob:sync, all surfaces: the whole synchronous encode bill
// lastEncodeMs       — the last toBlob:end stamp: when the bake pipeline finally lets go
// boardReadyMs       — the wave's one definition, as the instrument stamps it
// tbtMs              — Σ max(0, longtask.dur − 50) over the window (chromium only)
import { readFileSync } from "node:fs";
const med = (a) => { const s = [...a].sort((x, y) => x - y); const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const f1 = (x) => (x == null ? "—" : (+x).toFixed(1));
function rows(file) {
  const L = readFileSync(file, "utf8").trim().split("\n").map((l) => JSON.parse(l));
  const meta = L.find((x) => x.k === "meta");
  const end = L.find((x) => x.k === "end");
  const out = [];
  for (const w of L.filter((x) => x.k === "window")) {
    const ev = w.cold.ev;
    const sync = {}, ends = {};
    for (const e of ev) if (e.k === "toBlob:sync") (sync[e.surface] ??= []).push(e.syncMs);
    for (const e of ev) if (e.k === "toBlob:end") (ends[e.surface] ??= []).push(e.t);
    let encodes = 0, discardedMs = 0, encodeMs = 0, last = 0;
    for (const [s, arr] of Object.entries(sync)) {
      encodes += arr.length;
      encodeMs += arr.reduce((a, b) => a + b, 0);
      if (arr.length === 8) discardedMs += arr.slice(0, 4).reduce((a, b) => a + b, 0);
      for (const t of ends[s] || []) last = Math.max(last, t);
    }
    const tbt = ev.filter((e) => e.k === "perf:longtask")
      .reduce((a, e) => a + Math.max(0, e.dur - 50), 0);
    out.push({ window: w.window, taint: w.cold.taint, encodes,
      discardedMs: +discardedMs.toFixed(1), encodeMs: +encodeMs.toFixed(1),
      lastEncodeMs: +last.toFixed(1), boardReadyMs: w.cold.boardReady, tbtMs: +tbt.toFixed(1) });
  }
  return { meta, end, out };
}
const KEYS = ["encodes", "discardedMs", "encodeMs", "lastEncodeMs", "boardReadyMs", "tbtMs"];
const [bf, cf] = process.argv.slice(2);
const B = rows(bf), C = rows(cf);
const head = (m) => `${m.engine} · ${m.cpuThrottle}× · ${m.net} · ${m.cache} · ${m.vp}`;
console.log(`regime: ${head(B.meta)}   (cured arm: ${head(C.meta)})`);
console.log(`base  : ${bf} · load ${B.meta.loadavgStart} → ${B.end?.loadavgEnd}`);
console.log(`cured : ${cf} · load ${C.meta.loadavgStart} → ${C.end?.loadavgEnd}`);
console.log(`taint : base ${B.out.map((r) => r.taint).join("/")} · cured ${C.out.map((r) => r.taint).join("/")}`);
for (const arm of [["base", B], ["cured", C]]) {
  console.log(`\n### ${arm[0]} — ${arm[1].out.length} windows`);
  console.log("| w | " + KEYS.join(" | ") + " |");
  console.log("|---|" + KEYS.map(() => "---").join("|") + "|");
  for (const r of arm[1].out) console.log(`| ${r.window} | ` + KEYS.map((k) => f1(r[k])).join(" | ") + " |");
}
console.log("\n### the deltas, each against the arms' own spreads");
console.log("| quantity | base median | base spread | cured median | cured spread | Δ median | outside both spreads |");
console.log("|---|---|---|---|---|---|---|");
for (const k of KEYS) {
  const b = B.out.map((r) => r[k]), c = C.out.map((r) => r[k]);
  const mb = med(b), mc = med(c);
  const bs = [Math.min(...b), Math.max(...b)], cs = [Math.min(...c), Math.max(...c)];
  const disjoint = bs[0] > cs[1] || cs[0] > bs[1];
  console.log(`| ${k} | ${f1(mb)} | ${f1(bs[0])}–${f1(bs[1])} | ${f1(mc)} | ${f1(cs[0])}–${f1(cs[1])} | ${f1(mc - mb)} | ${disjoint ? "YES" : "no — inside the spread"} |`);
}
