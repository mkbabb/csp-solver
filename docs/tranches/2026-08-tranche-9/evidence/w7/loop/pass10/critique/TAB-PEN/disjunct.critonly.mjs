// TAB-PEN pass 10: the DISJUNCT-sabotage battery (LAWS P8 §F), the pass-9 critic's disjunct.mjs rows
// re-pointed at the split gate (check-favicon.mjs + .self-test.mjs + .plants.mjs) plus pass 10's new
// reads. Each row edits ONE disjunct/cut/read in a copy of the gate (beside copies of its imports)
// and runs the copy's self-test with --root <tree>; a row is pinned only if the copy exits non-zero.
// A row whose edit does not apply exactly once is FAILED (a void plant), never a bite. No delete.
// usage: node disjunct.mjs <scratchDir> <treeFE>
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
const [D, FE] = process.argv.slice(2);
const FILES = ["check-favicon.mjs", "check-favicon.self-test.mjs", "check-favicon.plants.mjs", "icons.mjs", "shape-census.mjs"];
const SRC = fs.readFileSync(path.join(FE, "scripts/check-favicon.mjs"), "utf8");
const rows = [
  ["CRIT opaque: alpha < 255 -> < 128", "img.rgba.some((p) => p[3] < 255)", "img.rgba.some((p) => p[3] < 128)"],
  ["CRIT opaque: alpha < 255 -> < 1", "img.rgba.some((p) => p[3] < 255)", "img.rgba.some((p) => p[3] < 1)"],
  ["CRIT core: eroded by R -> not eroded (cov == 1)", "if (j < 0 || ras.cov[j] !== 1) core[i] = 0;", "if (ras.cov[i] !== 1) core[i] = 0;"],
  ["CRIT coverage clamp removed", "const got = Math.min(1, Math.max(0, a));", "const got = a;"],
  ["CRIT projection: 3-channel mean -> green only", "const a = [0, 1, 2].reduce((s, c) => s + (P[c] - px[c]) / (P[c] - I[c]), 0) / 3;", "const a = (P[1] - px[1]) / (P[1] - I[1]);"],
  ["CRIT paper skip: same(px,P) short-circuit removed", "if (!near[i] && !same(px, P))", "if (!near[i])"],
  ["unmodified copy (control)", null, null],
];
const out = [];
for (const [name, from, to] of rows) {
  const dir = path.join(D, name.replace(/[^A-Za-z0-9]+/g, "_"), "scripts");
  fs.mkdirSync(dir, { recursive: true });
  for (const f of FILES) fs.copyFileSync(path.join(FE, "scripts", f), path.join(dir, f));
  const n = from ? SRC.split(from).length - 1 : 0;
  if (from && n !== 1) {
    out.push(`FAILED (edit matched ${n}x) | ${name}`);
    continue;
  }
  fs.writeFileSync(path.join(dir, "check-favicon.mjs"), from ? SRC.replace(from, to) : SRC);
  const r = spawnSync("node", [path.join(dir, "check-favicon.self-test.mjs"), "--root", FE], { encoding: "utf8" });
  const why = (r.stdout + r.stderr).split("\n").filter((l) => /FAILED|gate is RED/.test(l)).slice(0, 3).map((l) => l.trim());
  const bite = from ? r.status !== 0 : r.status === 0;
  out.push(`${from ? (bite ? "BITE" : "HOLE") : bite ? "CTRL OK" : "CTRL BAD"} exit ${r.status} | ${name}${why.length ? `\n      ${why.join("\n      ")}` : ""}`);
}
fs.writeFileSync(path.join(D, "disjunct.critonly.txt"), `${out.join("\n")}\n`);
console.log(out.join("\n"));
