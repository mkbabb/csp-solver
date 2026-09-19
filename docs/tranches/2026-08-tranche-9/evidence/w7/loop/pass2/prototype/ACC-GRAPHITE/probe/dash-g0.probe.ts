/**
 * G0 — THE DASH LAW, BOUNDED (the section's instrument, ACC-GRAPHITE pass 2).
 *
 * One bare page, the board's own pose-0 frame `d`, `pathLength="1000"`, dasharray `1000 1000`
 * at dashoffset 750 — a period LONGER than the path, which is exactly the shipped fill gauge's
 * form. FOUR arms, crossing where each half of the dash is declared:
 *
 *   attr/attr · attr/css · css/attr · css/css        × chromium + webkit × dpr 1 + dpr 3
 *
 * The reading is the PAINTED SHARE: ink pixels with the dash applied over ink pixels of the
 * same path stroked whole. p = 0.25 is what the arithmetic says. The claim under test is that
 * the arms disagree by ENGINE only where the dasharray is a presentation ATTRIBUTE.
 *
 * Writes readings/g0-dash-<engine>-dpr<n>.json.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/ACC-GRAPHITE/readings";
mkdirSync(OUT, { recursive: true });

/** The real pose-0 frame path, lifted off the running board so the probe rides the shipped
 *  geometry rather than a rectangle someone typed. */
async function posePath(page: Page): Promise<string> {
  await page.goto("./?size=3&difficulty=HARD");
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await page.waitForTimeout(700);
  return page.evaluate(
    () =>
      document.querySelector<SVGPathElement>("path.frame-line")?.getAttribute("d") ?? "",
  );
}

const PAGE = (d: string, dashAttr: boolean, offAttr: boolean, dashed: boolean) => `
<!doctype html><html><head><meta charset="utf-8"><style>
  html,body { margin:0; background:#fff; }
  svg { display:block; }
  #p { ${dashed && !dashAttr ? "stroke-dasharray: 1000 1000;" : ""} ${
    dashed && !offAttr ? "stroke-dashoffset: 750;" : ""
  } }
</style></head><body>
<svg width="600" height="600" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <path id="p" d="${d}" fill="none" stroke="#000" stroke-width="10" pathLength="1000"
    ${dashed && dashAttr ? 'stroke-dasharray="1000 1000"' : ""}
    ${dashed && offAttr ? 'stroke-dashoffset="750"' : ""} />
</svg></body></html>`;

async function inkPixels(page: Page): Promise<number> {
  const buf = await page.screenshot({ type: "png" });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  let ink = 0;
  for (let i = 0; i < info.width * info.height; i++) {
    const o = i * info.channels;
    // anything appreciably darker than the white ground
    if (data[o] < 200 && data[o + 1] < 200 && data[o + 2] < 200) ink++;
  }
  return ink;
}

for (const dpr of [1, 3]) {
  test(`G0 dash bound — dpr ${dpr}`, async ({ page, browserName, browser }) => {
    const d = await posePath(page);
    if (!d) throw new Error("no frame path");
    const ctx = await browser.newContext({
      viewport: { width: 620, height: 620 },
      deviceScaleFactor: dpr,
    });
    const p = await ctx.newPage();
    const arms: Record<string, unknown> = {};
    for (const [name, dashAttr, offAttr] of [
      ["attr-dasharray + attr-dashoffset", true, true],
      ["attr-dasharray + css-dashoffset", true, false],
      ["css-dasharray + attr-dashoffset", false, true],
      ["css-dasharray + css-dashoffset", false, false],
    ] as const) {
      await p.setContent(PAGE(d, dashAttr, offAttr, true));
      await p.waitForTimeout(120);
      const dashed = await inkPixels(p);
      await p.setContent(PAGE(d, dashAttr, offAttr, false));
      await p.waitForTimeout(120);
      const whole = await inkPixels(p);
      arms[name] = {
        dashedInkPx: dashed,
        wholeInkPx: whole,
        paintedShare: whole ? +(dashed / whole).toFixed(3) : null,
      };
    }
    await ctx.close();
    const shares = Object.values(arms).map(
      (a) => (a as { paintedShare: number }).paintedShare,
    );
    const out = {
      engine: browserName,
      dpr,
      expectedShare: 0.25,
      arms,
      spreadPoints: +((Math.max(...shares) - Math.min(...shares)) * 100).toFixed(1),
    };
    writeFileSync(
      `${OUT}/g0-dash-${browserName}-dpr${dpr}.json`,
      JSON.stringify(out, null, 2),
    );
    console.log(JSON.stringify(out));
  });
}
