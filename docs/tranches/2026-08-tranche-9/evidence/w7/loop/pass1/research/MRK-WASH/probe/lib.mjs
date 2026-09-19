/**
 * MRK-WASH pass-1 — shared instrument floor.
 *
 * EVERY contrast number in this lane is read from the engine's PAINTED BYTES: a PNG
 * screenshot decoded to raw RGB by sharp, then sampled inside a box. Nothing here composites
 * hex by arithmetic, because a translucent wash over a paper texture is exactly the case
 * where arithmetic and the engine disagree (the paper grain is a data-URI turbulence layer,
 * `index.css:440`), and the whole family stands on that composite.
 *
 * MEDIAN, not mean. The board's paper carries a 4%-opacity noise layer and the grid's rules
 * are wobbled graphite; a mean drags toward whichever stray dark pixel the inset did not
 * exclude. The median of an inset box is the cell's ground.
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const HERE = dirname(new URL(import.meta.url).pathname);
export const LOGS = join(HERE, "..", "logs");
export const FRAMES = join(HERE, "..", "frames");
mkdirSync(LOGS, { recursive: true });
mkdirSync(FRAMES, { recursive: true });

export const bank = (name, data) => {
  writeFileSync(join(LOGS, name), JSON.stringify(data, null, 2));
  return data;
};

const srgb = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};
export const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
export const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
};
export const r2 = (v) => Math.round(v * 100) / 100;

/** Decode a PNG buffer to a raw RGB sampler. */
export async function decode(buf) {
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
}

/**
 * Sample an inset box of a CSS-px rect. `inset` is a fraction of the rect's own size, so the
 * same call clears the ring stroke at every board size. Returns the median pixel, the darkest
 * pixel (the glyph's ink, when a glyph is in the box) and the sample count.
 */
export function sampleRect(img, rect, dpr, inset = 0.28) {
  const x0 = Math.round((rect.x + rect.width * inset) * dpr);
  const x1 = Math.round((rect.x + rect.width * (1 - inset)) * dpr);
  const y0 = Math.round((rect.y + rect.height * inset) * dpr);
  const y1 = Math.round((rect.y + rect.height * (1 - inset)) * dpr);
  const px = [];
  for (let y = Math.max(0, y0); y < Math.min(img.h, y1); y++)
    for (let x = Math.max(0, x0); x < Math.min(img.w, x1); x++) {
      const i = (y * img.w + x) * img.ch;
      px.push([img.data[i], img.data[i + 1], img.data[i + 2]]);
    }
  if (!px.length) return null;
  const byLum = px.map((p) => [lum(p), p]).sort((a, b) => a[0] - b[0]);
  const median = byLum[Math.floor(byLum.length / 2)][1];
  return {
    n: px.length,
    median,
    darkest: byLum[0][1],
    p05: byLum[Math.floor(byLum.length * 0.05)][1],
    lightest: byLum[byLum.length - 1][1],
    medianLum: Math.round(byLum[Math.floor(byLum.length / 2)][0] * 10000) / 10000,
  };
}

/** Boot a board and settle the bake + the deal. */
export async function boardReady(page, query = "?size=3&difficulty=EASY") {
  await page.goto("http://127.0.0.1:4240/" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1400);
}

/** The cell census the measurements pick their subjects from. */
export const cellCensus = (page) =>
  page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll(".game-cell"));
    return cells.map((c, i) => {
      const input = c.querySelector("input");
      const r = c.getBoundingClientRect();
      return {
        i,
        empty: !input?.value,
        given: c.className.includes("is-given") || !!c.querySelector(".glyph-svg"),
        peer: !!c.querySelector(".cell-peer"),
        because: !!c.querySelector(".cell-because"),
        peerCursor: c.classList.contains("is-peer-cursor"),
        invalid: c.classList.contains("is-invalid"),
        focused: !!c.querySelector("input:focus-visible"),
        rect: { x: r.x, y: r.y, width: r.width, height: r.height },
      };
    });
  });

export async function focusCell(page, index) {
  await page.evaluate((i) => {
    const inputs = Array.from(document.querySelectorAll(".game-cell input"));
    inputs[i]?.focus();
  }, index);
  await page.waitForTimeout(300);
}
