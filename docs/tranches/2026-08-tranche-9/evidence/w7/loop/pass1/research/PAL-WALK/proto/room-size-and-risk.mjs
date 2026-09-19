/** (a) the room size each walk HONESTLY serves, on painted bytes, at the family law's own 12deg
 *  floor and at a looser 9deg; (b) what the reserved set doing what §3 proposes, or gaining a
 *  sixth anchor, does to the open arc. */
import fs from "fs";
import { readReserved, reservedArcs, openArcs, measure, gap, ROOT } from "./arcWalk.mjs";
const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const PHI2 = (3 - Math.sqrt(5)) / 2;

// (a) — painted hues from the engine
for (const engine of ["chromium"])
  for (const theme of ["light", "dark"]) {
    const j = JSON.parse(fs.readFileSync(`probe/bytes-${engine}-${theme}.json`, "utf8"));
    const arc = j.gamut.all.map((p) => p.h);
    const ship = j.gamutControl.all.map((p) => p.h);
    const firstUnder = (hues, floor) => {
      for (let n = 2; n <= 144; n++) {
        let m = 360;
        for (let i = 0; i < n; i++) for (let k = i + 1; k < n; k++) m = Math.min(m, gap(hues[i], hues[k]));
        if (m < floor) return n - 1;
      }
      return 144;
    };
    console.log(`${theme}: ARC walk honestly serves ${firstUnder(arc,12)} at 12deg, ${firstUnder(arc,9)} at 9deg, ${firstUnder(arc,6)} at 6deg`);
    console.log(`${theme}: SHIPPED walk honestly serves ${firstUnder(ship,12)} at 12deg, ${firstUnder(ship,9)} at 9deg, ${firstUnder(ship,6)} at 6deg`);
  }

// (b) — the reserved set moving
const base = readReserved(css);
const stats = (hues, label) => {
  const arcs = reservedArcs(hues, 12.25), open = openArcs(arcs), L = measure(open);
  const step = L * PHI2;
  const hueAtP = (p) => { let r = p; for (const [a,b] of open) { const w = b-a; if (r < w) return a+r; r -= w; } return open[open.length-1][1]; };
  const hs = Array.from({length:40},(_,i)=>hueAtP(((i*step)%L+L)%L));
  const sep = (n) => { let m=360; for(let i=0;i<n;i++) for(let k=i+1;k<n;k++) m=Math.min(m,gap(hs[i],hs[k])); return m; };
  console.log(`  ${label.padEnd(46)} hues ${String(hues.length).padStart(2)} · OPEN ${L.toFixed(1).padStart(5)}deg (${open.length} arcs) · requested sep@8 ${sep(8).toFixed(2)} @16 ${sep(16).toFixed(2)}`);
};
console.log("\n(b) THE RESERVED SET MOVES:");
stats(base.map(r=>r.h), "HEAD — 29 hexes as they stand");
stats(base.filter(r=>!["user-ink","progress-ink"].includes(r.name)).map(r=>r.h), "R2's proposal: user-ink + progress-ink go kin");
stats([...base.map(r=>r.h), 207], "a SIXTH anchor at 207deg (the widest open arc)");
stats([...base.map(r=>r.h), 320], "a sixth anchor at 320deg (the second-widest)");
stats(base.filter(r=>!r.name.startsWith("solver-ink")).map(r=>r.h), "if the solver rainbow were excluded from the set");
