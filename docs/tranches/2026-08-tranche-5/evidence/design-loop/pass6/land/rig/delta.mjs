/**
 * PASS-6 LAND · delta.mjs — the DELTA crops, where pixels move by design.
 *
 * DPR 1, one viewport, at rest (the evidence policy's own shape), each shot ≤150 KB. Five
 * pairs: the case at rest before/after, the case OPEN (after only — there is no such pose
 * before), landscape before/after (the pair that proves 0-diff identity) and the 1280 rail
 * (likewise). The landscape and rail pairs are the ones that must look the SAME; they are shot
 * precisely because a claim of identity is worth nothing unheld to an eye.
 *
 * Usage: node delta.mjs <baseURL> <engine> <tag> <outdir>
 */
import { chromium, webkit } from "playwright";

const CELLS = [
  // RECROPPED TO THE PIXELS UNDER AUDIT (EVIDENCE-POLICY: text-first for anything a number can
  // state). The whole-viewport cuts of these four cells came to 1.1 MB and put the design-loop
  // wave over its 2 MB band; the whole-page claims they carried are NUMBERS and are stated as
  // numbers in the report (`docScrollH ≡ innerHeight`, `maxScroll 0`, the fold census, the
  // field-by-field geometry identity). What a number cannot state is what these bands hold.
  //
  // · THE CASE, rest — the band BELOW the board is where every pixel moves by design: the card
  //   left the flow, the reserved line stayed, the verbs band and the tongue arrived.
  { id: "case-fold-band", w: 390, h: 664, coarse: true, open: false,
    clip: { x: 0, y: 470, width: 390, height: 194 } },
  // · THE CASE, open — the seam the cap derivation buys: the masthead whole, the sheet's top
  //   edge, the grid's top rows peeking above it, and the handle at the case's corner.
  { id: "case-open-seam", w: 390, h: 664, coarse: true, open: true,
    clip: { x: 0, y: 120, width: 390, height: 230 } },
  // · LANDSCAPE — the masthead move's own eye, and the one crop that caught this lane's own
  //   gutter error when every number read correct. The left half is where the wordmark went.
  { id: "land-masthead", w: 844, h: 390, coarse: true, open: false,
    clip: { x: 0, y: 0, width: 430, height: 390 } },
  // · THE RAIL — identity, and identity is a number. Kept as a narrow band so the eye has a
  //   witness at all; the field-by-field ledger comparison is what actually holds the claim.
  { id: "rail-band", w: 1280, h: 800, coarse: false, open: false,
    clip: { x: 0, y: 0, width: 1280, height: 220 } },
];

const [, , baseURL, engineName, tag, outdir] = process.argv;
const engine = engineName === "webkit" ? webkit : chromium;
const browser = await engine.launch();

for (const cell of CELLS) {
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    hasTouch: cell.coarse,
    isMobile: cell.coarse && engineName !== "webkit" ? true : false,
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(`${baseURL}/?size=3&difficulty=EASY`, { waitUntil: "load" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none !important}" });
  await page
    .waitForFunction(
      () => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0,
      { timeout: 20000 },
    )
    .catch(() => {});
  await page.waitForTimeout(900);
  if (cell.open) {
    const tab = page.locator(".drawer-tab");
    if (await tab.isVisible().catch(() => false)) {
      await tab.click();
      await page.waitForTimeout(900);
    } else {
      await ctx.close();
      continue; // no such pose on this arm — never fake it
    }
  }
  await page.screenshot({
    path: `${outdir}/${cell.id}-${tag}-${engineName}.png`,
    ...(cell.clip ? { clip: cell.clip } : {}),
  });
  await ctx.close();
}
await browser.close();
console.log("crops written");
