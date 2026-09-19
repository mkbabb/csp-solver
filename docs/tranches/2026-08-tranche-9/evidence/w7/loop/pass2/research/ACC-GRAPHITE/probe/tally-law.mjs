/** ACC-GRAPHITE pass-2 RESEARCH — two candidate tally laws, priced against every board the
 *  estate ships. Perimeter is the real generator's (geom.mjs: 3959.4 units, 4 poses agree). */
import { writeFileSync } from "node:fs";
const P = 3959.4, STROKE = 10, PX = 0.636; // px/unit measured live (board 636px at 1280)
const BOARDS = [
  { l: "4x4",  w: [10, 12] },
  { l: "6x6",  w: [20, 26] },
  { l: "9x9",  w: [43, 51, 57, 58] },
  { l: "16x16", w: [150, 161, 165, 210] },
];
const r = (v, n = 2) => Math.round(v * 10 ** n) / 10 ** n;
const rows = [];
// LAW 0 — what ships in the pass-1 prototype: one tick per cell, duty 0.57
for (const b of BOARDS) for (const w of b.w) {
  const pitch = P / w, ink = pitch * 0.57;
  rows.push({ law: "0 · duty 0.57, one tick per cell", board: b.l, writable: w, slots: w, cellsPerTick: 1,
    pitchU: r(pitch), inkU: r(ink), gapU: r(pitch - ink), inkPx: r(ink * PX), gapPx: r((pitch - ink) * PX),
    aspect: r(ink / STROKE) });
}
// LAW A — fixed ink length, derived slots, m cells per tick
const INK = 45, MINGAP = 25;
const CAP = Math.floor(P / (INK + MINGAP));
for (const b of BOARDS) for (const w of b.w) {
  const slots = Math.min(w, CAP), m = Math.ceil(w / slots), pitch = P / slots;
  rows.push({ law: `A · ink ${INK}u fixed, slots<=${CAP}`, board: b.l, writable: w, slots, cellsPerTick: m,
    pitchU: r(pitch), inkU: INK, gapU: r(pitch - INK), inkPx: r(INK * PX), gapPx: r((pitch - INK) * PX),
    aspect: r(INK / STROKE) });
}
// LAW B — one tick per cell while the tick still reads as a tick, else group by 5 (the bar tally)
for (const b of BOARDS) for (const w of b.w) {
  const oneEach = P / w * 0.57 / STROKE >= 2.5;
  const slots = oneEach ? w : Math.ceil(w / 5), m = oneEach ? 1 : 5;
  const pitch = P / slots, ink = pitch * 0.57;
  rows.push({ law: "B · one per cell, else groups of five", board: b.l, writable: w, slots, cellsPerTick: m,
    pitchU: r(pitch), inkU: r(ink), gapU: r(pitch - ink), inkPx: r(ink * PX), gapPx: r((pitch - ink) * PX),
    aspect: r(ink / STROKE) });
}
writeFileSync(new URL("../readings/tally-law.json", import.meta.url), JSON.stringify(rows, null, 1));
const hdr = ["law", "board", "writable", "slots", "m", "pitchU", "inkU", "gapU", "inkPx", "gapPx", "aspect"];
console.log(hdr.join("\t"));
for (const q of rows) console.log([q.law, q.board, q.writable, q.slots, q.cellsPerTick, q.pitchU, q.inkU, q.gapU, q.inkPx, q.gapPx, q.aspect].join("\t"));
console.log("\nCAP (slots that fit ink 45u + gap 25u on a 3959.4u ring) =", CAP);
