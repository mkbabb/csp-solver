#!/usr/bin/env node
// T9-W7 pass-1 · MOT-DERIVE · TRAVEL, DEFINED THE MOST GENEROUS WAY THE FAMILY COULD ASK FOR.
//
// The centre-translate magnitude is the cheapest reading of "how far the thing went", and it
// flatters nobody: a FLIP that scales moves its EDGES further than its centre. The fold's
// movers all scale, so before the family is killed on a travel number it deserves the travel
// number that helps it most.
//
// For `translate(dx,dy) scale(s)` about a 50%/50% origin on an element whose LAYOUT box is the
// LAST box (w x h — the crit kill: the element already rests at final size), the displacement
// of a point r from the centre is (dx,dy) + (s-1)r, so the largest displacement anywhere in the
// box is |(dx,dy)| + |s-1| * |r_max|, with r_max the half-diagonal. That upper bound is
// "corner travel" here.
//
// Inputs: r0/r4-transition-grammar/data/r4-probe3.json (the keyframes) + this lane's
// p2-deck-and-boxes.json (the measured LAST boxes, this tree, both viewports).
//
//   node p3-corner-travel.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const probe3 = JSON.parse(
  readFileSync(resolve(here, "../../../../r0/r4-transition-grammar/data/r4-probe3.json"), "utf8"),
);
const boxes = JSON.parse(readFileSync(resolve(here, "p2-deck-and-boxes.json"), "utf8"));

// Which measured box is a mover's LAST box depends on where the gesture LANDS:
//  · drawer movers land in the scene → sceneBoxes
//  · gallery ENTER lands in the deck  → galleryBoxes
//  · gallery EXIT lands in the scene  → sceneBoxes
const lastBoxFor = (vp, mark, key) => {
  const bag = boxes[vp];
  if (!bag) return null;
  const which = mark.startsWith("gallery-enter") ? bag.galleryBoxes : bag.sceneBoxes;
  return which?.[key] ?? bag.sceneBoxes?.[key] ?? null;
};

const reT = /translate\(\s*(-?[\d.e+-]+)px\s*,\s*(-?[\d.e+-]+)px\s*\)/;
const reTX = /translateX\(\s*(-?[\d.e+-]+)px\s*\)/;
const reS = /scale\(\s*([\d.]+)\s*\)/;

const f1 = (n) => n.toFixed(1);
const rows = [];
for (const [vp, bag] of Object.entries(probe3)) {
  let mark = "";
  for (const m of bag.movers) {
    if (m.mark) {
      mark = m.mark;
      continue;
    }
    const from = JSON.parse(m.kf)[0].transform;
    const t = reT.exec(from);
    const tx = reTX.exec(from);
    const s = reS.exec(from);
    const dx = t ? Number(t[1]) : tx ? Number(tx[1]) : 0;
    const dy = t ? Number(t[2]) : 0;
    const scale = s ? Number(s[1]) : 1;
    const centre = Math.hypot(dx, dy);
    const key = m.cls.split(" ")[0];
    const box = lastBoxFor(vp, mark, key);
    const rMax = box ? Math.hypot(box.w / 2, box.h / 2) : null;
    const corner = rMax == null ? null : centre + Math.abs(scale - 1) * rMax;
    rows.push({
      vp,
      mark,
      key,
      ms: JSON.parse(m.opts).duration,
      centre,
      scale,
      box,
      corner,
    });
  }
}

console.log("viewport\tgesture\ttarget\tcentre px\tscale\tlast box\tcorner px\tms");
for (const r of rows)
  console.log(
    [
      r.vp,
      r.mark,
      r.key,
      f1(r.centre),
      r.scale.toFixed(3),
      r.box ? `${r.box.w}x${r.box.h}` : "—",
      r.corner == null ? "—" : f1(r.corner),
      r.ms,
    ].join("\t"),
  );

const moving = rows.filter((r) => r.corner != null && r.corner > 0.5);
const at520 = moving.filter((r) => r.ms === 520).map((r) => r.corner);
console.log("");
console.log(
  `CORNER travel at 520ms: ${f1(Math.min(...at520))} … ${f1(Math.max(...at520))} px — span ${f1(
    Math.max(...at520) / Math.min(...at520),
  )}x on ONE duration.`,
);
const centre520 = rows.filter((r) => r.ms === 520 && r.centre > 0.5).map((r) => r.centre);
console.log(
  `CENTRE travel at 520ms: ${f1(Math.min(...centre520))} … ${f1(Math.max(...centre520))} px — span ${f1(
    Math.max(...centre520) / Math.min(...centre520),
  )}x.`,
);
console.log(
  "The kill does not depend on which definition is used: no single (base, speed) maps either range onto one number.",
);

// The most generous re-solve: corner travel, anchored on the desk drawer's rail, base 0.
const desk = rows.find(
  (r) => r.vp === "1440x900-desk" && r.mark === "drawer-toggle-open" && r.key === "scene-controls",
);
const dock = rows.find(
  (r) => r.vp === "390x844-phone" && r.mark === "drawer-toggle-open" && r.key === "scene-controls",
);
const speed = desk.corner / 520;
console.log("");
console.log(
  `re-solve on CORNER travel, base 0: paperSpeed ${speed.toFixed(3)} px/ms → dock ${f1(
    dock.corner / speed,
  )} ms vs ruled 520 (miss ${f1(dock.corner / speed - 520)} ms, ${f1(
    ((dock.corner / speed - 520) / 520) * 100,
  )}%), card step 390 ${f1(304 / speed)} ms vs ruled 440.`,
);
