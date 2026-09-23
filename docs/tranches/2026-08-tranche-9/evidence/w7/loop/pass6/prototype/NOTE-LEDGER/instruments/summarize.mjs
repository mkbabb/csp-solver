// NOTE-LEDGER pass 6 — classify every p6-*.json the probe banked into the README's rows.
// Usage: node summarize.mjs <logs dir>
import { readdirSync, readFileSync } from "node:fs";
const D = process.argv[2];
const f2 = (v) => (v == null ? "—" : Number(v).toFixed(2));
for (const f of readdirSync(D).filter((x) => /^p6-(hold|age|step|tint|timed)-/.test(x)).sort()) {
  const j = JSON.parse(readFileSync(`${D}/${f}`, "utf8"));
  console.log(`\n## ${f} · ${j.engine} · ${j.arm} · ${j.protoId}${j.err ? " · ERR " + j.err : ""}`);
  for (const r of j.rows) {
    if (r.m === "push") {
      const mv = r.movers.map((m) => `kf0{${m.kf0.transform} · ${m.kf0.color}} kf1.color ${m.kf1.color} lineOne ${m.lineOne?.w}×${m.lineOne?.h}`).join(" ; ");
      console.log(`push ${r.rig} ${r.scheme} ${r.pose} | before: "${r.beforeNext.one}" spent=${r.beforeNext.spent} ${r.beforeNext.oneColor} | after: "${r.after.one}" / "${r.after.two}" | movers ${r.movers.length} ${mv}`);
    } else if (r.m === "pi" || r.m === "rest") {
      const a = r.protoVsControl, c = r.controlVsControl;
      console.log(`${r.m} ${r.rig} ${r.pose ?? ""} | proto-vs-ctrl n=${a.lenA}/${a.lenB} rect ${a.rect} paint ${a.paint} keys ${a.keys} sh ${a.sh} filters ${a.filters} ${a.ex.length ? JSON.stringify(a.ex).slice(0, 200) : ""} | ctrl-vs-ctrl rect ${c.rect} paint ${c.paint} keys ${c.keys}`);
    } else if (r.m === "land") {
      console.log(`land ${r.rig} regime ${JSON.stringify(r.regime)} | two "${r.lines.two}" box ${JSON.stringify(r.lines.twoBox)} clip ${r.geo.clip} | block ${r.geo.block} two ${r.geo.two} | sh ${r.geo.sh} (display:none ${r.scrollHeightWithDisplayNone}) | aria names line two: ${r.ariaTwoNamed} | bytes clipped-vs-removed ${r.bytes.clippedVsRemoved} self-noise ${r.bytes.selfNoise} of ${r.bytes.px}`);
      console.log(`   aria: ${JSON.stringify(r.ariaWithTwo)}`);
    } else if (r.m === "land-control") {
      console.log(`land-control ${r.rig} sh ${r.sh} aria ${JSON.stringify(r.aria)}`);
    } else if (r.m === "aa") {
      if (r.skipped) { console.log(`aa ${r.rig} ${r.scheme} ${r.arm} SKIPPED ${r.skipped}`); continue; }
      const g = r.glyph;
      console.log(`aa ${r.rig}@${r.dpr} ${r.scheme} ${r.arm} "${r.lines.one}" spent=${r.lines.spent} ${g.spec} | glyphPx ${g.glyphPx} noise ${g.noise} | cov≥.5 n ${g.gate.n} median ${g.gate.median} frac<4.5 ${g.gate.fraction} min ${g.gate.min} | ≥.7 ${g.sens["0.7"].median}/${g.sens["0.7"].fraction} | ≥.9 ${g.sens["0.9"].median}/${g.sens["0.9"].fraction}`);
    } else if (r.m === "frame") console.log(`frame ${r.pose} ${r.scheme} "${r.lines.one}" / "${r.lines.two}" spent=${r.lines.spent}`);
    else if (r.m === "desk") console.log(`desk P4 "${r.lines.one}" / "${r.lines.two}" gap ${f2(r.gap)} px`);
    else if (r.m === "watch") console.log(`watch cells ${r.cells} writes ${r.writes} watchMs ${JSON.stringify(r.watchMs)} joinMs(mean of 1000) ${JSON.stringify(r.joinMsMeanOf1000)}`);
    else console.log(JSON.stringify(r).slice(0, 300));
  }
}
