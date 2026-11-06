// crit-TAB-PEN pass 10: the band the two max-dE masks leave unread (near ∖ core) — plants read by the
// gate AND by icons --check side by side. usage: node crit10-plants.mjs <plantsDir> <treeFE>
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
const [D, FE] = process.argv.slice(2);
const GATE = path.join(FE, "scripts/check-favicon.mjs");
const G = await import(pathToFileURL(process.argv[4] ?? GATE).href); // the masks: this gate, or the one named (a gate without raster/CUTS exports)
const { PEN, ARM, WIDTH } = await import(pathToFileURL(path.join(FE, "scripts/icons.mjs")).href);
const sharp = createRequire(path.join(FE, "package.json"))("sharp");
const sha = (b) => createHash("sha256").update(b).digest("hex");
const png0 = fs.readFileSync(path.join(FE, "public/apple-touch-icon.png"));
const raw0 = await sharp(png0).removeAlpha().raw().toBuffer();
const N = 180;
const ras = G.raster(PEN[ARM], WIDTH);
const R = G.CUTS["e.png-reach"];
const near = new Uint8Array(N * N), core = new Uint8Array(N * N).fill(1);
for (let i = 0; i < N * N; i++) for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
  const [x, y] = [(i % N) + dx, Math.floor(i / N) + dy];
  const j = x >= 0 && y >= 0 && x < N && y < N ? y * N + x : -1;
  if (ras.cov[i] > 0 && j >= 0) near[j] = 1;
  if (j < 0 || ras.cov[j] !== 1) core[i] = 0;
}
const P = [raw0[0], raw0[1], raw0[2]];
let ci = core.indexOf(1); const I = [raw0[ci * 3], raw0[ci * 3 + 1], raw0[ci * 3 + 2]];
const d = P.map((p, c) => p - I[c]);
const band = [...Array(N * N).keys()].filter((i) => near[i] && !core[i]);
const cl = (v) => Math.max(0, Math.min(255, Math.round(v)));
const put = (b, i, rgb) => b.set(rgb.map(cl), i * 3);
const at = (k) => P.map((p, c) => p - k * d[c]); // coverage k on the paper, neutral
const chroma = (s, w) => [s * d[0] * w[0], s * d[1] * w[1], s * d[2] * w[2]]; // Σ w = 0 keeps the projection
const plants = [
  ["NN0 the shipped pixels re-encoded: must stay GREEN", (b) => b],
  ["C1 chromatic fringe: every band pixel shifted (+.3d0,-.3d1,0) at its own coverage (red-green fringe)", (b) => { for (const i of band) put(b, i, at(ras.cov[i]).map((v, c) => v - chroma(0.3, [1, -1, 0])[c])); return b; }],
  ["C1b the same fringe, opposite sign (-.3d0,0,+.3d2)", (b) => { for (const i of band) put(b, i, at(ras.cov[i]).map((v, c) => v - chroma(0.3, [-1, 0, 1])[c])); return b; }],
  ["C2 black outline: every full-coverage pixel outside the core painted rgb(0,0,0)", (b) => { for (const i of band) if (ras.cov[i] === 1) put(b, i, [0, 0, 0]); return b; }],
  ["C3 a grey halo: every band pixel the pen does not touch at coverage 0.49", (b) => { for (const i of band) if (ras.cov[i] === 0) put(b, i, at(0.49)); return b; }],
  ["C4 bolder: every band pixel at min(1, cov + 0.49)", (b) => { for (const i of band) put(b, i, at(Math.min(1, ras.cov[i] + 0.49))); return b; }],
  ["C5 red outline: every full-coverage band pixel at rgb(200,0,0)", (b) => { for (const i of band) if (ras.cov[i] === 1) put(b, i, [200, 0, 0]); return b; }],
];
const out = [`paper ${P} ink(core) ${I} band ${band.length} px (near ${near.reduce((s, v) => s + v, 0)}, core ${core.reduce((s, v) => s + v, 0)})`];
for (const [name, fn] of plants) {
  const dir = path.join(D, name.split(" ")[0]);
  fs.mkdirSync(dir, { recursive: true });
  for (const f of ["src", "public", "scripts", "index.html", "package.json"]) fs.cpSync(path.join(FE, f), path.join(dir, f), { recursive: true });
  const raw = fn(Buffer.from(raw0));
  let maxd = 0, nchg = 0; for (let i = 0; i < N * N * 3; i += 3) { const m = Math.max(...[0, 1, 2].map((c) => Math.abs(raw[i + c] - raw0[i + c]))); if (m) nchg++; maxd = Math.max(maxd, m); }
  const png = await sharp(raw, { raw: { width: N, height: N, channels: 3 } }).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(dir, "public/apple-touch-icon.png"), png);
  const provF = path.join(dir, "scripts/icons.provenance.json");
  const prov = JSON.parse(fs.readFileSync(provF, "utf8")); prov["apple-touch-icon.png"] = sha(png);
  fs.writeFileSync(provF, `${JSON.stringify(prov, null, 2)}\n`);
  if (!fs.existsSync(path.join(dir, "node_modules"))) fs.symlinkSync(path.join(FE, "node_modules"), path.join(dir, "node_modules"));
  const r = spawnSync("node", [GATE, "--root", dir], { encoding: "utf8" });
  const ic = spawnSync("node", [path.join(dir, "scripts/icons.mjs"), "--check"], { encoding: "utf8", cwd: dir });
  const reds = (r.stdout + r.stderr).split("\n").filter((l) => /^\s+[a-z]\.[\w-]+:|readings:/.test(l)).map((l) => l.trim().slice(0, 260));
  out.push(`${r.status === 0 ? "GREEN" : "RED  "} gate exit ${r.status} · icons --check exit ${ic.status} | ${name} | ${nchg} px moved, max channel Δ ${maxd}\n      ${reds.join("\n      ")}\n      ${(ic.stdout + ic.stderr).trim()}`);
}
fs.writeFileSync(path.join(D, "crit10-plants.txt"), `${out.join("\n")}\n`);
console.log(out.join("\n"));
