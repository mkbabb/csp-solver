// ACC-SIX pass-5 — WHAT THE STRIP'S RESERVE BUYS. On ONE tree, the reserve ON (as shipped) vs
// OFF (an injected `min-height: 0 !important` on .board-margin), coarse cells, both engines:
// strip height + the controls' top at fill 0..3 with the voice SILENT, then with the voice
// SPEAKING (hint armed on an empty cell, then three legal writes). Reports whether the count
// line ever takes a second ROW (meta top > voice top) and what it costs the column.
// usage: BASE=http://127.0.0.1:4237 node p5-reserve.mjs <out.json>
import { writeFileSync } from "node:fs";
import { ENGINES, BOARD, DEAL, cells, asset, writeLegal, open } from "./p5-common.mjs";
const BASE = process.env.BASE || "http://127.0.0.1:4237";
const CELLS = [
  { name: "393x699-coarse", viewport: { width: 393, height: 699 }, dpr: 3, touch: true },
  { name: "844x390-coarse", viewport: { width: 844, height: 390 }, dpr: 3, touch: true },
];
const READ = () => {
  const m = document.querySelector(".board-margin"), pc = document.querySelector(".play-controls");
  const v = document.querySelector(".margin-note"), meta = document.querySelector(".margin-note-meta");
  const r = (e) => e ? e.getBoundingClientRect() : null;
  return { stripH: +r(m).height.toFixed(2), ctlTop: pc ? +r(pc).top.toFixed(2) : null, voice: v?.textContent.trim() ?? "", voiceTop: +r(v).top.toFixed(2), voiceH: +r(v).height.toFixed(2), meta: meta?.textContent ?? null, metaTop: meta ? +r(meta).top.toFixed(2) : null, metaW: meta ? +r(meta).width.toFixed(2) : null, stripW: +r(m).width.toFixed(2), secondRow: !!meta && r(meta).top > r(v).top + 2 };
};
const out = { board: BOARD, base: BASE, cells: {} };
for (const [eng, L] of ENGINES) {
  const br = await L.launch();
  for (const C of CELLS) for (const reserve of ["on", "off"]) {
    const { ctx, page } = await open(br, BASE, C);
    const R = (out.cells[`${eng}/${C.name}/reserve-${reserve}`] = { asset: await asset(page), coarse: await page.evaluate(() => matchMedia("(pointer: coarse)").matches), dealOk: (await cells(page)) === DEAL });
    if (reserve === "off") await page.addStyleTag({ content: ".board-margin{min-height:0 !important}" });
    await page.waitForTimeout(200);
    R.silent = [await page.evaluate(READ)];
    for (let k = 0; k < 3; k++) { await writeLegal(page, 450); R.silent.push(await page.evaluate(READ)); }
    await ctx.close();
    // Voice speaking: arm a hint on an empty cell first, then write.
    const b = await open(br, BASE, C);
    if (reserve === "off") await b.page.addStyleTag({ content: ".board-margin{min-height:0 !important}" });
    await b.page.evaluate(() => { const cs = Array.from(document.querySelectorAll(".sudoku-cell input")); const i = cs.findIndex((x) => !x.value); cs[i].focus(); });
    await b.page.keyboard.press("h"); await b.page.waitForTimeout(700);
    R.speaking = [await b.page.evaluate(READ)];
    for (let k = 0; k < 3; k++) { await writeLegal(b.page, 450); R.speaking.push(await b.page.evaluate(READ)); }
    await b.ctx.close();
    console.error("done", eng, C.name, reserve);
  }
  await br.close();
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.error("wrote");
