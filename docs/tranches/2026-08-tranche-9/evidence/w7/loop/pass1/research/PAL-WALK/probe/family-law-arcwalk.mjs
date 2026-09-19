/**
 * I1 RE-RUN — `r0/r5-player-mark/instruments-family-law.mjs`'s law, unchanged in every part
 * that is the LAW, with the walk read from PAL-WALK's own source instead of `playerIdentity.ts`.
 *
 * Same MIN_SEP (12deg), same reserved-ink regex over the same `index.css`, same circular-gap
 * arithmetic, same "first 16 indices" span, same bare exit code. The only substitution is the
 * one the family makes: `hue_i` comes from `proto/arcWalk.mjs` instead of `(i x 137.5) % 360`.
 *
 * GREEN BY CONSTRUCTION is the point, and it is stated as such: the walk is DEFINED as the
 * complement of the reserved arcs, so this instrument can only red if the construction is wrong
 * (a guard narrower than the law, an arc that failed to merge, a hue that escaped the map).
 * It is kept because a construction that cannot be checked is a claim.
 */
import fs from "fs";
import { buildWalk, gap, srgbToOklch, ROOT } from "../proto/arcWalk.mjs";

const MIN_SEP = 12;
const BUILD_GUARD = Number(process.env.PAL_WALK_GUARD ?? 12.25); // the law + 0.25deg numerical margin
const VARIANT = process.env.PAL_WALK_VARIANT || "scaled";

const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const w = buildWalk(css, VARIANT, BUILD_GUARD);

console.log(
  `walk: ARC WALK, chroma 0.166, golden step ${w.step.toFixed(3)}deg on an OPEN arc of ` +
    `${w.L.toFixed(1)}deg (${w.open.length} arcs, guard ${BUILD_GUARD}deg); ` +
    `reserved inks read from index.css: ${w.reserved.length}`,
);

const hits = [];
for (let i = 0; i < 16; i++) {
  const h = +w.hueAt(i).toFixed(1);
  for (const r of w.reserved) {
    const d = gap(h, srgbToOklch(r.hex).h);
    if (d < MIN_SEP) hits.push({ i, h, ...r, d: +d.toFixed(1) });
  }
}
for (const x of hits)
  console.log(
    `  COLLISION peer index ${x.i} (h=${x.h}) vs --color-${x.name} ${x.hex} ` +
      `(h=${srgbToOklch(x.hex).h.toFixed(1)}): ${x.d}deg < ${MIN_SEP}deg`,
  );

// the margin, reported whether or not the law holds
let closest = { d: 360 };
for (let i = 0; i < 16; i++)
  for (const r of w.reserved) {
    const d = gap(w.hueAt(i), srgbToOklch(r.hex).h);
    if (d < closest.d) closest = { d, i, name: r.name, hex: r.hex };
  }
console.log(
  `  closest approach over the first 16: ${closest.d.toFixed(2)}deg ` +
    `(i=${closest.i} vs --color-${closest.name} ${closest.hex}) — margin over the law: ` +
    `${(closest.d - MIN_SEP).toFixed(2)}deg`,
);
// and over 24 and 40, which the charter asks for by name
for (const n of [24, 40]) {
  let c = { d: 360 };
  for (let i = 0; i < n; i++)
    for (const r of w.reserved) {
      const d = gap(w.hueAt(i), srgbToOklch(r.hex).h);
      if (d < c.d) c = { d, i, name: r.name };
    }
  console.log(
    `  closest approach over the first ${n}: ${c.d.toFixed(2)}deg (i=${c.i} vs --color-${c.name})` +
      ` — ${c.d < MIN_SEP ? "UNDER" : "over"} the law`,
  );
}

console.log(
  hits.length
    ? `RED — ${hits.length} collisions in the first 16 indices`
    : "GREEN — the family law holds (by construction)",
);
process.exit(hits.length ? 1 : 0);
