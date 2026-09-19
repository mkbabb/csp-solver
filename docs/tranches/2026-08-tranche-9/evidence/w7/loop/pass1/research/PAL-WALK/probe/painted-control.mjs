/** THE CONTROL: does the SHIPPED walk (C 0.110) shift hue under the engine's gamut mapping too?
 *  If it does, the r0 law's 37 collisions are themselves measured on the wrong hue. */
import fs from "fs";
import { readReserved, gap, ROOT } from "../proto/arcWalk.mjs";
const reserved = readReserved(fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8"));
const MIN_SEP = 12;
for (const engine of ["chromium", "webkit"])
  for (const theme of ["light", "dark"]) {
    const j = JSON.parse(fs.readFileSync(`probe/bytes-${engine}-${theme}.json`, "utf8"));
    const p = j.gamutControl.all, req = Array.from({length:144},(_,i)=>+((i*137.5)%360).toFixed(1));
    const shifts = p.slice(0,16).map((x,i)=>gap(x.h, req[i]));
    let reqHits = 0, paintedHits = 0;
    for (let i = 0; i < 16; i++) for (const r of reserved) {
      if (gap(req[i], r.h) < MIN_SEP) reqHits++;
      if (gap(p[i].h, r.h) < MIN_SEP) paintedHits++;
    }
    const sep = (n, hues) => { let m = 360; for (let i=0;i<n;i++) for (let k=i+1;k<n;k++) m = Math.min(m, gap(hues[i], hues[k])); return m; };
    const c16 = p.slice(0,16).map(x=>x.C);
    console.log(`${engine} · ${theme}: shipped walk gamut-mapped ${j.gamutControl.clipped}/144 · max hue shift over 16 ${Math.max(...shifts).toFixed(2)}deg · mean ${(shifts.reduce((a,b)=>a+b,0)/16).toFixed(2)}deg`);
    console.log(`    law over the first 16: requested ${reqHits} collisions → PAINTED ${paintedHits}`);
    console.log(`    min separation over 16: requested ${sep(16,req).toFixed(2)}deg → PAINTED ${sep(16,p.map(x=>x.h)).toFixed(2)}deg · painted chroma min ${Math.min(...c16).toFixed(4)} mean ${(c16.reduce((a,b)=>a+b,0)/16).toFixed(4)}`);
  }
