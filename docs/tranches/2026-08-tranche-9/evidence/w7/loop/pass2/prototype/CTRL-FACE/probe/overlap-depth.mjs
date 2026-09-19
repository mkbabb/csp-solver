/**
 * CTRL-FACE pass-1 — the tape's collisions, with their DEPTH. `px2` alone cannot say whether a
 * tape grazes a word by a quarter pixel or buries it, and the family's own gate asks for zero.
 * Reads the census dumps and re-derives each overlap rect from the two boxes.
 */
import { readFileSync, existsSync } from "node:fs";

const CELLS = ["dock-390x844", "dock-375x812", "dock-430x932", "land-900x500", "desk-1280x800"];
const rect = (b) => ({ l: b.x, t: b.y, r: b.x + b.w, b: b.y + b.h });
const ov = (a, b) => {
  const x = Math.min(a.r, b.r) - Math.max(a.l, b.l);
  const y = Math.min(a.b, b.b) - Math.max(a.t, b.t);
  return x > 0 && y > 0 ? { w: +x.toFixed(2), h: +y.toFixed(2), px2: +(x * y).toFixed(1) } : null;
};

for (const arm of [
  ["control", "readings"],
  ["armD", "readings4242"],
])
  for (const cell of CELLS)
    for (const eng of ["chromium", "webkit"]) {
      const p = `${arm[1]}/extras-${arm[0]}-${cell}-${eng}.json`;
      if (!existsSync(p)) continue;
      const s = JSON.parse(readFileSync(p, "utf8")).stateA;
      const others = [
        ...s.chips.map((c) => ({ sel: ".ctrl-btn", text: c.text, box: c.box })),
        ...s.captions.map((c) => ({ sel: ".zone-row-label", text: c.text, box: c.box })),
        ...(s.heads ?? []).map((h) => ({ sel: ".mobile-heading-btn", text: h.name, box: h.box })),
      ].filter((o) => o.box && o.box.w > 0 && o.box.h > 0);
      for (const t of s.tapes) {
        const tr = rect(t.box);
        for (const o of others) {
          const r = ov(tr, rect(o.box));
          if (r)
            console.log(
              `${arm[0]} ${cell} ${eng} TAPE "${t.text}" ∩ ${o.sel} "${o.text}" ` +
                `= ${r.px2}px² (${r.w}w × ${r.h} DEEP)`,
            );
        }
      }
    }
