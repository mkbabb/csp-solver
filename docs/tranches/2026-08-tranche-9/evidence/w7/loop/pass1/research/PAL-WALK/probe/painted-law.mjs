/**
 * THE LAW ON PAINTED BYTES. The arc walk is constructed on the hue it REQUESTS; the engine
 * gamut-maps at C 0.166 and paints a different one. This re-runs the family law and the
 * separation census on the hue the engine actually painted, read back from
 * `bytes-<engine>-<theme>.json` (canvas read-back, both engines).
 */
import fs from "fs";
import { readReserved, gap, ROOT } from "../proto/arcWalk.mjs";
const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const reserved = readReserved(css);
const walk = JSON.parse(fs.readFileSync("proto/walk.json", "utf8"));
const MIN_SEP = 12;
for (const engine of ["chromium", "webkit"])
  for (const theme of ["light", "dark"]) {
    const f = `probe/bytes-${engine}-${theme}.json`;
    if (!fs.existsSync(f)) continue;
    const j = JSON.parse(fs.readFileSync(f, "utf8"));
    const painted = j.gamut.all;
    // 1. the law, on painted hues, first 16
    const hits = [];
    for (let i = 0; i < 16; i++)
      for (const r of reserved) {
        const d = gap(painted[i].h, r.h);
        if (d < MIN_SEP) hits.push(`i=${i} req ${walk.hues[i]} painted ${painted[i].h} vs --color-${r.name} ${r.hex} (h=${r.h.toFixed(1)}): ${d.toFixed(2)}deg`);
      }
    // 2. separation on painted hues
    const sep = (n) => {
      let m = 360, pair = null;
      for (let i = 0; i < n; i++) for (let k = i + 1; k < n; k++) { const d = gap(painted[i].h, painted[k].h); if (d < m) { m = d; pair = [i, k]; } }
      return { m, pair };
    };
    // 3. chroma delivered
    const c16 = painted.slice(0, 16).map((p) => p.C);
    console.log(`\n── ${engine} · ${theme} ──`);
    console.log(`  PAINTED family law over the first 16: ${hits.length ? `RED — ${hits.length} collisions` : "GREEN"}`);
    for (const h of hits) console.log(`     ${h}`);
    for (const n of [4, 8, 16, 24, 40]) {
      const s = sep(n);
      console.log(`  painted min separation over ${String(n).padStart(2)}: ${s.m.toFixed(2)}deg (i=${s.pair[0]}, j=${s.pair[1]})`);
    }
    console.log(`  painted chroma over the first 16: min ${Math.min(...c16).toFixed(4)} · mean ${(c16.reduce((a,b)=>a+b,0)/16).toFixed(4)} · requested 0.166`);
    const shifts = painted.slice(0, 16).map((p, i) => { const d = gap(p.h, walk.hues[i]); return d; });
    console.log(`  hue shift over the first 16: max ${Math.max(...shifts).toFixed(2)}deg (i=${shifts.indexOf(Math.max(...shifts))}) · mean ${(shifts.reduce((a,b)=>a+b,0)/16).toFixed(2)}deg`);
    // byte-identical pairs within the first 16
    const seen = new Map(); let dup = 0;
    for (let i = 0; i < 16; i++) { if (seen.has(painted[i].rgb)) dup++; seen.set(painted[i].rgb, i); }
    console.log(`  byte-identical pairs within the first 16: ${dup}`);
  }
