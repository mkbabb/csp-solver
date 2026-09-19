/**
 * T9-W7 pass 2 · MRK-ABS PROTOTYPE — THE BOARD'S OWN MARK, read from painted bytes.
 *
 * The first cut of this reading sampled the cell's CENTRE for its ground and got the glyph
 * (light ink on dark paper and the reverse), so its two ratios were ring-vs-digit. This one
 * picks an EMPTY cell, takes the paper from a quadrant the ring cannot reach, and reports the
 * adjacency as a pixel walk across the cell's own left rule.
 *
 *   ratio    ring ink (median of the blue band pixels) against the cell's paper
 *   gap      pixels of PAPER between the rule's painted ink and the ring's, on a scanline
 *            through the cell's middle (G-ABS-6 on the surface, beside the closed form)
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import sharp from "sharp";

const OUT = process.env.PROBE_OUT ?? ".";
const FRAMES = process.env.FRAME_OUT ?? join(OUT, "..", "frames");
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });
type RGB = [number, number, number];
const lum = ([r, g, b]: RGB) => {
  const f = (x: number) => {
    const v = x / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a: RGB, b: RGB) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
};
const med = (v: number[]) => v.slice().sort((a, b) => a - b)[Math.floor(v.length / 2)];
const medRGB = (v: RGB[]): RGB => [0, 1, 2].map((c) => med(v.map((p) => p[c]))) as RGB;
async function raw(buf: Buffer) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
}
const at = (I: { data: Buffer; w: number; ch: number }, x: number, y: number): RGB => {
  const i = (y * I.w + x) * I.ch;
  return [I.data[i], I.data[i + 1], I.data[i + 2]];
};
async function setTheme(page: Page, dark: boolean) {
  await page.evaluate((d) => document.documentElement.classList.toggle("dark", d), dark);
  await page.waitForTimeout(250);
}

test("b2-board-ink", async ({ page, browserName }) => {
  const report: Record<string, unknown> = { engine: browserName };
  for (const dark of [false, true]) {
    const theme = dark ? "dark" : "light";
    await page.goto("/?size=4&difficulty=EASY");
    await page.waitForSelector(".game-cell", { timeout: 30000 });
    await page.waitForFunction(() => document.querySelectorAll(".game-cell").length === 256, {
      timeout: 90000,
    });
    await setTheme(page, dark);
    await page.waitForTimeout(700);

    // an EMPTY, editable, non-edge cell: no glyph under the paper sample, four neighbours
    const pick = await page.evaluate(() => {
      const cells = Array.from(document.querySelectorAll(".game-cell"));
      for (let i = 0; i < cells.length; i++) {
        const r = Math.floor(i / 16);
        const c = i % 16;
        if (r < 2 || r > 13 || c < 2 || c > 13) continue;
        const inp = cells[i].querySelector("input") as HTMLInputElement;
        if (!inp || inp.value || inp.readOnly || inp.disabled) continue;
        inp.focus();
        return i;
      }
      return -1;
    });
    await page.waitForTimeout(450);

    const facts = await page.evaluate((i) => {
      const cell = document.querySelectorAll(".game-cell")[i] as HTMLElement;
      const ghost = cell.querySelector(".cell-ghost svg") as SVGSVGElement;
      const p = cell.querySelector(".cell-ghost-path") as SVGPathElement;
      const cs = getComputedStyle(p);
      const gr = ghost.getBoundingClientRect();
      const vb = ghost.getAttribute("viewBox")!.split(/\s+/).map(Number);
      const card = document.querySelector(".game-card, .board-card, .paper-card") as HTMLElement | null;
      return {
        index: i,
        d: p.getAttribute("d"),
        viewBox: ghost.getAttribute("viewBox"),
        pxPerGhostUnit: Math.round((gr.width / vb[2]) * 1e6) / 1e6,
        ghostRect: [gr.x, gr.y, gr.width, gr.height].map((v) => Math.round(v * 100) / 100),
        stroke: cs.stroke,
        strokeWidth: cs.strokeWidth,
        strokeOpacity: cs.strokeOpacity,
        fillOpacity: cs.fillOpacity,
        focusVisible: (cell.querySelector("input") as HTMLElement).matches(":focus-visible"),
        inputOutline: getComputedStyle(cell.querySelector("input")!).outlineStyle,
        htmlClass: document.documentElement.className,
        cardGround: card ? getComputedStyle(card).backgroundColor : null,
      };
    }, pick);

    const box = (await page.locator(".game-cell").nth(pick).boundingBox())!;
    const pad = 16;
    const clip = {
      x: Math.floor(box.x - pad),
      y: Math.floor(box.y - pad),
      width: Math.ceil(box.width + pad * 2),
      height: Math.ceil(box.height + pad * 2),
    };
    // At dpr 1 a 0.78px gap cannot be resolved (both marks antialias into it), so the walk is
    // taken in DEVICE pixels and every x below is device px divided by the scale factor.
    const dpr = await page.evaluate(() => window.devicePixelRatio);
    const shot = await page.screenshot({ clip, scale: "device" });
    const I = await raw(shot);
    const bx = (box.x - clip.x) * dpr;
    const by = (box.y - clip.y) * dpr;
    box.width *= dpr;
    box.height *= dpr;
    const blueness = (p: RGB) => p[2] - (p[0] + p[1]) / 2;

    // PAPER: a band inside the cell but inside the ring's inset too (the ring is at 0.86 of
    // the cell and the glyph sits centred, so the quadrant corner is paper on both counts).
    const paperPts: RGB[] = [];
    for (let dx = 0.32; dx <= 0.44; dx += 0.03)
      for (let dy = 0.32; dy <= 0.44; dy += 0.03)
        paperPts.push(at(I, Math.round(bx + box.width * dx), Math.round(by + box.height * dy)));
    const paper = medRGB(paperPts);

    // RING: every pixel in the clip whose blueness stands out; the median is the ring's ink.
    const blues: RGB[] = [];
    for (let y = 0; y < I.h; y++)
      for (let x = 0; x < I.w; x++) {
        const p = at(I, x, y);
        if (blueness(p) - blueness(paper) > 18) blues.push(p);
      }
    const ringInk = blues.length ? medRGB(blues) : null;

    // ADJACENCY: a scanline through the cell's middle, walking out through the LEFT rule.
    const yMid = Math.round(by + box.height / 2);
    const walk: { x: number; rgb: RGB; blue: number; dLum: number }[] = [];
    for (let x = Math.max(0, Math.round(bx) - 12 * dpr); x < Math.round(bx) + 16 * dpr; x++) {
      const p = at(I, x, yMid);
      walk.push({
        x: x - Math.round(bx),
        rgb: p,
        blue: Math.round((blueness(p) - blueness(paper)) * 10) / 10,
        dLum: Math.round(Math.abs(lum(p) - lum(paper)) * 1000) / 1000,
      });
    }
    // The ring's own antialiased fringe is faintly blue; counting it as rule ink is what made
    // the first cut of this walk report a zero gap. The rule is ink that is NOT blue at all.
    const isRing = (s: (typeof walk)[0]) => s.blue > 18;
    const isRule = (s: (typeof walk)[0]) => s.blue <= 6 && s.dLum > 0.02;
    const ringXs = walk.filter(isRing).map((s) => s.x);
    const ruleXs = walk.filter(isRule).map((s) => s.x);
    const leftRing = ringXs.length ? Math.min(...ringXs) : null;
    const rightRule = ruleXs.filter((x) => (leftRing === null ? true : x < leftRing));
    const nearestRule = rightRule.length ? Math.max(...rightRule) : null;
    const gapPx = leftRing !== null && nearestRule !== null ? leftRing - nearestRule - 1 : null;

    report[theme] = {
      pick,
      facts,
      paper,
      ringInk,
      ringPixels: blues.length,
      ratio: ringInk ? ratio(ringInk, paper) : null,
      dpr,
      adjacency: {
        leftRingXdev: leftRing,
        nearestRuleXdev: nearestRule,
        gapDevicePx: gapPx,
        gapCssPx: gapPx === null ? null : Math.round((gapPx / dpr) * 100) / 100,
        walk,
      },
    };
    console.log(
      `[board2 ${browserName} ${theme}] px/unit ${facts.pxPerGhostUnit} · ring ${JSON.stringify(ringInk)} on paper ${JSON.stringify(paper)} = ${report[theme] && (report[theme] as { ratio: number }).ratio}:1 · gap ${gapPx} device px = ${gapPx === null ? null : (gapPx / dpr).toFixed(2)} css px (rule x${nearestRule} -> ring x${leftRing}, dpr ${dpr})`,
    );

    if (dark && browserName === "chromium") {
      await page.screenshot({
        path: join(FRAMES, "crop1-cell-16x16-dark-f086.png"),
        clip: {
          x: Math.floor(box.x - box.width / dpr),
          y: Math.floor(box.y - box.height / dpr),
          width: Math.ceil((box.width / dpr) * 3),
          height: Math.ceil((box.height / dpr) * 3),
        },
        scale: "device",
      });
    }
  }
  writeFileSync(join(OUT, `p2-board2-${browserName}.json`), JSON.stringify(report, null, 2));
});
