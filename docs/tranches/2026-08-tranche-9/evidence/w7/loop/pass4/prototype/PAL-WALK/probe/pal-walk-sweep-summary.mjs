import { readFileSync } from "node:fs";
const log = readFileSync(process.argv[2], "utf8");
const rows = [...log.matchAll(/\[(\w+)\/(\w+)\] shipped band ([\d.]+) i=(\d+): isTheRing (\w+) \(Δ to computed ([\d.]+|Infinity)\) · painted ([\d.]+):1 over its own fill · (\d+) samples · sensitivity (.*?) · (?:path|clip)/g)];
const by = {};
for (const m of rows) {
  const k = `${m[1]}/${m[2]} band ${m[3]}`;
  (by[k] ??= []).push({ i: +m[4], ok: m[5] === "true", d: +m[6], r: +m[7], sens: m[9] });
}
for (const [k, v] of Object.entries(by)) {
  const w = v.reduce((a, b) => (b.r < a.r ? b : a));
  const under = v.filter((x) => x.r < 3).length;
  const notRing = v.filter((x) => !x.ok).length;
  const maxD = Math.max(...v.map((x) => x.d));
  const s50 = v.map((x) => +(x.sens.match(/50%: worst ([\d.]+)/)?.[1] ?? NaN));
  const f50 = v.map((x) => { const m = x.sens.match(/50%: worst [\d.—]+ · (\d+)\/(\d+) under 3/); return m ? +m[1] / +m[2] : NaN; });
  const s90 = v.map((x) => +(x.sens.match(/90%: worst ([\d.]+)/)?.[1] ?? NaN));
  console.log(`${k}: ${v.length} hands photographed · core worst ${w.r.toFixed(3)} at i=${w.i} · ${under} under 3.0 · isTheRing false ${notRing} · max Δ to computed ${maxD.toFixed(1)} · flank@50% worst ${Math.min(...s50).toFixed(3)}, mean share of scans <3 ${(100 * f50.reduce((a, b) => a + b, 0) / f50.length).toFixed(1)}% · @90% worst ${Math.min(...s90).toFixed(3)}`);
}
