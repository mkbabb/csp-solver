#!/usr/bin/env node
// T9-W7 pass 4 · CTRL-COST — THE π DIFF, and IT PRINTS THE UNMATCHED PATHS (charter row 14).
// Pass 3 compared the intersection of ancestry paths and said "0 structural boxes moved"; the
// node counts differed between trees (564 vs 586, 636 vs 710) and the unmatched nodes were never
// listed, so the sentence covered only the boxes both trees happened to share. Here the
// unmatched set is the headline's second half, named and counted on both sides.
// Usage: node p4-pi-diff.mjs <head.json> <proto.json> [tolerance]
import { readFileSync } from "node:fs";
const [a, b, tolArg] = process.argv.slice(2);
const tol = Number(tolArg ?? 0.05);
const A = JSON.parse(readFileSync(a, "utf8"));
const B = JSON.parse(readFileSync(b, "utf8"));
// THE BOARD'S OWN GLYPHS ARE NOT A LAYOUT CLAIM, and they are separated rather than swept: a
// `game-cell > svg > path` is one hand-drawn digit, seeded per deal, and the two arms do not
// deal the same givens (`?board=` does not pin this app's deal — LADDER/LEDGER's confound, read
// here as a fact rather than assumed away). They are counted and reported in their own column;
// the CHROME columns are the π claim.
const isGlyph = (k) => /game-cell[^>]*>svg#0(>path#0)?$/.test(k);
const map = (o) => new Map(o.rects.map((r) => [r.k, r]));
const MA = map(A);
const MB = map(B);
const moved = [];
const repainted = [];
for (const [k, ra] of MA) {
  const rb = MB.get(k);
  if (!rb) continue;
  const d = Math.max(
    Math.abs(ra.x - rb.x),
    Math.abs(ra.y - rb.y),
    Math.abs(ra.w - rb.w),
    Math.abs(ra.h - rb.h),
  );
  if (d > tol) moved.push({ k, head: [ra.x, ra.y, ra.w, ra.h], proto: [rb.x, rb.y, rb.w, rb.h], d: +d.toFixed(2) });
  if (ra.tag !== rb.tag) repainted.push({ k, what: "tag", head: ra.tag, proto: rb.tag });
  for (const p of Object.keys(ra.p ?? {}))
    if (ra.p[p] !== rb.p?.[p])
      repainted.push({ k, what: p, head: ra.p[p], proto: rb.p?.[p] });
}
const onlyHead = [...MA.keys()].filter((k) => !MB.has(k));
const onlyProto = [...MB.keys()].filter((k) => !MA.has(k));
const chrome = (l) => l.filter((r) => !isGlyph(typeof r === "string" ? r : r.k));
const short = (l) => l.map((k) => k.split(">").slice(-2).join(">")).slice(0, 40);
console.log(
  `π ${A.engine} ${A.route} ${A.vp ?? ""} ${A.theme ?? ""} sheet=${A.sheet ?? "?"}  ` +
    `head ${A.n} nodes / proto ${B.n}  matched ${[...MA.keys()].filter((k) => MB.has(k)).length}  ` +
    `MOVED ${moved.length} (CHROME ${chrome(moved).length}, glyphs ${moved.length - chrome(moved).length}, tol ${tol})  ` +
    `REPAINTED ${repainted.length} (CHROME ${chrome(repainted).length})  ` +
    `unmatched head-only ${onlyHead.length} (CHROME ${chrome(onlyHead).length}) / ` +
    `proto-only ${onlyProto.length} (CHROME ${chrome(onlyProto).length})`,
);
const namedBoxes = [".masthead", ".board-wrapper", "#fold-tools", ".play-controls"];
for (const sel of namedBoxes) {
  const key = [...MA.keys()].find((k) => k.includes(sel.replace(/^[.#]/, "")));
  if (!key) continue;
  const ra = MA.get(key);
  const rb = MB.get(key);
  if (ra && rb)
    console.log(
      `  ${sel}: head [${ra.x},${ra.y},${ra.w},${ra.h}] proto [${rb.x},${rb.y},${rb.w},${rb.h}]`,
    );
}
if (chrome(moved).length) console.log("  CHROME moved:", JSON.stringify(chrome(moved).slice(0, 20)));
if (chrome(repainted).length) console.log("  CHROME repainted:", JSON.stringify(chrome(repainted).slice(0, 20)));
if (chrome(onlyHead).length) console.log("  CHROME head-only:", JSON.stringify(short(chrome(onlyHead))));
if (chrome(onlyProto).length) console.log("  CHROME proto-only:", JSON.stringify(short(chrome(onlyProto))));
