/**
 * G0b — the dash law's OTHER candidate variable: SUBPATH COUNT under `pathLength`.
 *
 * G0's four declaration arms came back identical in both engines (0.164-0.167 everywhere), so
 * "where the dash is declared" does not explain ACC-FIVE's 0.921 WebKit reading on the shipped
 * gauge. The next variable the three lanes never varied on purpose is how many SUBPATHS the
 * ring is: `pathLength` normalises against the path's total length, and an engine that applies
 * the scale per subpath restarts the pattern once per side — which is exactly the shape of
 * "four times the ticks".
 *
 * Arms: 1 subpath vs 4 subpaths (the SAME points, cut), attr vs CSS dasharray, both engines.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/ACC-GRAPHITE/readings";
mkdirSync(OUT, { recursive: true });

async function framePath(page: Page): Promise<string> {
  await page.goto("./?size=3&difficulty=HARD");
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await page.waitForTimeout(700);
  return page.evaluate(
    () =>
      document.querySelector<SVGPathElement>("path.frame-line")?.getAttribute("d") ?? "",
  );
}

/** Cut a single `M … L … Z` polyline into `n` separate subpaths over the same points. */
function split(d: string, n: number): string {
  const pts = d.match(/-?\d[\d.e+-]*,-?\d[\d.e+-]*/g) ?? [];
  if (n <= 1) return d;
  const per = Math.ceil(pts.length / n);
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const chunk = pts.slice(i * per, Math.min(pts.length, (i + 1) * per + 1));
    if (chunk.length > 1) out.push("M" + chunk.join(" L"));
  }
  return out.join(" ");
}

const PAGE = (d: string, attr: boolean, dashed: boolean) => `
<!doctype html><html><head><meta charset="utf-8"><style>
 html,body{margin:0;background:#fff} svg{display:block}
 #p { ${dashed && !attr ? "stroke-dasharray: 1000 1000; stroke-dashoffset: 750;" : ""} }
</style></head><body>
<svg width="600" height="600" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
 <path id="p" d="${d}" fill="none" stroke="#000" stroke-width="10" pathLength="1000"
   ${dashed && attr ? 'stroke-dasharray="1000 1000" stroke-dashoffset="750"' : ""} />
</svg></body></html>`;

async function ink(page: Page): Promise<number> {
  const buf = await page.screenshot({ type: "png" });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  let n = 0;
  for (let i = 0; i < info.width * info.height; i++) {
    const o = i * info.channels;
    if (data[o] < 200 && data[o + 1] < 200 && data[o + 2] < 200) n++;
  }
  return n;
}

test("G0b subpath arms", async ({ page, browserName, browser }) => {
  const d = await framePath(page);
  const ctx = await browser.newContext({
    viewport: { width: 620, height: 620 },
    deviceScaleFactor: 1,
  });
  const p = await ctx.newPage();
  const arms: Record<string, unknown> = {};
  for (const subpaths of [1, 2, 4, 8]) {
    const dd = split(d, subpaths);
    for (const attr of [true, false]) {
      await p.setContent(PAGE(dd, attr, true));
      await p.waitForTimeout(120);
      const dashed = await ink(p);
      await p.setContent(PAGE(dd, attr, false));
      await p.waitForTimeout(120);
      const whole = await ink(p);
      arms[`${subpaths}-subpath / ${attr ? "attr" : "css"}`] = {
        paintedShare: whole ? +(dashed / whole).toFixed(3) : null,
      };
    }
  }
  await ctx.close();
  const out = {
    engine: browserName,
    sourceSubpaths: (d.match(/M/gi) ?? []).length,
    arms,
  };
  writeFileSync(`${OUT}/g0b-subpaths-${browserName}.json`, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out));
});
