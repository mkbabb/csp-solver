import { ENGINES, CELLS, open } from "./p6-lib.mjs";
const BASE = process.argv[2];
for (const [eng, L] of ENGINES.slice(0,1)) {
  const br = await L.launch();
  for (const c of ["dock390", "land844"]) {
    const { ctx, page } = await open(br, BASE, CELLS[c], { dpr: 1 });
    console.log(eng, c, JSON.stringify(await page.evaluate(() => {
      const card = document.querySelector("#controls-drawer .controls-card");
      const foot = document.querySelector("#card-foot"); const bar = document.querySelector(".action-bar");
      const svg = document.querySelector(".bar-frame svg");
      const cr = card.getBoundingClientRect(), fr = foot.getBoundingClientRect(), br = bar.getBoundingClientRect(), sr = svg?.getBoundingClientRect();
      const after = getComputedStyle(card, "::after");
      const cs = getComputedStyle(foot);
      return { cardBottom: cr.bottom, clientBottom: cr.top + card.clientTop + card.clientHeight, footTop: fr.top, footPadTop: cs.paddingTop, footPadBottom: cs.paddingBottom, barTop: br.top, barBottom: br.bottom, svgTop: sr?.top, svgBottom: sr?.bottom, afterH: after.height, afterBg: after.backgroundImage.slice(0,80), cardPadB: getComputedStyle(card).paddingBottom, foldBelow: card.hasAttribute("data-fold-below") };
    })));
    await ctx.close();
  }
  await br.close();
}
