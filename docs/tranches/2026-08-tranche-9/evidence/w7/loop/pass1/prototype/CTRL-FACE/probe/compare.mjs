/**
 * CTRL-FACE pass-1 PROTOTYPE — the control/armD delta table, read off the two census dumps.
 * Emits one JSONL row per (cell, engine, row) so the numbers travel as data.
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs";

const CELLS = [
  "dock-390x844",
  "dock-375x812",
  "dock-430x932",
  "land-900x500",
  "desk-1280x800",
];
const ENGINES = ["chromium", "webkit"];
const read = (arm, cell, eng, dir) => {
  const p = `${dir}/extras-${arm}-${cell}-${eng}.json`;
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
};

const rows = [];
for (const cell of CELLS)
  for (const eng of ENGINES) {
    const c = read("control", cell, eng, "readings");
    const a = read("armD", cell, eng, "readings4242");
    if (!c || !a) {
      rows.push({ cell, eng, row: "MISSING", control: !!c, armD: !!a });
      continue;
    }
    const C = c.stateA;
    const A = a.stateA;
    // tapes: net flow per tape, both arms, paired by text order
    const tapes = A.tapes.map((t, i) => ({
      text: t.text,
      netFlowHEAD: C.tapes[i]?.netFlow ?? null,
      netFlowArmD: t.netFlow,
      delta: C.tapes[i] ? +(t.netFlow - C.tapes[i].netFlow).toFixed(2) : null,
      boxHEAD: C.tapes[i] ? `${C.tapes[i].box.w}x${C.tapes[i].box.h}` : null,
      boxArmD: `${t.box.w}x${t.box.h}`,
      headOverlapPx2: (t.vsHeads ?? []).map((h) => h.px2),
      anyCollision: (t.collisions ?? []).map((x) => `${x.sel}:${x.text}:${x.px2}`),
    }));
    rows.push({ cell, eng, row: "tapes", tapes });
    // chips: face/size/weight/height, and the height delta against HEAD's same-index chip
    const chips = A.chips.map((ch, i) => ({
      text: ch.text,
      face: `${ch.family} · ${ch.px} · ${ch.weight} · ${ch.transform}`,
      radius: ch.radius,
      hHEAD: C.chips[i]?.box.h ?? null,
      hArmD: ch.box.h,
      dH: C.chips[i] ? +(ch.box.h - C.chips[i].box.h).toFixed(2) : null,
      wordW: ch.wordW,
      bgSizeRaw: ch.bgSizeRaw,
      overrunProbe: ch.overrun,
      selected: ch.selected,
    }));
    rows.push({ cell, eng, row: "chips", chips });
    rows.push({
      cell,
      eng,
      row: "card",
      scrollHeightHEAD: C.card.scrollHeight,
      scrollHeightArmD: A.card.scrollHeight,
      delta: A.card.scrollHeight - C.card.scrollHeight,
      printedOnScreenHEAD: C.printedOnScreen,
      printedOnScreenArmD: A.printedOnScreen,
      printedVoicesArmD: A.printedVoices,
    });
    rows.push({
      cell,
      eng,
      row: "heads",
      HEAD: (C.heads ?? []).map((h) => ({
        expanded: h.expanded,
        name: h.name,
        px: h.namePx,
        family: h.nameFamily,
        deco: h.nameDecoration,
        color: h.nameColor,
        value: h.value,
        valueColor: h.valueColor,
        valueTransform: h.valueTransform,
      })),
      armD: (A.heads ?? []).map((h) => ({
        expanded: h.expanded,
        name: h.name,
        px: h.namePx,
        family: h.nameFamily,
        deco: h.nameDecoration,
        color: h.nameColor,
        value: h.value,
        valueColor: h.valueColor,
        valueTransform: h.valueTransform,
      })),
    });
    rows.push({
      cell,
      eng,
      row: "captions",
      HEAD: C.captions,
      armD: A.captions,
    });
    const floor = (s) =>
      (s.tapFloors ?? [])
        .filter((f) => f.w > 0 && f.h > 0)
        .reduce(
          (m, f) => ({ w: Math.min(m.w, f.w), h: Math.min(m.h, f.h) }),
          { w: Infinity, h: Infinity },
        );
    rows.push({ cell, eng, row: "tapFloor", HEAD: floor(C), armD: floor(A) });
  }

writeFileSync(
  process.env.OUT || "readings4242/compare.jsonl",
  rows.map((r) => JSON.stringify(r)).join("\n") + "\n",
);

// a compact human read of the gate rows
for (const r of rows) {
  if (r.row === "tapes")
    console.log(
      `${r.cell} ${r.eng} TAPE netFlowΔ ${r.tapes.map((t) => t.delta).join("|")} ` +
        `headOverlap ${r.tapes.map((t) => t.headOverlapPx2.join("/")).join("|")} ` +
        `collisions ${r.tapes.flatMap((t) => t.anyCollision).join(",") || "none"}`,
    );
  if (r.row === "card")
    console.log(
      `${r.cell} ${r.eng} CARD ${r.scrollHeightHEAD} → ${r.scrollHeightArmD} (${r.delta}) ` +
        `printed ${r.printedOnScreenHEAD} → ${r.printedOnScreenArmD} voices ${JSON.stringify(r.printedVoicesArmD)}`,
    );
  if (r.row === "chips")
    console.log(
      `${r.cell} ${r.eng} CHIP dH ${[...new Set(r.chips.map((c) => c.dH))].join(",")} ` +
        `faces ${[...new Set(r.chips.map((c) => c.face))].join(" / ")} radius ${[...new Set(r.chips.map((c) => c.radius))].join(",")} ` +
        `overrun(painted) ${r.chips.filter((c) => c.bgSizeRaw !== "auto" && c.overrunProbe).map((c) => c.overrunProbe).join(",")}`,
    );
  if (r.row === "tapFloor")
    console.log(
      `${r.cell} ${r.eng} FLOOR HEAD ${r.HEAD.w}x${r.HEAD.h} → armD ${r.armD.w}x${r.armD.h}`,
    );
  if (r.row === "heads")
    console.log(
      `${r.cell} ${r.eng} HEADS armD ${r.armD.map((h) => `${h.name}[${h.expanded}] ${h.px} ${h.family} deco=${h.deco} ink=${h.color} val=${h.value}/${h.valueColor}`).join(" · ")}`,
    );
  if (r.row === "captions")
    console.log(
      `${r.cell} ${r.eng} CAPTIONS armD ${JSON.stringify(r.armD)} (HEAD ${JSON.stringify(r.HEAD)})`,
    );
}
