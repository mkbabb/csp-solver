/** ACC-GRAPHITE pass-2 RESEARCH — the deck's clue, painted, with a 5-unit ablation (row 9). */
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";
const OUT = new URL("../readings/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

async function inkCount(page: Page, clip: { x: number; y: number; width: number; height: number }) {
  const buf = await page.screenshot({ type: "png", clip });
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let n = 0;
  let sum = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    if (l < 150) n++;
    sum += 255 - l;
  }
  return { inkPx: n, inkMass: Math.round(sum) };
}

test("deck clue delta", async ({ page, browserName }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("./?view=gallery&size=3&difficulty=EASY");
  await page.waitForSelector(".game-gallery", { timeout: 40000 });
  await page.waitForTimeout(3500);
  let info = await page.evaluate(() => ({
    posters: document.querySelectorAll(".poster-board").length,
    cells: document.querySelectorAll(".poster-cell").length,
    glyphs: document.querySelectorAll(".poster-cell svg path").length,
  }));
  if (info.posters === 0) {
    const btn = await page.evaluate(() => {
      const c = Array.from(document.querySelectorAll<HTMLElement>("button,[role=button]")).find(
        (b) => /sketchbook|gallery|games|back/i.test((b.getAttribute("aria-label") ?? "") + " " + (b.textContent ?? "")),
      );
      if (c) c.click();
      return c ? (c.getAttribute("aria-label") ?? c.textContent ?? "").trim().slice(0, 40) : null;
    });
    await page.waitForTimeout(2500);
    info = await page.evaluate(() => ({
      posters: document.querySelectorAll(".poster-board").length,
      cells: document.querySelectorAll(".poster-cell").length,
      glyphs: document.querySelectorAll(".poster-cell svg path").length,
    }));
    (info as Record<string, unknown>).via = btn;
  }
  const geom = await page.evaluate(() => {
    const p = document.querySelector<SVGPathElement>(".poster-cell svg path");
    if (!p) return null;
    const svg = p.ownerSVGElement!;
    const r = svg.getBoundingClientRect();
    const board = document.querySelector<HTMLElement>(".poster-board")!.getBoundingClientRect();
    const all = Array.from(document.querySelectorAll<SVGPathElement>(".poster-cell svg path"));
    const byW: Record<string, number> = {};
    for (const q of all) byW[getComputedStyle(q).strokeWidth] = (byW[getComputedStyle(q).strokeWidth] ?? 0) + 1;
    return {
      glyphSvgPx: +r.width.toFixed(2),
      viewBox: svg.getAttribute("viewBox"),
      swAttr: p.getAttribute("stroke-width"),
      sw: getComputedStyle(p).strokeWidth,
      byStrokeWidth: byW,
      board: { x: board.x, y: board.y, w: board.width, h: board.height },
    };
  });
  let delta = null;
  if (geom) {
    const clip = {
      x: Math.round(geom.board.x),
      y: Math.round(geom.board.y),
      width: Math.round(geom.board.w),
      height: Math.round(geom.board.h),
    };
    const at6 = await inkCount(page, clip);
    await page.evaluate(() => {
      const el = document.createElement("style");
      el.id = "ablate5";
      el.textContent = ".poster-cell svg path { stroke-width: 5 !important }";
      document.head.appendChild(el);
    });
    await page.waitForTimeout(500);
    const at5 = await inkCount(page, clip);
    await page.evaluate(() => document.getElementById("ablate5")?.remove());
    delta = {
      at6,
      at5,
      inkPxDelta: at6.inkPx - at5.inkPx,
      inkPxPct: +(((at6.inkPx - at5.inkPx) / at5.inkPx) * 100).toFixed(2),
      inkMassPct: +(((at6.inkMass - at5.inkMass) / at5.inkMass) * 100).toFixed(2),
    };
  }
  const out = { engine: browserName, info, geom, delta };
  writeFileSync(OUT + `deck-delta-${browserName}.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1));
  expect(true).toBe(true);
});
