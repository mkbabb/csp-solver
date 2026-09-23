// ACC-SIX pass-5 — DOES THE RESERVE BUY ANYTHING? The count showing (fill 1), the voice speaking
// the widest hint line the product writes (`formatHintNote`'s hidden single, `5 goes nowhere
// else in this column`) — EMULATED by writing that string into the voice's own span
// (`.margin-note-ink`, its own class and font) since this payload's first hint is a naked
// single — reserve ON (as built) vs OFF (injected `min-height: 0`), 393x699 and 844x390
// coarse, both engines. Reads the strip, the count's row, and the controls' top.
import { writeFileSync } from "node:fs";
import { ENGINES, BOARD, DEAL, cells, asset, writeLegal, open } from "./p5-common.mjs";
const BASE = process.env.BASE || "http://127.0.0.1:4237";
const LINES = { silent: null, naked: "only 5 fits here", hidden: "5 goes nowhere else in this column" };
const CELLS = [
  { name: "393x699-coarse", viewport: { width: 393, height: 699 }, dpr: 3, touch: true },
  { name: "844x390-coarse", viewport: { width: 844, height: 390 }, dpr: 3, touch: true },
];
const READ = () => { const m = document.querySelector(".board-margin"), pc = document.querySelector(".play-controls, .board-voice"), v = document.querySelector(".margin-note"), meta = document.querySelector(".margin-note-meta"); const r = (e) => e.getBoundingClientRect(); return { stripH: +r(m).height.toFixed(2), belowTop: +r(pc).top.toFixed(2), meta: meta?.textContent ?? null, secondRow: !!meta && r(meta).top > r(v).top + 4, voiceW: +r(v).width.toFixed(1), metaW: meta ? +r(meta).width.toFixed(1) : null, stripW: +r(m).width.toFixed(1) }; };
const out = { board: BOARD, base: BASE, cells: {} };
for (const [eng, L] of ENGINES) {
  const br = await L.launch();
  for (const C of CELLS) for (const reserve of ["on", "off"]) {
    const { ctx, page } = await open(br, BASE, { ...C, reduce: true });
    const R = (out.cells[`${eng}/${C.name}/reserve-${reserve}`] = { asset: await asset(page), dealOk: (await cells(page)) === DEAL });
    if (reserve === "off") await page.addStyleTag({ content: ".board-margin{min-height:0 !important}" });
    await writeLegal(page, 260); await page.evaluate(() => document.activeElement?.blur?.()); await page.waitForTimeout(300);
    for (const [k, line] of Object.entries(LINES)) {
      await page.evaluate((t) => { const p = document.querySelector(".margin-note"); p.querySelector("#acc6-voice")?.remove(); if (!t) return; const s = document.createElement("span"); s.id = "acc6-voice"; s.className = "margin-note-ink"; for (const a of p.getAttributeNames()) if (a.startsWith("data-v-")) s.setAttribute(a, ""); s.textContent = t; p.appendChild(s); }, line);
      await page.waitForTimeout(120);
      R[k] = await page.evaluate(READ);
    }
    await ctx.close();
    console.error("done", eng, C.name, reserve);
  }
  await br.close();
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.error("wrote");
