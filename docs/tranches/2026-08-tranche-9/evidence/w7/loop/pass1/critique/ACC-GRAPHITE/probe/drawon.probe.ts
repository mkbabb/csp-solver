/**
 * drawon.probe.ts — the CRITIC's test of the family's CENTRE: "a hand going round twice, the
 * second pass the other way". The draw-on is 180ms, so it is slowed to 4s in the page (a CSS
 * override on the two ghost selectors, nothing else touched) and sampled at 25% / 50% / 75%.
 *
 * It also answers the question the lane's own WebKit dash finding raises about its OWN ring:
 * `.cell-ghost-path` / `.cell-ghost-retrace` are `pathLength="1"` + `stroke-dasharray: 1`, the
 * same family of mechanism as the gauge the lane had to abandon. If WebKit restarts the phase
 * per side, the sweep is four arcs at once there, not one hand.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/ACC-GRAPHITE/readings";
mkdirSync(OUT, { recursive: true });

async function boot(page: Page) {
  await page.goto("./?size=3&difficulty=HARD");
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(900);
}

test("the draw-on, slowed: how many arcs are in flight, and on which pass", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
  await boot(page);
  await page.addStyleTag({
    content: `.game-cell:has(input:focus-visible) .cell-ghost-path,
              .game-cell:has(input:focus-visible) .cell-ghost-retrace {
                animation-duration: 4000ms !important;
              }`,
  });

  const box = await page.evaluate(() => {
    const cells = [...document.querySelectorAll<HTMLElement>(".sudoku-cell")];
    for (let i = 20; i < cells.length; i++) {
      const input = cells[i].querySelector<HTMLInputElement>("input");
      if (input && !input.value) {
        const r = cells[i].getBoundingClientRect();
        return { i, x: r.x, y: r.y, w: r.width, h: r.height };
      }
    }
    return null;
  });
  if (!box) throw new Error("no blank cell");

  // arm the ring with a real keyboard focus
  await page.evaluate((j: number) => {
    document
      .querySelectorAll<HTMLElement>(".sudoku-cell")
      [j].querySelector<HTMLInputElement>("input")
      ?.focus();
  }, box.i);
  await page.keyboard.press("ArrowRight");
  const t0 = Date.now();
  await page.keyboard.press("ArrowLeft");

  const samples: Record<string, unknown>[] = [];
  for (const at of [900, 1900, 2900]) {
    const wait = at - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    const buf = await page.screenshot({
      clip: { x: box.x, y: box.y, width: box.w, height: box.h },
      type: "png",
    });
    const { data, info } = await sharp(buf)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width: w, height: h, channels: ch } = info;
    const lum = (i: number) => 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    // walk the cell's own perimeter box (inset 8 px, where the ring lives) and count the
    // ink ARCS: contiguous runs of inked samples round the loop.
    const inset = 10;
    const pts: [number, number][] = [];
    for (let x = inset; x < w - inset; x++) pts.push([x, inset]);
    for (let y = inset; y < h - inset; y++) pts.push([w - inset - 1, y]);
    for (let x = w - inset - 1; x >= inset; x--) pts.push([x, h - inset - 1]);
    for (let y = h - inset - 1; y >= inset; y--) pts.push([inset, y]);
    const ink = pts.map(([x, y]) => {
      // a 3px band either side of the sample, to catch the wobble
      for (let d = -3; d <= 3; d++) {
        const xx = Math.min(w - 1, Math.max(0, x + (y === inset || y === h - inset - 1 ? 0 : d)));
        const yy = Math.min(h - 1, Math.max(0, y + (y === inset || y === h - inset - 1 ? d : 0)));
        if (lum((yy * w + xx) * ch) < 120) return true;
      }
      return false;
    });
    let arcs = 0;
    for (let i = 0; i < ink.length; i++) {
      const prev = ink[(i - 1 + ink.length) % ink.length];
      if (ink[i] && !prev) arcs++;
    }
    const inked = ink.filter(Boolean).length;
    samples.push({
      atMs: at,
      arcsRoundThePerimeter: arcs,
      inkedShare: +(inked / ink.length).toFixed(3),
    });
  }
  writeFileSync(
    join(OUT, `drawon-${browserName}.json`),
    JSON.stringify({ browserName, samples }, null, 2),
  );
  console.log(browserName, JSON.stringify(samples));
});
