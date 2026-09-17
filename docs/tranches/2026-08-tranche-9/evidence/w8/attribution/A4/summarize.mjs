// run: node <this dir>/summarize.mjs > <this dir>/raw/summary.txt   (reads raw/readings.jsonl)
// Folds this lane's raw JSONL into the medians the attribution quotes. Recomputable: every
// number in the lane's report comes back out of this, so no figure is quoted without a file.
import { readFileSync } from "node:fs";
// One banked file holds every reading; `src` names the run that produced each row.
const ALL = readFileSync(new URL("./raw/readings.jsonl", import.meta.url), "utf8")
  .trim()
  .split("\n")
  .map((l) => JSON.parse(l));
const read = (f) => ALL.filter((r) => r.src === f);
const med = (a) => {
  const s = a.slice().sort((x, y) => x - y);
  return s.length % 2 ? s[(s.length - 1) / 2] : +((s[s.length / 2 - 1] + s[s.length / 2]) / 2).toFixed(3);
};
const files = [...new Set(ALL.map((r) => r.src))];

console.log("# A4 — drawer attribution, medians recomputed from raw/");
console.log("# dist index-9rZPzI5DEcpe.js · HEAD 58014efd · port 4253 · 2026-09-17");
console.log("# DIRECTION: read expandedTrail — desk's first click CLOSES, mobile's first click OPENS.\n");

for (const f of files.filter((x) => /^(chromium|webkit|first-gesture)/.test(x)).sort()) {
  const rows = read(f);
  if (!rows[0]?.open) continue;
  const t = rows[0].expandedTrail;
  const dir = t?.[0] === "false" ? { open: "OPEN", close: "CLOSE" } : { open: "CLOSE", close: "OPEN" };
  console.log(`== ${f}  engine=${rows[0].engine} regime=${rows[0].regime} cpu=${rows[0].cpu} net="${rows[0].network}" n=${rows.length} trail=${JSON.stringify(t)} tainted=${rows.map((r) => r.tainted).join(",")} hasLongtask=${rows[0].hasLongtask} boardReadyMs=${rows.map((r) => r.boardReadyMs).join("/")}`);
  for (const k of ["open", "close"]) {
    const s = rows.map((r) => r[k]);
    console.log(`   ${dir[k].padEnd(5)} long33=${s.map((x) => x.long33).join("/")} long50=${s.map((x) => x.long50).join("/")} maxConsec=${s.map((x) => x.maxConsecLong33).join("/")} worst=${s.map((x) => x.worst).join("/")} medWorst=${med(s.map((x) => x.worst))} worstIdx=${s.map((x) => x.worstIdx).join("/")} p50=${med(s.map((x) => x.p50))} p95=${med(s.map((x) => x.p95))}`);
  }
  if (rows[0].trace)
    for (const w of ["openOnset", "closeOnset", "closeSettle"]) {
      const b = rows.map((r) => r.trace[w]);
      console.log(`   ${(w === "openOnset" ? dir.open + "-onset" : w === "closeOnset" ? dir.close + "-onset" : dir.close + "-settle").padEnd(13)} recalcMs=${med(b.map((x) => x.recalcStyle))} el=${med(b.map((x) => x.restyledElements))} layoutMs=${med(b.map((x) => x.layout))} dirty=${med(b.map((x) => x.layoutDirty))} paintMs=${med(b.map((x) => x.paint))} rasterMs=${med(b.map((x) => x.raster))} compMs=${med(b.map((x) => x.composite))} nPaint=${med(b.map((x) => x.events.Paint || 0))} nRaster=${med(b.map((x) => x.events.RasterTask || 0))}`);
    }
  console.log();
}

for (const f of files.filter((x) => x.startsWith("onset-ablate")).sort()) {
  const rows = read(f);
  console.log(`== ${f}  (reps 1+ only — rep 0 carries the sheet's first raster)`);
  for (const arm of ["inert", "drawerClass", "teleport", "none"]) {
    const s = rows.filter((r) => r.arm === arm && r.rep > 0);
    if (!s.length) continue;
    console.log(`   ${arm.padEnd(12)} el=${s.map((r) => r.restyledElements).join("/")} recalcMs=${s.map((r) => r.recalcStyle).join("/")} layoutMs=${s.map((r) => r.layout).join("/")} dirty=${s.map((r) => r.layoutDirty).join("/")} note="${s[0].note}"`);
  }
  console.log();
}

for (const f of files.filter((x) => x.startsWith("geom")).sort()) {
  const rows = read(f);
  console.log(`== ${f}  engine=${rows[0].engine} regime=${rows[0].regime}`);
  for (const r of rows)
    console.log(`   cyc${r.cycle} ${r.phase.padEnd(5)} frames=${r.frames} sheetJump=${r.sheet.maxJumpPx} tongueJump=${r.tongue.maxJumpPx} worksheetJump=${r.worksheet.maxJumpPx} disc=${JSON.stringify(r.tongue.discontinuities.concat(r.sheet.discontinuities.filter((d) => d.kind.startsWith("vis"))))}`);
  console.log();
}
