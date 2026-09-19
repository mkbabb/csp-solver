// RUN: node pi-compare.mjs <base.jsonl> <cured.jsonl>
//
// T9-W8 §8.2 cure C01 — THE π VERDICT, read off two `pose-hash.mjs` runs.
//
// A surface's encodes are grouped into ROUNDS by toBlob START time (`t0`), four to a round:
// the four encodes of one round complete INTERLEAVED with the next round's, so splitting on
// arrival order mixes them and makes two identical rounds read as unequal. Each round is then
// a SET of SHA-256 digests — pose order inside a stack is the boil scheduler's, not the bake's.
//
// The obligation: the cured arm's one round equals the base arm's LAST round, the one whose
// bitmaps the estate renders today.
import { readFileSync } from "node:fs";
const load = (f) => {
  const L = readFileSync(f, "utf8").trim().split("\n").map((l) => JSON.parse(l));
  return { meta: L.find((x) => x.k === "meta"), windows: L.filter((x) => x.k === "window"),
    end: L.find((x) => x.k === "end") };
};
const POSES = 4;
const key = (arr) => JSON.stringify([...arr].sort());
const rounds = (rows) => {
  const out = [];
  for (let i = 0; i < rows.length; i += POSES) out.push(rows.slice(i, i + POSES));
  return out;
};
const short = (r) => r.map((x) => (x.sha256 || "null").slice(0, 8)).join(" ");
const [bf, cf] = process.argv.slice(2);
const B = load(bf), C = load(cf);
const line = (m) => `${m.engine} · ${m.cpuThrottle}× · ${m.net} · ${m.cache} · ${m.vp} dpr${m.dpr} · ${m.base}`;
console.log(`base  : ${line(B.meta)}`);
console.log(`cured : ${line(C.meta)}`);
console.log(`load  : base ${B.meta.loadavgStart} → ${B.end?.loadavgEnd} · cured ${C.meta.loadavgStart} → ${C.end?.loadavgEnd}`);
console.log(`taint : base ${B.windows.map((w) => w.taint).join("/")} · cured ${C.windows.map((w) => w.taint).join("/")}`);
const surfaces = new Set();
for (const w of [...B.windows, ...C.windows]) for (const s of Object.keys(w.surf)) surfaces.add(s);
let ok = true;
for (const s of [...surfaces].sort()) {
  console.log(`\n## ${s}`);
  const dump = (tag, W) => {
    const sets = [];
    for (const w of W) {
      const k = w.surf[s];
      if (!k) { console.log(`  ${tag} w${w.window}: ABSENT`); sets.push(null); continue; }
      const rs = rounds(k.rows);
      const desc = rs.map((r, i) => `r${i + 1}@${r[0].w}px t0 ${r[0].t0}→${r[r.length - 1].t1} [${short(r)}]`).join("  |  ");
      console.log(`  ${tag} w${w.window}: ${k.encodes} encodes · ${desc}`);
      if (rs.length > 1)
        console.log(`  ${tag}   rounds byte-identical as SETS: ${rs.every((r) => key(r.map((x) => x.sha256)) === key(rs[0].map((x) => x.sha256)))}`);
      sets.push(key(rs[rs.length - 1].map((x) => x.sha256)));
    }
    return sets;
  };
  const bs = dump("base ", B.windows), cs = dump("cured", C.windows);
  const bU = [...new Set(bs.filter(Boolean))], cU = [...new Set(cs.filter(Boolean))];
  const stable = bU.length === 1 && cU.length === 1;
  const eq = stable && bU[0] === cU[0];
  console.log(`  VERDICT: base last-round stable ${bU.length === 1} · cured stable ${cU.length === 1} · cured == base LAST round ${eq}`);
  if (!eq) ok = false;
}
console.log(`\nπ: ${ok ? "HOLDS — every surface's shown stack is byte-identical, pose for pose, to the round the estate keeps today" : "BROKEN — see the surfaces above"}`);
process.exitCode = ok ? 0 : 1;
