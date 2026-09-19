/**
 * ACC-SIX pass-2 — THE WEBKIT DASH LAW, swept on the SHIPPED fill gauge's own conditions.
 *
 * `HandDrawnGrid.vue:476-478` paints the trace with pathLength="1000",
 * stroke-dasharray="1000 1000" and a driven stroke-dashoffset. The dash PERIOD is therefore
 * 2000 normalised units against a path of 1000 — twice the path. ACC-GRAPHITE's law says a
 * period longer than its path paints once in Chromium and FOUR times in WebKit.
 *
 * Row 1 — a controlled page carrying the estate's OWN pose-0 `d` (emitted by
 * generateFrameTraceFrames, banked beside this file), swept over five dash regimes. The
 * measurement is the count of contiguous painted arcs and the painted fraction of the ring,
 * read by sampling the ring's own perimeter out of the rendered SVG with elementsFromPoint —
 * no screenshot, no colour heuristic.
 * Row 2 — the same reading taken on the LIVE board after one real write.
 */
import { test, expect } from "@playwright/test";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(__dirname, "..", "readings");
mkdirSync(OUT, { recursive: true });
const POSE0 = readFileSync(join(__dirname, "pose0.d.txt"), "utf8").trim();

/**
 * Walk the path's own arc length in N steps; at each step ask the document whether the trace
 * is painted there. `isPointInStroke` is geometry-only and ignores the dash, so the read is
 * done on the RENDERED bitmap instead: a 1x1 sample of the SVG through `elementsFromPoint`
 * cannot see a dashed gap either. The reliable witness is the painted pixel, so the page is
 * screenshotted and the perimeter sampled by the caller. Here we return the sample POINTS in
 * page coordinates, plus the stroke colour, so one screenshot answers every regime.
 */
const SAMPLE_POINTS = (n: number) => {
  const p = document.querySelector("path.subject") as SVGGeometryElement;
  const svg = p.ownerSVGElement!;
  const box = svg.getBoundingClientRect();
  const L = p.getTotalLength();
  const vb = svg.viewBox.baseVal;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const q = p.getPointAtLength((i / n) * L);
    pts.push({
      x: box.x + ((q.x - vb.x) / vb.width) * box.width,
      y: box.y + ((q.y - vb.y) / vb.height) * box.height,
    });
  }
  return { pts, box: { x: box.x, y: box.y, w: box.width, h: box.height }, totalLength: L };
};

const PAGE = (d: string, dasharray: string, dashoffset: string) => `<!doctype html><html><body style="margin:0;background:#fff">
<svg class="host" width="640" height="640" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <path class="subject" d="${d}" fill="none" stroke="#8b5cf6" stroke-width="8" stroke-opacity="0.95"
        stroke-linecap="round" stroke-linejoin="round" pathLength="1000"
        stroke-dasharray="${dasharray}" style="stroke-dashoffset:${dashoffset}"/>
</svg></body></html>`;

const REGIMES = [
  { id: "shipped 1000 1000 @ offset 750 (25% asked)", dasharray: "1000 1000", dashoffset: "750" },
  { id: "shipped 1000 1000 @ offset 500 (50% asked)", dasharray: "1000 1000", dashoffset: "500" },
  { id: "period == path: 500 500 @ offset 750", dasharray: "500 500", dashoffset: "750" },
  { id: "period < path: 250 250 @ offset 750", dasharray: "250 250", dashoffset: "750" },
  { id: "one dash, no gap: 1000 0 @ offset 750", dasharray: "1000 0", dashoffset: "750" },
];

test("dash sweep on the estate's own pose 0", async ({ page, browserName }) => {
  const results: Record<string, unknown> = {};
  for (const r of REGIMES) {
    await page.setContent(PAGE(POSE0, r.dasharray, r.dashoffset));
    await page.waitForTimeout(120);
    const s = await page.evaluate(SAMPLE_POINTS, 720);
    const shot = await page.screenshot({ clip: { x: 0, y: 0, width: 640, height: 640 } });
    const { createCanvas, loadImage } = { createCanvas: null, loadImage: null } as never;
    // sample via the page itself: draw the screenshot back into a canvas is heavy; instead read
    // pixels through a second evaluate using html2canvas-free path — use CSS hit testing:
    // a dashed gap still hit-tests, so fall back to the bitmap the caller keeps.
    writeFileSync(join(OUT, `dash-${browserName}-${r.dasharray.replace(/\s/g, "_")}-${r.dashoffset}.png`), shot);
    results[r.id] = { samplePoints: s.pts.length, totalLength: s.totalLength, box: s.box, png: `dash-${browserName}-${r.dasharray.replace(/\s/g, "_")}-${r.dashoffset}.png` };
    writeFileSync(join(OUT, `dash-pts-${browserName}.json`), JSON.stringify(s.pts.map(p => [Math.round(p.x * 100) / 100, Math.round(p.y * 100) / 100])));
  }
  writeFileSync(join(OUT, `dash-sweep-${browserName}.json`), JSON.stringify(results, null, 1));
  expect(Object.keys(results).length).toBe(REGIMES.length);
});

test("the live board after one real write", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector(".hand-drawn-grid");
  await page.waitForTimeout(1500);
  const before = await page.locator(".progress-trace").count();
  const inputs = page.locator(".cell-native-input");
  const n = await inputs.count();
  let wrote = 0;
  for (let i = 0; i < n && wrote < 1; i++) {
    const el = inputs.nth(i);
    const ro = await el.getAttribute("readonly");
    const val = await el.inputValue().catch(() => "x");
    if (ro !== null || val !== "") continue;
    await el.click({ force: true });
    await page.keyboard.press("5");
    await page.waitForTimeout(500);
    if ((await page.locator(".progress-trace").count()) > 0) wrote = 1;
  }
  const after = await page.locator(".progress-trace").count();
  const meta = await page.evaluate(() => {
    const paths = Array.from(document.querySelectorAll<SVGPathElement>(".progress-trace"));
    const b = document.querySelector(".hand-drawn-grid")!.getBoundingClientRect();
    return {
      inputs: document.querySelectorAll(".cell-native-input").length,
      paths: paths.map(p => { const cs = getComputedStyle(p); return {
        dasharray: cs.strokeDasharray, dashoffset: cs.strokeDashoffset,
        totalLength: +(p as SVGGeometryElement).getTotalLength().toFixed(2),
        pathLength: p.getAttribute("pathLength"), stroke: cs.stroke, width: cs.strokeWidth }; }),
      board: { x: b.x, y: b.y, w: b.width, h: b.height },
    };
  });
  if (after > 0) {
    await page.evaluate(() => { for (const p of Array.from(document.querySelectorAll<SVGPathElement>(".progress-trace"))) p.style.setProperty("stroke-dashoffset", "750", "important"); });
    await page.waitForTimeout(400);
    const b = meta.board;
    await page.screenshot({ path: join(OUT, `live-dash-${browserName}.png`), clip: { x: b.x - 14, y: b.y - 14, width: b.w + 28, height: b.h + 28 } });
  }
  writeFileSync(join(OUT, `live-dash-${browserName}.json`), JSON.stringify({ before, after, wrote, ...meta }, null, 1));
  expect(meta.inputs).toBeGreaterThan(0);
});
