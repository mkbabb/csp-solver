/**
 * MRK-ABS pass-1 · the three rows the family still owes.
 *
 *   MA-4  THE WASH — `.cell-peer` is a CSS box (`DigitCell.vue:261-265`, `gameCell.css:132`).
 *         The family would redraw it as a FILLED PATH on the ghost seed at the mark rung. Two
 *         numbers decide it: the wash's painted contrast against the cell it is NOT on (a
 *         wobble nobody can see is not a wobble), and the DOM population it would add —
 *         R3-h's row says the ghost path count may not go +N².
 *   MA-5  FORCED COLORS — `gameCell.css:348-356` draws a real `outline: 2px solid Highlight`
 *         on the focused cell because `forced-color-adjust` strips the SVG ghost. Any ring
 *         redesign, house-hand or token, keeps that arm. Measured with the emulation on.
 *   MA-6  THE PHONE'S FRAMES — rAF deltas during arrow-key traversal at 393×699 dpr3, the
 *         before half of the charter's before/after. A wobblier ring is the same one static
 *         path, so this is the baseline a pass-2 cure has to match.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const EV =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/MRK-ABS";
const OUT = join(EV, "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

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
async function px(page: Page, x: number, y: number): Promise<RGB> {
  const buf = await page.screenshot({ clip: { x, y, width: 2, height: 2 } });
  const { data } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  return [data[0], data[1], data[2]];
}

async function boardReady(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForTimeout(1200);
}

for (const theme of ["light", "dark"] as const) {
  test(`MA-4 THE WASH · ${theme} — painted contrast and the population it would add`, async ({
    page,
    browserName,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
    await boardReady(page);
    await page.evaluate(() => {
      const i = document.querySelectorAll<HTMLInputElement>(".game-cell input")[40];
      i?.focus();
    });
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(400);

    const geom = await page.evaluate(() => {
      // EMPTY cells only, sampled at the 22% inset corner: the centre carries a glyph, and a
      // glyph pixel is not a wash pixel (the first pass of this probe read digit ink and
      // returned 1.00 and 18.04 for the same surface in two engines).
      const empty = (c: HTMLElement) => !(c.querySelector("input") as HTMLInputElement | null)?.value;
      const cells = Array.from(document.querySelectorAll<HTMLElement>(".game-cell"));
      const peerCell = cells.find((c) => c.querySelector(".cell-peer") && empty(c)) ?? null;
      const plain = cells.find(
        (c) => !c.querySelector(".cell-peer") && !c.querySelector(".cell-ghost.is-active") && empty(c),
      );
      const peer = peerCell?.querySelector(".cell-peer") ?? null;
      const r = (e: HTMLElement | null) => {
        if (!e) return null;
        const b = e.getBoundingClientRect();
        return { x: Math.round(b.left + b.width * 0.22), y: Math.round(b.top + b.height * 0.22) };
      };
      return {
        peerCount: document.querySelectorAll(".cell-peer").length,
        ghostPaths: document.querySelectorAll(".cell-ghost-path").length,
        cells: cells.length,
        washBg: peer ? getComputedStyle(peer).backgroundColor : null,
        peerAt: r(peerCell),
        plainAt: r(plain ?? null),
      };
    });
    const washPx = geom.peerAt ? await px(page, geom.peerAt.x, geom.peerAt.y) : null;
    const plainPx = geom.plainAt ? await px(page, geom.plainAt.x, geom.plainAt.y) : null;
    const report = {
      engine: browserName,
      theme,
      ...geom,
      washPainted: washPx,
      neighbourPainted: plainPx,
      washVsNeighbour: washPx && plainPx ? ratio(washPx, plainPx) : null,
      // what a wash PATH would cost, both residencies
      populationIfEveryCell: geom.ghostPaths * 2,
      populationIfPeersOnly: geom.ghostPaths + geom.peerCount,
    };
    bank(`wash-${theme}-${browserName}.json`, report);
    console.log("WASH " + JSON.stringify(report));
    expect(geom.peerCount).toBeGreaterThan(0);
  });
}

test("MA-5 FORCED COLORS — the cell's real outline survives", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "forced-colors emulation is chromium-only here");
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light", forcedColors: "active" });
  await boardReady(page);
  await page.evaluate(() => {
    const i = document.querySelectorAll<HTMLInputElement>(".game-cell input")[40];
    i?.focus();
  });
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  const row = await page.evaluate(() => {
    const cell = document.querySelector(".game-cell:has(input:focus-visible)") as HTMLElement | null;
    if (!cell) return null;
    const cs = getComputedStyle(cell);
    const ghost = cell.querySelector(".cell-ghost-path");
    return {
      outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
      outlineOffset: cs.outlineOffset,
      ghostStroke: ghost ? getComputedStyle(ghost).stroke : null,
      forcedColorAdjust: ghost ? getComputedStyle(ghost).forcedColorAdjust : null,
    };
  });
  bank(`forcedcolors-${browserName}.json`, { engine: browserName, row });
  console.log("FORCED " + JSON.stringify(row));
  expect(row?.outline, "the forced-colors arm must still draw a real outline").toContain("solid");
});

test("MA-6 THE PHONE'S FRAMES — arrow traversal at 393×699 dpr3", async ({ browser, browserName }) => {
  const ctx = await browser.newContext({
    viewport: { width: 393, height: 699 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: true,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);
  await page.evaluate(() => {
    const i = document.querySelectorAll<HTMLInputElement>(".game-cell input")[40];
    i?.focus();
  });
  await page.evaluate(() => {
    (window as any).__f = [];
    let last = performance.now();
    const tick = (t: number) => {
      (window as any).__f.push(t - last);
      last = t;
      (window as any).__raf = requestAnimationFrame(tick);
    };
    (window as any).__raf = requestAnimationFrame(tick);
  });
  for (let i = 0; i < 24; i++) {
    await page.keyboard.press(i % 2 ? "ArrowLeft" : "ArrowRight");
    await page.waitForTimeout(60);
  }
  const frames = await page.evaluate(() => {
    cancelAnimationFrame((window as any).__raf);
    const f = ((window as any).__f as number[]).slice(1);
    const sorted = [...f].sort((a, b) => a - b);
    return {
      n: f.length,
      medianMs: Math.round(sorted[Math.floor(sorted.length / 2)] * 100) / 100,
      p95Ms: Math.round(sorted[Math.floor(sorted.length * 0.95)] * 100) / 100,
      maxMs: Math.round(sorted[sorted.length - 1] * 100) / 100,
      over33: f.filter((d) => d > 33).length,
    };
  });
  bank(`frames-phone-${browserName}.json`, { engine: browserName, frames });
  console.log("FRAMES " + JSON.stringify(frames));
  expect(frames.n).toBeGreaterThan(20);
  await ctx.close();
});
