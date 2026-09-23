// Summarise §B sweep logs: per engine · dpr · arm, over the hands photographed.
import { readFileSync, readdirSync } from "node:fs";
const dir = process.argv[2];
const rows = [];
for (const f of readdirSync(dir).filter((n) => /^sweep-.*\.log$/.test(n)))
  for (const line of readFileSync(`${dir}/${f}`, "utf8").split("\n")) {
    const m = line.match(/^\[(\w+)\/(light|dark)\] dpr (\d) band ([\d.]+) i=(\d+): isTheRing (\w+).*CORE px (\d+) max ([\d.]+) p30 ([\d.]+) median ([\d.]+) frac<3 ([\d.]+)% noise (\d+) · scan core ([\d.]+) · sensitivity (.*?) · path/);
    if (m) rows.push({ eng: m[1], arm: m[2], dpr: +m[3], band: m[4], i: +m[5], ring: m[6] === "true", px: +m[7], max: +m[8], p30: +m[9], med: +m[10], frac: +m[11], noise: +m[12], scan: +m[13], sens: m[14] });
  }
const key = (r) => `${r.eng} · dpr ${r.dpr} · ${r.arm} (band ${r.band})`;
const groups = new Map();
for (const r of rows) groups.set(key(r), [...(groups.get(key(r)) ?? []), r]);
for (const [k, g] of [...groups].sort()) {
  const by = (f) => g.reduce((a, b) => (f(b) < f(a) ? b : a));
  const wm = by((r) => r.med), wp = by((r) => r.p30), wx = by((r) => r.max), ws = by((r) => r.scan);
  const fr = g.reduce((a, b) => (b.frac > a.frac ? b : a));
  const worst5 = [...g].sort((a, b) => a.med - b.med).slice(0, 5).map((r) => `${r.i}:${r.med.toFixed(3)}`).join(" ");
  console.log(`${k} · n ${g.length} (isTheRing false ${g.filter((r) => !r.ring).length}) · core MEDIAN worst ${wm.med.toFixed(3)} (i=${wm.i}) · under 3.10 ${g.filter((r) => r.med < 3.1).length} · under 3.0 ${g.filter((r) => r.med < 3.0).length} · p30 worst ${wp.p30.toFixed(3)} (i=${wp.i}) · max worst ${wx.max.toFixed(3)} (i=${wx.i}) · frac<3 worst ${fr.frac}% (i=${fr.i}) · mean frac<3 ${(g.reduce((a, b) => a + b.frac, 0) / g.length).toFixed(1)}% · scan-core worst ${ws.scan.toFixed(3)} (i=${ws.i}) · five hardest by median ${worst5}`);
}
