import { readFileSync } from "node:fs";
const f = process.argv[2]; const o = JSON.parse(readFileSync(f, "utf8"));
console.log("engine", o.engine, "err", o.err ?? "-");
for (const r of o.rows) {
  if (r.m === "push") console.log(`push ${r.arm} ${r.rig} ${r.scheme} | before spent=${r.before.spent} a=${r.before.alpha} ${r.before.oneColor} | movers ${r.movers.length}: ${r.movers.map((m) => `[${m.cls.slice(0, 40)}] kf0=${m.kf0c} kf1=${m.kf1c}`).join(" ; ")} | sampled frames ${r.sampled.frames} animated ${r.sampled.animatedFrames} maxAlpha ${r.sampled.maxAlphaWhileAnimated} first ${r.sampled.firstAnimated} | after "${r.after.one}"/"${r.after.two}"`);
  if (r.m === "land") console.log(`land ${r.rig} regime ${JSON.stringify(r.regime)} | two ${JSON.stringify(r.two)} | bytes ${JSON.stringify(r.bytes)} shNone ${r.shNone} | control sh ${r.control.sh} lines "${r.control.lines.one}"/"${r.control.lines.two}" | ariaTwoNamed ${r.ariaTwoNamed} | aria ${JSON.stringify(r.aria)} | ctl aria ${JSON.stringify(r.control.aria)}`);
  if (r.m === "aa") console.log(`aa ${r.rig} ${r.scheme} ${r.arm} spent=${r.lines.spent} ${r.lines.color} | ${typeof r.glyph === "string" ? r.glyph : `px ${r.glyph.glyphPx} noise ${r.glyph.noise} gate ${JSON.stringify(r.glyph.gate)} s0.9 ${JSON.stringify(r.glyph.sens["0.9"])}`}`);
  if (r.m === "pi") console.log(`pi ${r.rig} ${r.pose} lines hold "${r.lines.hold.one}"/"${r.lines.hold.two}" control "${r.lines.control.one}"/"${r.lines.control.two}" | H-vs-C ${JSON.stringify(r.holdVsControl)} | C-vs-C ${JSON.stringify(r.controlVsControl)}`);
}
