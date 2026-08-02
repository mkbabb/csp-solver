/**
 * deal-weight — G3's OPEN HALF, measured (T5-W4a charter; CH-61; mark 5).
 *
 * THE RULING BEING EXTENDED (`766aa068`, T4-WU): "a `New game` role=group zone (Size +
 * Difficulty + the re-homed Deal) above the divider, live tools below — size goes
 * ARM-NOT-LIVE… only Deal deals." The ruling settled the GRAMMAR (options are armed, one verb
 * commits them) and lost its ratify-me row on the WEIGHT. The registry's own statement of the
 * open half is a rank claim, and it names the comparison: "the sole commit verb of the staged
 * zone is a 28px DiceIcon + caption sublabel, **visually subordinate to the option lists it
 * commits**" (`charter-f1.md` §1).
 *
 * So the pass-4 measurement answered the wrong pair. `verb-ink` weighed deal against SAFE — two
 * verbs on one rung — and found ×2.31. Nobody weighed the commit verb against the OPTION LISTS,
 * which is the comparison the mark is about. That is what this rig does, in the picker regime
 * the T5-W4a charter gives Lane A, at both pointer regimes.
 *
 * WHAT IS MEASURED, three channels, because rank is not one number:
 *   · TYPE — the declared rung. `.staging-btn` sits at 1.15rem while the band pins its chips
 *     back to 1rem (`StagingBand.vue`: "the chips are INPUTS, not the headline… Pinned to the
 *     body rung here, so the verbs lead"). A ratio ≤ 1 means the CSS never made the claim.
 *   · INK MASS — |paper − pixel| accumulated, unsigned (the pass-4 correction), per control.
 *     Against the HEAVIEST single chip, which is the honest adversary: a verb that only beats
 *     the mean of eight chips has not out-ranked the list.
 *   · DENSITY — mass over the control's own CSS area, so a bigger box is not itself an argument.
 *
 * THE GATE, stated before the run: the commit verb out-ranks the option list it commits on all
 * three channels, in both regimes. A channel that fails is a named gap, not a re-worded pass.
 *
 *   node deal-weight.mjs <baseURL>
 */
import { chromium } from "@playwright/test";
import sharp from "sharp";

const base = process.argv[2];
if (!base) throw new Error("usage: node deal-weight.mjs <baseURL>");

const REGIMES = [
  { name: "fine  1280×900 dpr2", viewport: { width: 1280, height: 900 }, dpr: 2, mobile: false },
  { name: "COARSE 390×844 dpr3", viewport: { width: 390, height: 844 }, dpr: 3, mobile: true },
];

async function inkOf(locator, dpr) {
  const box = await locator.boundingBox();
  const png = await locator.screenshot();
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const lum = [];
  for (let i = 0; i < data.length; i += info.channels)
    lum.push(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
  return { lum, cssW: box.width, cssH: box.height, dpr };
}
function paperOf(lum) {
  const hist = new Map();
  for (const v of lum) {
    const k = Math.round(v);
    hist.set(k, (hist.get(k) ?? 0) + 1);
  }
  let best = 0,
    bestN = -1;
  for (const [k, n] of hist) if (n > bestN) ((bestN = n), (best = k));
  return best;
}
function massOf({ lum, cssW, cssH, dpr }, paper) {
  let acc = 0;
  for (const v of lum) acc += Math.abs(paper - v) / 255;
  const mass = acc / (dpr * dpr);
  return { mass: +mass.toFixed(2), density: +(mass / (cssW * cssH)).toFixed(5), cssW, cssH };
}

const browser = await chromium.launch();
const out = [];
for (const regime of REGIMES) {
  const ctx = await browser.newContext({
    viewport: regime.viewport,
    deviceScaleFactor: regime.dpr,
    isMobile: regime.mobile,
    hasTouch: regime.mobile,
  });
  const page = await ctx.newPage();
  await page.goto(base + "/?view=gallery&size=3&difficulty=EASY");
  await page.waitForSelector(".staging-band", { timeout: 20000 });
  await page.waitForTimeout(700);

  const type = await page.evaluate(() => {
    const px = (el) => (el ? parseFloat(getComputedStyle(el).fontSize) : null);
    return {
      deal: px(document.querySelector(".staging-deal")),
      safe: px(document.querySelector(".staging-safe")),
      chip: px(document.querySelector(".staging-axis .ctrl-btn")),
      axisLabel: px(document.querySelector(".staging-axis-label")),
    };
  });

  const safeInk = await inkOf(page.locator(".staging-safe"), regime.dpr);
  const paper = paperOf(safeInk.lum);
  const deal = massOf(await inkOf(page.locator(".staging-deal"), regime.dpr), paper);
  const safe = massOf(safeInk, paper);

  const chipLoc = page.locator(".staging-axis .ctrl-btn");
  const chipN = await chipLoc.count();
  const chips = [];
  for (let i = 0; i < chipN; i++)
    chips.push(massOf(await inkOf(chipLoc.nth(i), regime.dpr), paper));
  const heaviest = chips.reduce((a, b) => (b.mass > a.mass ? b : a));
  const chipMassSum = +chips.reduce((a, c) => a + c.mass, 0).toFixed(2);
  const chipDensityMean = +(chips.reduce((a, c) => a + c.density, 0) / chips.length).toFixed(5);

  out.push({
    regime: regime.name,
    pointer: regime.mobile ? "coarse" : "fine",
    type,
    chipCount: chipN,
    dealBox: `${deal.cssW.toFixed(1)}×${deal.cssH.toFixed(1)}`,
    chipBox: `${heaviest.cssW.toFixed(1)}×${heaviest.cssH.toFixed(1)}`,
    massDeal: deal.mass,
    massSafe: safe.mass,
    massHeaviestChip: heaviest.mass,
    massAllChips: chipMassSum,
    densityDeal: deal.density,
    densityHeaviestChip: heaviest.density,
    densityChipMean: chipDensityMean,
    typeRatio: +(type.deal / type.chip).toFixed(3),
    massRatioVsHeaviestChip: +(deal.mass / heaviest.mass).toFixed(3),
    densityRatioVsHeaviestChip: +(deal.density / heaviest.density).toFixed(3),
    massShareOfWholeList: +(deal.mass / chipMassSum).toFixed(3),
  });
  await ctx.close();
}
await browser.close();

for (const r of out) {
  console.log(`── ${r.regime}  (pointer: ${r.pointer})`);
  console.log(
    `   type      deal ${r.type.deal}px · chip ${r.type.chip}px · axis label ${r.type.axisLabel}px` +
      `      →  deal / chip = ×${r.typeRatio}`,
  );
  console.log(
    `   ink mass  deal ${r.massDeal} (${r.dealBox}) · heaviest of ${r.chipCount} chips ` +
      `${r.massHeaviestChip} (${r.chipBox}) · all chips ${r.massAllChips}` +
      `   →  ×${r.massRatioVsHeaviestChip} vs the heaviest chip, ${(r.massShareOfWholeList * 100).toFixed(1)}% of the whole list`,
  );
  console.log(
    `   density   deal ${r.densityDeal} · heaviest chip ${r.densityHeaviestChip} · chip mean ` +
      `${r.densityChipMean}   →  ×${r.densityRatioVsHeaviestChip} vs the heaviest chip`,
  );
}
const ok = out.every(
  (r) => r.typeRatio > 1 && r.massRatioVsHeaviestChip > 1 && r.densityRatioVsHeaviestChip > 1,
);
console.log("");
console.log(
  `GATE — the commit verb out-ranks the option list it commits on TYPE, MASS and DENSITY in both regimes: ${ok ? "PASS" : "FAIL"}`,
);
console.log(JSON.stringify(out));
process.exit(ok ? 0 : 1);
