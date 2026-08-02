/**
 * verb-ink — THE COARSE CELL (pass-5 Lane A, minor A-m3).
 *
 * Pass 4 measured the band's two verbs at 1280×900 DPR2 only — fine pointer, desktop column —
 * on a campaign whose owner mark is iOS. The band is a DIFFERENT control under `(pointer:
 * coarse)`: `.staging-btn` takes `min-height: 44px` and `padding-inline: 1.1rem`, the slip drops
 * out of its `min-width: 40rem` row layout into a column, and the chips grow to 44 px too. The
 * rank claim ("the destructive verb is the heavier mark") was never taken where the owner's
 * complaint lives. One coarse cell, and a fine cell beside it on the SAME instrument so the two
 * are comparable.
 *
 * PROVENANCE, banked not buried: pass 4's `rigA/` committed only `package.json` and a
 * `node_modules` symlink — `verb-ink.mjs` is absent from the tree at `66fa5856`. This is a
 * RE-AUTHORING against pass 4's published schema and gate, not that script recovered. Its
 * absolute masses are its own instrument's; the fine cell is re-taken here for exactly that
 * reason, so the coarse/fine comparison never crosses instruments.
 *
 * THE MEASURE (pass 2's `inkmass`, with pass 4's own correction): ink is |paper − pixel| on
 * luminance, UNSIGNED — the pass-4 dossier disclosed that the pass-2/3 instrument accumulated
 * the signed difference and therefore read 0.00 in every dark-theme cell. Paper is the modal
 * luminance of the SAFE verb's crop (a transparent-background control, so its dominant colour
 * is the surface behind both verbs). Mass is CSS px² of full-strength ink; density is mass over
 * the control's own CSS area, so a 44 px coarse button is not flattered by being bigger.
 *
 * ARMS: `shipped`, and the `flat` control pass 4 wrote to embarrass the instrument — the deal
 * verb's own border weight and background tint reverted to the shared `.staging-btn` rung AND
 * the die hidden (`visibility`, so layout holds). `flat` must FAIL the gate; a rig where both
 * arms pass is measuring the word count.
 *
 *   node verb-ink.mjs <baseURL>
 */
import { chromium } from "@playwright/test";
import sharp from "sharp";

const base = process.argv[2];
if (!base) throw new Error("usage: node verb-ink.mjs <baseURL>");

const REGIMES = [
  { name: "fine  1280×900 dpr2", viewport: { width: 1280, height: 900 }, dpr: 2, mobile: false },
  { name: "COARSE 390×844 dpr3", viewport: { width: 390, height: 844 }, dpr: 3, mobile: true },
];

/** The `flat` control, as a stylesheet: the deal verb reduced to its word. */
const FLAT_CSS = `
  .staging-deal { border-color: color-mix(in srgb, var(--color-foreground) 30%, transparent) !important;
                  background: transparent !important; }
  .staging-deal svg { visibility: hidden !important; }
`;

async function inkOf(locator, dpr) {
  const box = await locator.boundingBox();
  const png = await locator.screenshot();
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const lum = [];
  for (let i = 0; i < data.length; i += info.channels)
    lum.push(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
  return { lum, cssW: box.width, cssH: box.height, dpr };
}

/** Modal luminance, bucketed to 1 unit — the surface the control sits on. */
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
  const mass = acc / (dpr * dpr); // device px → CSS px²
  return { mass: +mass.toFixed(2), density: +(mass / (cssW * cssH)).toFixed(5), cssW, cssH };
}

const browser = await chromium.launch();
const rows = [];
for (const regime of REGIMES) {
  for (const arm of ["shipped", "control: flat"]) {
    const ctx = await browser.newContext({
      viewport: regime.viewport,
      deviceScaleFactor: regime.dpr,
      isMobile: regime.mobile,
      hasTouch: regime.mobile,
    });
    const page = await ctx.newPage();
    await page.goto(base + "/?view=gallery&size=3&difficulty=EASY");
    await page.waitForSelector(".staging-band", { timeout: 20000 });
    if (arm !== "shipped") await page.addStyleTag({ content: FLAT_CSS });
    await page.waitForTimeout(700); // the deck's entry beats, settled (filter-census idiom)

    const safe = await inkOf(page.locator(".staging-safe"), regime.dpr);
    const deal = await inkOf(page.locator(".staging-deal"), regime.dpr);
    const paper = paperOf(safe.lum);
    const s = massOf(safe, paper);
    const d = massOf(deal, paper);
    const gate = d.mass > s.mass && d.density > s.density ? "PASS" : "FAIL";
    rows.push({
      regime: regime.name,
      pointer: regime.mobile ? "coarse" : "fine",
      arm,
      paper,
      safeBox: `${s.cssW.toFixed(1)}×${s.cssH.toFixed(1)}`,
      dealBox: `${d.cssW.toFixed(1)}×${d.cssH.toFixed(1)}`,
      massSafe: s.mass,
      massDeal: d.mass,
      massRatio: +(d.mass / s.mass).toFixed(3),
      densitySafe: s.density,
      densityDeal: d.density,
      densityRatio: +(d.density / s.density).toFixed(3),
      gate,
    });
    await ctx.close();
  }
}
await browser.close();

console.log(
  `${"regime".padEnd(20)} ${"arm".padEnd(14)} ${"safe box".padEnd(12)} ${"deal box".padEnd(12)}` +
    `  mass safe→deal            density safe→deal        gate`,
);
for (const r of rows)
  console.log(
    `${r.regime.padEnd(20)} ${r.arm.padEnd(14)} ${r.safeBox.padEnd(12)} ${r.dealBox.padEnd(12)}` +
      `  ${String(r.massSafe).padStart(7)} → ${String(r.massDeal).padStart(7)} ×${r.massRatio}` +
      `   ${r.densitySafe} → ${r.densityDeal} ×${r.densityRatio}   ${r.gate}`,
  );
const shipped = rows.filter((r) => r.arm === "shipped");
const flat = rows.filter((r) => r.arm !== "shipped");
const ok = shipped.every((r) => r.gate === "PASS") && flat.every((r) => r.gate === "FAIL");
console.log("");
console.log(`GATE: shipped PASSes both regimes AND the flat control FAILs both — ${ok ? "PASS" : "FAIL"}`);
console.log(JSON.stringify(rows));
process.exit(ok ? 0 : 1);
