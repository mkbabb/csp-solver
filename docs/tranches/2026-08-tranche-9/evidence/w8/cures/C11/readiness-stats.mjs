// RUN: node readiness-stats.mjs raw/<tag> [...]   — reduces the interleaved A6 rows per arm.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
const med = (a) => { if (!a.length) return NaN; const s=[...a].sort((x,y)=>x-y); const m=s.length>>1;
  return s.length%2?s[m]:(s[m-1]+s[m])/2; };
const f = (n) => (Number.isFinite(n) ? n.toFixed(1) : "—");
const rng = (a) => (a.length ? `${f(Math.min(...a))}–${f(Math.max(...a))}` : "—");
const disjoint = (a,b) => Math.max(...a) < Math.min(...b) || Math.max(...b) < Math.min(...a);
const MARKS = ["firstBoilTickMs","tbt3000Ms","firstBakeMs","boardReadyMs","lcpMs","longestTaskMs",
  "busyToBoardReadyMs","rafGapProxyTbtMs","worstRafGapMs","bakeLayers","controlsInteractiveMs"];
for (const dir of process.argv.slice(2)) {
  const arms = { base: [], cured: [] };
  for (const name of readdirSync(dir).sort()) {
    if (!name.endsWith(".jsonl")) continue;
    const arm = name.startsWith("cured") ? "cured" : "base";
    for (const line of readFileSync(join(dir,name),"utf8").trim().split("\n")) {
      const row = JSON.parse(line);
      if (row.cell) arms[arm].push(row);
    }
  }
  const m0 = arms.base[0] || {};
  console.log(`\n### ${dir}\n${m0.cell} · ${m0.engine} · cpu ${m0.cpu} · ${m0.net} · ${m0.cache} · vp ${m0.vp} · base :4252 vs cured :4253 · instrument A6/readiness-timeline.mjs (primer 9000 ms, mobile webkit warm cell added)`);
  console.log("mark | base median (range) | cured median (range) | delta | disjoint");
  for (const k of MARKS) {
    const b = arms.base.map(r=>r[k]).filter(v=>Number.isFinite(v));
    const c = arms.cured.map(r=>r[k]).filter(v=>Number.isFinite(v));
    if (!b.length && !c.length) continue;
    console.log(`${k} | ${f(med(b))} (${rng(b)}) | ${f(med(c))} (${rng(c)}) | ${f(med(c)-med(b))} | ${b.length&&c.length?disjoint(b,c):"—"}`);
  }
  console.log(`windows | base ${arms.base.length} (tainted ${arms.base.filter(r=>r.tainted).length}) · cured ${arms.cured.length} (tainted ${arms.cured.filter(r=>r.tainted).length})`);
  console.log(`load first/last | ${m0.load} → ${(arms.cured[arms.cured.length-1]||{}).load}`);
}
