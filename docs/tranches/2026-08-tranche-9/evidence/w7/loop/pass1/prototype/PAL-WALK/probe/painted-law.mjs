/**
 * THE LAW, THE SEPARATION AND THE ROOM SIZE — on the bytes the ENGINE PAINTED off the patched
 * product (`bytes-<engine>-<theme>.json`, canvas read-back, both engines, both themes).
 *
 * Same law, same MIN_SEP and same reserved-set regex as the r0 instrument
 * (`r0/r5-player-mark/instruments-family-law.mjs`); only the hues are different, because these
 * are read back out of the engine rather than computed.
 */
import fs from "fs";

const CSS =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-49/web/frontend/src/assets/index.css";
const DIR =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk/readings";
const MIN_SEP = 12;

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const hueOf = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const h = (Math.atan2(B, A) * 180) / Math.PI;
  return h < 0 ? h + 360 : h;
};
const gap = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};
const css = fs.readFileSync(CSS, "utf8");
const WANT =
  /--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;
const reserved = [...css.matchAll(WANT)].map((m) => ({ name: m[1], hex: m[2], h: hueOf(m[2]) }));

let worstRoom = 99;
for (const engine of ["chromium", "webkit"])
  for (const theme of ["light", "dark"]) {
    const f = `${DIR}/bytes-${engine}-${theme}.json`;
    if (!fs.existsSync(f)) continue;
    const j = JSON.parse(fs.readFileSync(f, "utf8"));
    const painted = j.painted;
    const req = j.requested;
    console.log(`\n── ${engine} · ${theme} ──`);
    for (const n of [16, 24, 40]) {
      const hits = [];
      for (let i = 0; i < n; i++)
        for (const r of reserved) {
          const d = gap(painted[i].h, r.h);
          if (d < MIN_SEP)
            hits.push(
              `i=${i} req ${req[i].h} painted ${painted[i].h} vs --color-${r.name} ${r.hex} (h=${r.h.toFixed(1)}): ${d.toFixed(2)}°`,
            );
        }
      console.log(
        `  PAINTED family law over the first ${String(n).padStart(2)}: ${hits.length ? `RED — ${hits.length} collisions` : "GREEN — 0 collisions"}`,
      );
      for (const h of hits) console.log(`     ${h}`);
    }
    const sep = (n) => {
      let m = 360;
      let pair = null;
      for (let i = 0; i < n; i++)
        for (let k = i + 1; k < n; k++) {
          const d = gap(painted[i].h, painted[k].h);
          if (d < m) {
            m = d;
            pair = [i, k];
          }
        }
      return { m, pair };
    };
    for (const n of [4, 8, 16, 24]) {
      const s = sep(n);
      console.log(
        `  painted min separation over ${String(n).padStart(2)}: ${s.m.toFixed(2)}° (i=${s.pair[0]}, j=${s.pair[1]})`,
      );
    }
    let room = 1;
    for (let n = 2; n <= 144; n++) {
      if (sep(n).m >= MIN_SEP) room = n;
      else break;
    }
    worstRoom = Math.min(worstRoom, room);
    console.log(`  ROOM SIZE at the ${MIN_SEP}° floor, painted: ${room} players`);
    // byte-identical pairs inside the first 16
    const seen = new Map();
    let dup = 0;
    for (let i = 0; i < 16; i++) {
      if (seen.has(painted[i].rgb)) dup++;
      seen.set(painted[i].rgb, i);
    }
    console.log(`  byte-identical pairs within the first 16: ${dup}`);
  }
console.log(`\nWORST ROOM SIZE over both engines and both themes: ${worstRoom}`);
