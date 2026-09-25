// CTRL-TAPE pass-7 critic: do the source breaks the gate passes move PAINT? (tree :4232, dock 390x844 coarse, DPR 2, PRM)
import { ENGINES, CELLS, open, givens, sharp } from "./p6-lib.mjs";
const BASE = process.env.BASE ?? "http://127.0.0.1:4232";
const ARMS0 = [
  ["clean", ""],
  ["S2 .drawer-case > div:last-of-type{overflow:clip}", ".drawer-case > div:last-of-type{overflow:clip}"],
  ["S10 .bar-frame{inset:0 0 100% 0}", ".bar-frame{inset:0 0 100% 0 !important}"],
  ["S14 .action-bar{top:2.875rem}", ".action-bar{top:2.875rem}"],
  ["F1 .drawer-case{display:block}", ".drawer-case{display:block !important}"],
  ["F2 .controls-card{flex-shrink:0}", ".controls-card{flex-shrink:0 !important}"],
];
const read = (page) => page.evaluate(() => {
  const f = document.querySelector("#card-foot"), c = document.querySelector(".drawer-case"), card = document.querySelector(".controls-card");
  const btns = [...document.querySelectorAll("#card-foot .action-verbs button")].map((b) => b.getBoundingClientRect().bottom);
  const r = (e) => e?.getBoundingClientRect();
  return { vh: innerHeight, foot: [+r(f).top.toFixed(2), +r(f).bottom.toFixed(2)], caseB: +r(c).bottom.toFixed(2), cardH: +r(card).height.toFixed(2), cardSH: card.scrollHeight, verbMaxB: btns.length ? +Math.max(...btns).toFixed(2) : null };
});
async function ink(page) {
  const g = await read(page);
  const y0 = Math.max(0, Math.floor(g.foot[0] - 16)), y1 = Math.min(g.vh, Math.ceil(g.foot[1] + 16));
  if (y1 - y0 < 4) return { px: 0 };
  const clip = { x: 0, y: y0, width: 390, height: y1 - y0 };
  const on = await page.screenshot({ clip });
  const h = await page.addStyleTag({ content: ".bar-frame svg{visibility:hidden !important}" });
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const off = await page.screenshot({ clip });
  await h.evaluate((n) => n.remove());
  const a = await sharp(on).raw().toBuffer({ resolveWithObject: true }), b = await sharp(off).raw().toBuffer();
  let px = 0; const ch = a.info.channels;
  for (let i = 0; i < a.data.length; i += ch) if (Math.max(Math.abs(a.data[i] - b[i]), Math.abs(a.data[i + 1] - b[i + 1]), Math.abs(a.data[i + 2] - b[i + 2])) > 24) px++;
  return { px };
}
const ARMS = ARMS0.filter(([n]) => new RegExp(process.env.ARMS ?? ".").test(n));
for (const [en, eng] of ENGINES) {
  const browser = await eng.launch();
  for (const [name, css] of ARMS) {
    const { ctx, page } = await open(browser, BASE, CELLS.dock390, { prm: "reduce" });
    if (css) { await page.addStyleTag({ content: css }); await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))); await page.waitForTimeout(150); }
    const g = await read(page); const k = await ink(page);
    console.log(`${en.padEnd(8)} ${name.padEnd(46)} givens ${await givens(page)} | frame ink px ${k.px} | ${JSON.stringify(g)}`);
    await ctx.close();
  }
  await browser.close();
}
