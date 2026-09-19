// RUN: node rtstats.mjs <base.jsonl> <cured.jsonl>
// T9-W8 §8.2 cure C03 — medians and spreads out of A6's readiness rows. Tainted windows named
// and excluded. `firstBoilTickMs` is B1's boardDrawn mark, read through the corrected selector.
import { readFileSync } from "node:fs";
const med = (a) => { const s = [...a].sort((x, y) => x - y); const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const f = (x) => (x == null || Number.isNaN(x) ? "—" : (+x).toFixed(1));
const KEYS = ["fcpMs", "lcpMs", "boardReadyMs", "firstBakeMs", "firstBoilTickMs", "tbt3000Ms",
  "longestTaskMs", "rafGapsOver33", "worstRafGapMs", "rafGapProxyTbtMs", "bakeLayers"];
function load(file) {
  const rows = readFileSync(file, "utf8").trim().split("\n").map((l) => JSON.parse(l)).filter((r) => r.cell);
  for (const r of rows) if (r.tainted) console.log(`  EXCLUDED ${r.cell} w${r.window}: ${JSON.stringify(r.taint)}`);
  return rows.filter((r) => !r.tainted);
}
const [bf, cf] = process.argv.slice(2);
console.log("exclusions:"); const B = load(bf), C = load(cf);
console.log(`cell ${B[0]?.cell} · ${B[0]?.engine} · ${B[0]?.cpu}× · ${B[0]?.net} · ${B[0]?.cache} · vp ${B[0]?.vp}`);
console.log(`load base ${B[0]?.load} → ${B[B.length-1]?.load} · cured ${C[0]?.load} → ${C[C.length-1]?.load}`);
console.log(`n: base ${B.length}, cured ${C.length}`);
console.log("| quantity | base median | base spread | cured median | cured spread | Δ | outside both spreads |");
console.log("|---|---|---|---|---|---|---|");
for (const k of KEYS) {
  const b = B.map((r) => r[k]).filter((x) => x != null), c = C.map((r) => r[k]).filter((x) => x != null);
  if (!b.length || !c.length) { console.log(`| ${k} | — | NOT MEASURED | — | — | — | — |`); continue; }
  const bs = [Math.min(...b), Math.max(...b)], cs = [Math.min(...c), Math.max(...c)];
  console.log(`| ${k} | ${f(med(b))} | ${f(bs[0])}–${f(bs[1])} | ${f(med(c))} | ${f(cs[0])}–${f(cs[1])} | ${f(med(c) - med(b))} | ${bs[0] > cs[1] || cs[0] > bs[1] ? "YES" : "no — inside the spread"} |`);
}
