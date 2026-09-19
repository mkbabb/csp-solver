/**
 * BORN-RED INSTRUMENT — THE ACCENT-FAMILY LAW, applied to the per-player walk.
 *
 * Reads the REAL sources (no re-implementation of the formula, no hand-copied hexes):
 *   · web/frontend/src/games/shared/playerIdentity.ts  → the walk (step, chroma, band var)
 *   · web/frontend/src/assets/index.css                → every reserved ink, both themes
 *
 * ASSERTS: no peer ink in a room's realistic span (the first 16 indices) may land within
 * MIN_SEP degrees of a reserved ink that shares its surface. 12deg is the floor the estate's
 * own progress-ink note sets as adequate ("46deg off focus-sketch ... the two never read as
 * one"); 12 is a third of that, and deliberately generous.
 *
 * Exits non-zero while the law is broken. RED at HEAD by construction.
 */
import fs from "fs";
// RE-POINTED (T9-W7 pass 3, PLR-SELF) at the prototype worktree; r0 is frozen.
const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-51/web/frontend";
const MIN_SEP = 12;

const id = fs.readFileSync(`${ROOT}/src/games/shared/playerIdentity.ts`, "utf8");
const m = id.match(/oklch\(var\(--peer-ink-l\)\s+([\d.]+)\s+\$\{\(\(index\s*\*\s*([\d.]+)\)\s*%\s*360\)/);
if (!m) {
  console.error("INSTRUMENT BROKEN: the walk's formula moved in playerIdentity.ts");
  process.exit(2);
}
const CHROMA = +m[1], STEP = +m[2];
const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");

// Every literal hex token in index.css that names an ink SHARING A SURFACE with a peer's
// colour: board content (solver/user/progress), the rings (focus/peer-cursor), the verdict
// inks (teacher-red and its kin) and the crayon wax the board and the card both wear.
const WANT = /--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;
const reserved = [];
for (const hit of css.matchAll(WANT)) reserved.push({ name: hit[1], hex: hit[2] });

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function hueOf(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const mm = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const A = 1.9779984951 * l - 2.428592205 * mm + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * mm - 0.808675766 * s;
  let h = (Math.atan2(B, A) * 180) / Math.PI;
  return h < 0 ? h + 360 : h;
}
const gap = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

const hits = [];
for (let i = 0; i < 16; i++) {
  const h = +((i * STEP) % 360).toFixed(1);
  for (const r of reserved) {
    const d = gap(h, hueOf(r.hex));
    if (d < MIN_SEP) hits.push({ i, h, ...r, d: +d.toFixed(1) });
  }
}
console.log(`walk: chroma ${CHROMA}, step ${STEP}deg; reserved inks read from index.css: ${reserved.length}`);
for (const x of hits)
  console.log(`  COLLISION peer index ${x.i} (h=${x.h}) vs --color-${x.name} ${x.hex} (h=${hueOf(x.hex).toFixed(1)}): ${x.d}deg < ${MIN_SEP}deg`);
console.log(hits.length ? `RED — ${hits.length} collisions in the first 16 indices` : "GREEN — the family law holds");
process.exit(hits.length ? 1 : 0);
