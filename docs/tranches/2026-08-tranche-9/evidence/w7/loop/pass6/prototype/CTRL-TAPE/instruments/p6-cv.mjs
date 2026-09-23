// content view: the card's clientHeight (the scrollport the reader scrolls) and scroll range, per cell.
import { ENGINES, CELLS, open, givens } from "./p6-lib.mjs";
const BASES = process.argv.slice(2);
for (const [eng, L] of ENGINES) {
  const br = await L.launch();
  for (const key of ["rail1440", "rail1280", "coarse1280", "dock390", "dock430", "land844", "land812"]) {
    const row = [];
    for (const base of BASES) {
      const { ctx, page } = await open(br, base, CELLS[key], { dpr: 1 });
      row.push(await page.evaluate(() => { const c = document.querySelector("#controls-drawer .controls-card") || document.querySelector(".controls-card"); const k = document.querySelector(".drawer-case").getBoundingClientRect(); return { client: c.clientHeight, range: c.scrollHeight - c.clientHeight, caseH: +k.height.toFixed(2), caseTop: +k.top.toFixed(2) }; }));
      await ctx.close();
    }
    console.log(eng, key, JSON.stringify(row), "Δclient", row.length > 1 ? row[0].client - row[1].client : "");
  }
  await br.close();
}
