// RUN: node toggle-stats.mjs <raw/tag dir>
//
// T9-W8 §8.2 cure C02 — per-window quantities out of A5's `toggle-probe.mjs` raws, so a delta
// can be read against the arms' own SPREAD rather than against a median alone. A delta inside
// the spread is not a move; this prints both so the reader can say which it is.
//
// deltaMs        — B2's mark: N1 − median(N2..N4) click→settle. The whole cure, as one number.
// n1SettleMs     — N1 alone, and n2..n4 beside it, so the delta can be checked by eye.
// n1Bakes        — B2's other term: the toBlob count between the first click and its settle.
// n1WhirlFrames  — rAF frames in the Bloom's ~1,010 ms. The charter: N1 ≈ N2's count.
// n1WhirlLong33 / n1WhirlWorstMs — the frames that starved, and the worst of them.
// boardReadyMs   — the boot mark the warm may not move (it runs after `boardDrawn`).
// bootBakes      — encodes up to boardReady + 2,500 ms: the warm's own cost, where it lands.
// bootLongTaskMs — Σ longtask over that same window (chromium only).
// n1RecalcMs     — the G8 restyle the whirl carries, re-read after the cure as the charter asks.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const med = (a) => {
  const s = [...a].sort((x, y) => x - y);
  const n = s.length;
  return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : null;
};
const f1 = (x) => (x == null ? "—" : (+x).toFixed(1));

function arm(dir, prefix) {
  const files = readdirSync(dir).filter((f) => f.startsWith(prefix) && f.endsWith(".jsonl")).sort();
  const out = [];
  let meta = null;
  for (const f of files) {
    const L = readFileSync(join(dir, f), "utf8").trim().split("\n").map((l) => JSON.parse(l));
    const w = L.find((x) => !x.SUMMARY);
    if (!w) continue;
    meta ??= {
      engine: w.engine, throttle: w.throttle, viewport: w.viewport, net: w.net,
      cache: w.cache, dpr: w.dpr, startTheme: w.startTheme,
      longtask: w.longtaskSupported, boardReadySel: w.boardReadySel,
    };
    const inv = w.invocations;
    const later = med(inv.slice(1).map((i) => i.clickToSettleMs));
    out.push({
      file: f,
      deltaMs: +(inv[0].clickToSettleMs - later).toFixed(1),
      n1SettleMs: inv[0].clickToSettleMs,
      n234SettleMs: +later.toFixed(1),
      n1Bakes: inv[0].bakeCount,
      n1WhirlFrames: inv[0].whirlFrames,
      n1WhirlLong33: inv[0].whirlLong33,
      n1WhirlWorstMs: inv[0].whirlWorstMs,
      n1LongTaskMs: inv[0].longTaskMs,
      n1RecalcMs: inv[0].cdp ? inv[0].cdp.recalcStyleMs : null,
      boardReadyMs: w.boardReadyMs,
      bootBakes: w.bootBakeCount,
      bootLongTaskMs: w.bootLongTaskMs,
      tainted: inv.some((i) => i.tainted) ? 1 : 0,
    });
  }
  return { meta, out };
}

const KEYS = [
  "deltaMs", "n1SettleMs", "n234SettleMs", "n1Bakes", "n1WhirlFrames", "n1WhirlLong33",
  "n1WhirlWorstMs", "n1LongTaskMs", "n1RecalcMs", "boardReadyMs", "bootBakes", "bootLongTaskMs",
];
const dir = process.argv[2];
const B = arm(dir, "base-");
const C = arm(dir, "cured-");
const head = (m) => (m ? `${m.engine} · ${m.throttle} · ${m.net} · ${m.cache} · ${m.viewport} dpr${m.dpr} · boot ${m.startTheme}` : "—");
console.log(`regime: ${head(B.meta)}`);
console.log(`cured : ${head(C.meta)}`);
console.log(`cell  : ${B.meta?.boardReadySel} · longtask ${B.meta?.longtask}`);
for (const [tag, A] of [["base", B], ["cured", C]]) {
  console.log(`\n### ${tag} — ${A.out.length} windows`);
  console.log("| w | " + KEYS.join(" | ") + " | tainted |");
  console.log("|---|" + KEYS.map(() => "---").join("|") + "|---|");
  for (const r of A.out)
    console.log(`| ${r.file.replace(/\.jsonl$/, "")} | ` + KEYS.map((k) => f1(r[k])).join(" | ") + ` | ${r.tainted} |`);
}
console.log("\n### the deltas, each against the arms' own spreads");
console.log("| quantity | base median | base spread | cured median | cured spread | Δ median | outside both spreads |");
console.log("|---|---|---|---|---|---|---|");
for (const k of KEYS) {
  const b = B.out.map((r) => r[k]).filter((x) => x != null);
  const c = C.out.map((r) => r[k]).filter((x) => x != null);
  if (!b.length || !c.length) { console.log(`| ${k} | — | — | — | — | — | — |`); continue; }
  const mb = med(b), mc = med(c);
  const bs = [Math.min(...b), Math.max(...b)], cs = [Math.min(...c), Math.max(...c)];
  const disjoint = bs[0] > cs[1] || cs[0] > bs[1];
  console.log(`| ${k} | ${f1(mb)} | ${f1(bs[0])}–${f1(bs[1])} | ${f1(mc)} | ${f1(cs[0])}–${f1(cs[1])} | ${f1(mc - mb)} | ${disjoint ? "YES" : "no — inside the spread"} |`);
}
