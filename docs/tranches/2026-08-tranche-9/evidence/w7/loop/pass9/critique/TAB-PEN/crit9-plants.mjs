// TAB-PEN pass-9 critic: the tie's CLASS plants (marks the path does not explain that are NOT an
// opaque square) against the bank's final gate. Each plant is a fresh copy of the bank's inputs read
// through --root; the sidecar is re-stamped (the sidecar is only the PNG's own sha). No delete.
// usage: node crit9-plants.mjs <plantsDir> <treeFE>
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
const [D, FE] = process.argv.slice(2);
const GATE = path.join(FE, "scripts/check-favicon.mjs");
const sharp = createRequire(path.join(FE, "package.json"))("sharp");
const sha = (b) => createHash("sha256").update(b).digest("hex");
const png0 = fs.readFileSync(path.join(FE, "public/apple-touch-icon.png"));
const raw0 = await sharp(png0).removeAlpha().raw().toBuffer();
const N = 180;
const px = (b, x, y) => [b[(y * N + x) * 3], b[(y * N + x) * 3 + 1], b[(y * N + x) * 3 + 2]];
const PAPER = px(raw0, 0, 0);
let dark = 0;
for (let i = 1; i < N * N; i++) if (raw0[i * 3] + raw0[i * 3 + 1] + raw0[i * 3 + 2] < raw0[dark * 3] + raw0[dark * 3 + 1] + raw0[dark * 3 + 2]) dark = i;
const INK = [raw0[dark * 3], raw0[dark * 3 + 1], raw0[dark * 3 + 2]];
const isPaper = (b, x, y) => px(b, x, y).every((v, c) => Math.abs(v - PAPER[c]) <= 1);
// the largest all-paper square anchor near (x0,y0) of side n
function paperSquare(n) {
  for (const [x0, y0] of [[4, 4], [N - 4 - n, 4], [4, N - 4 - n], [N - 4 - n, N - 4 - n]]) {
    let ok = true;
    for (let y = y0; y < y0 + n && ok; y++) for (let x = x0; x < x0 + n && ok; x++) ok = isPaper(raw0, x, y);
    if (ok) return [x0, y0];
  }
  return null;
}
const mix = (a, k) => PAPER.map((p, c) => Math.round(p + k * (INK[c] - p)));
const plants = [
  ["NN0 the shipped pixels re-encoded (no palette): must stay GREEN", (b) => b],
  ...[[35, 0.45], [40, 0.3], [38, 0.35], [30, 0.49]].map(([n, k]) => [
    `F${n}@${k} a ${n}x${n} square at ink coverage ${k} on the paper (a mid-grey box)`,
    (b) => {
      const at = paperSquare(n);
      if (!at) throw new Error(`no paper square ${n}`);
      for (let y = at[1]; y < at[1] + n; y++) for (let x = at[0]; x < at[0] + n; x++) b.set(mix(0, k), (y * N + x) * 3);
      return b;
    },
  ]),
  ...[8, 10].map((k) => [
    `D${k} ${k} opaque 4x4 ink dots scattered on the paper (each blob 16 px)`,
    (b) => {
      let put = 0;
      for (let y = 6; y < N - 10 && put < k; y += 22) for (let x = 6; x < N - 10 && put < k; x += 22) {
        let ok = true;
        for (let yy = y - 2; yy < y + 6 && ok; yy++) for (let xx = x - 2; xx < x + 6 && ok; xx++) ok = isPaper(raw0, xx, yy);
        if (!ok) continue;
        for (let yy = y; yy < y + 4; yy++) for (let xx = x; xx < x + 4; xx++) b.set(INK, (yy * N + xx) * 3);
        put++;
      }
      if (put < k) throw new Error(`only ${put} dots`);
      return b;
    },
  ]),
  ...[[14, 0, -14], [24, 0, -24], [0, -10, 20]].map((t) => [
    `T${t.join("/")} every paper pixel but pixel 0 tinted by (${t.join(", ")}) (the paper is not the page's)`,
    (b) => {
      for (let i = 1; i < N * N; i++) {
        const [x, y] = [i % N, Math.floor(i / N)];
        if (isPaper(raw0, x, y)) b.set(PAPER.map((p, c) => Math.max(0, Math.min(255, p + t[c]))), i * 3);
      }
      return b;
    },
  ]),
  ...[[5, 15, 45], [0, 10, 70], [60, 20, 10]].map((ink) => [
    `K${ink.join("/")} the whole stroke re-inked in rgb(${ink.join(", ")}), the one darkest pixel kept`,
    (b) => {
      for (let i = 0; i < N * N; i++) {
        if (i === dark) continue;
        const p = [b[i * 3], b[i * 3 + 1], b[i * 3 + 2]];
        const a = p.reduce((s, v, c) => s + (PAPER[c] - v) / (PAPER[c] - INK[c]), 0) / 3;
        if (a <= 0.01) continue;
        b.set(PAPER.map((q, c) => Math.round(q + Math.min(1, a) * (ink[c] - q))), i * 3);
      }
      return b;
    },
  ]),
];
const out = [`paper ${PAPER} ink(darkest, index ${dark}) ${INK}`];
for (const [name, fn] of plants) {
  const dir = path.join(D, name.split(" ")[0].replace(/[^A-Za-z0-9@.]/g, "_"));
  fs.mkdirSync(dir, { recursive: true });
  for (const f of ["src", "public", "scripts", "index.html", "package.json"]) fs.cpSync(path.join(FE, f), path.join(dir, f), { recursive: true });
  let raw; try { raw = fn(Buffer.from(raw0)); } catch (e) { out.push(`FAILED (plant not built: ${e.message}) | ${name}`); continue; }
  const png = await sharp(raw, { raw: { width: N, height: N, channels: 3 } }).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(dir, "public/apple-touch-icon.png"), png);
  const provF = path.join(dir, "scripts/icons.provenance.json");
  const prov = JSON.parse(fs.readFileSync(provF, "utf8"));
  prov["apple-touch-icon.png"] = sha(png);
  fs.writeFileSync(provF, `${JSON.stringify(prov, null, 2)}\n`);
  const r = spawnSync("node", [GATE, "--root", dir], { encoding: "utf8" });
  const reds = (r.stdout + r.stderr).split("\n").filter((l) => /^\s+[a-z]\.[\w-]+:|readings:/.test(l)).map((l) => l.trim());
  out.push(`${r.status === 0 ? "GREEN" : "RED  "} exit ${r.status} | ${name}\n      ${reds.join("\n      ")}`);
}
fs.writeFileSync(path.join(D, "crit9-plants.txt"), `${out.join("\n")}\n`);
console.log(out.join("\n"));
