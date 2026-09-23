// G-TOGGLE summary — runs/*.json → grouped ranges per cell (tree · engine · viewport · pointer · cold/warm · mode)
// node sum.mjs <prefix-regex> [out.json]
import { readdirSync, writeFileSync } from "node:fs";
import { analyze } from "./an.mjs";
const re = new RegExp(process.argv[2] || "^[tpir]-");
const files = readdirSync("runs").filter((f) => re.test(f) && f.endsWith(".json")).sort();
const rows = [];
for (const f of files) {
  const a = analyze("runs/" + f);
  const tree = /^[a-z]-base/.test(f) ? "control" : f.split("-")[1];
  for (const r of a.runs) rows.push({ file: f, tree, engine: a.engine, vp: a.vp, ptr: a.touch ? "coarse" : "fine", boot: a.scheme, prm: a.prm, mode: a.mode, cold: r.label === "flip0" || (r.label === "flip1" && a.scheme === "light" ? false : false) ? "cold" : "warm", ...r });
}
// cold = the first flip into the non-boot theme (flip0); flip1 back into the boot theme is warm
for (const r of rows) r.cold = r.label === "flip0" ? "cold" : "warm";
const g = {};
for (const r of rows) (g[`${r.tree} · ${r.engine} · ${r.vp} ${r.ptr} · ${r.cold}${r.prm ? " · PRM" : ""}${r.mode !== "plain" ? " · " + r.mode : ""}`] ||= []).push(r);
const rng = (v) => { v = v.filter((x) => x != null && !Number.isNaN(x)); if (!v.length) return "—"; const lo = Math.min(...v), hi = Math.max(...v); return lo === hi ? `${lo}` : `${lo}–${hi}`; };
const cnt = (x) => (typeof x === "string" ? +x.split("f")[0] : x || 0);
const summary = [];
for (const [k, a] of Object.entries(g).sort()) {
  const s = {
    cell: k, n: a.length,
    maxFrame: rng(a.map((o) => o.frameMs.max)), over34: rng(a.map((o) => o.over.f34)), over16: rng(a.map((o) => o.over.f16)),
    G1both: a.map((o) => cnt(o.G1.bothLive)).join("/"), G1dbl: a.map((o) => cnt(o.G1.dbl)).join("/"), G1trans: rng(a.map((o) => o.G1.translucent)),
    born: rng(a.map((o) => o.born && o.born.s)), dS: rng(a.map((o) => o.dS)), outLast: rng(a.map((o) => o.out && o.out.s)),
    halfOut: rng(a.map((o) => o.G2.half && o.G2.half.out)), crestMinusLand: rng(a.map((o) => o.G2.crestMinusLanding)), handoffMinusLand: rng(a.map((o) => o.G2.handoffMinusLanding)),
    G3lead: rng(a.map((o) => o.G3.accentLead)), G3blot: rng(a.map((o) => o.G3.blot)), G3outOp: rng(a.map((o) => o.G3.outOpNot1)),
    gridMin: rng(a.map((o) => o.G4.grid && o.G4.grid.min)), gridU3: a.map((o) => (o.G4.grid ? cnt(o.G4.grid.under3) : "·")).join("/"),
    digMin: rng(a.map((o) => o.G4.digit && o.G4.digit.min)), digU3: a.map((o) => (o.G4.digit ? cnt(o.G4.digit.under3) : "·")).join("/"),
    gridSwap: rng(a.map((o) => o.G4.gridSwapAt)), digSwap: rng(a.map((o) => o.G4.digSwapAt)), bwStart: rng(a.map((o) => o.G4.bwChangeAt)), digDistinct: rng(a.map((o) => o.G4.digDistinct)), bwDistinct: rng(a.map((o) => o.G4.bwDistinct)),
    fieldStepsIn: rng(a.map((o) => o.G6.in.steps)), fieldStepsOut: rng(a.map((o) => o.G6.out.steps)), visInMs: rng(a.map((o) => o.G6.in.visibleMs)),
    settleS: rng(a.map((o) => o.G7.settle && o.G7.settle.liveS)), settleT: rng(a.map((o) => o.G7.settle && o.G7.settle.t)), handoffFieldMatch: a.map((o) => (o.G7.settle ? (o.G7.settle.liveF.endsWith(`p${o.G7.settle.restPose})`) ? "y" : "n") : "·")).join(""),
    stillSame: a.map((o) => (o.G7.still ? (o.G7.still.same ? "y" : "n") : "·")).join(""), btnAfter: [...new Set(a.map((o) => o.G7.still && o.G7.still.btnTransform))].join(" "),
    darkAt: rng(a.map((o) => o.G10.darkAt)), clock: [...new Set(a.map((o) => o.G10.clock))].join(), bakes: rng(a.map((o) => o.bakes)),
  };
  summary.push(s);
  console.log(`| ${k} | n${s.n} | max ${s.maxFrame} >34 ${s.over34} | both ${s.G1both} dbl ${s.G1dbl} trans ${s.G1trans} | born ${s.born} dS ${s.dS} outLast ${s.outLast} | half-out ${s.halfOut} crest-land ${s.crestMinusLand} hand-land ${s.handoffMinusLand} | lead ${s.G3lead} blot ${s.G3blot} | grid ${s.gridMin} u3 ${s.gridU3} dig ${s.digMin} u3 ${s.digU3} swap g${s.gridSwap}/d${s.digSwap} bw${s.bwStart} | fields in ${s.fieldStepsIn} out ${s.fieldStepsOut} | settle ${s.settleS}@${s.settleT} fm ${s.handoffFieldMatch} still ${s.stillSame} | dark@${s.darkAt} (${s.clock}) | bakes ${s.bakes} |`);
}
if (process.argv[3]) writeFileSync(process.argv[3], JSON.stringify(summary, null, 1));
