import fs from "node:fs";
const d = JSON.parse(fs.readFileSync(process.argv[2]));
const kinds = process.argv[3] ?? "portrait,landscape,desk";
for (const r of d) {
  if (!kinds.includes(r.kind)) continue;
  if (r.error) { console.log(r.engine, r.kind, r.cell, r.tree, "ERR", r.error); continue; }
  const base = `${r.engine.padEnd(8)} ${r.cell.padEnd(8)} ${r.tree.padEnd(9)} mq c${+r.mq.coarse}p${+r.mq.portrait}`;
  if (r.kind === "portrait") console.log(base, `tuck ${r.tuck} feet ${r.feet} berthH ${r.berth?.h} offY ${r.offCentreY} paperY ${r.paper?.y} fold ${r.fold.present ? r.fold.y + "/" + r.fold.h : "ABSENT"} pc@${r.pcParent} toolsInView ${r.toolsInView}/${r.tools.length} tapes ${r.tapes.filter(t=>t.shown).map(t=>t.t).join("|")||"-"} card ${r.card?.sh}/${r.card?.ch}`);
  if (r.kind === "landscape") console.log(base, `tongueInView ${r.reach.tongueInView} deal ${r.reach.dealInView} level ${r.reach.levelInView} foldInView ${r.reach.foldInView} pc@${r.pcParent} toolsInView ${r.toolsInView}/${r.tools.length} tools ${r.tools.map(t=>`${t.x},${t.y} ${t.w}x${t.h}`).join(" ; ")} card.ch ${r.card?.ch} sh ${r.card?.sh}`);
  if (r.kind === "desk") console.log(base, `card ${r.card?.x}/${r.card?.w} paperX ${r.paper?.x} mastheadX ${r.masthead?.x} logoX ${r.logo?.x} tabRows ${r.tabRows} raisedRow ${r.raisedRow} padTop ${r.deskPadTop} card ${r.card?.sh}/${r.card?.ch}/${r.card?.h}`);
}
