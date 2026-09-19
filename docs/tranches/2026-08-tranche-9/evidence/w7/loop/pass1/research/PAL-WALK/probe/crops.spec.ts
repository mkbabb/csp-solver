/**
 * PAL-WALK · P4 — the two crops the numbers cannot carry.
 *
 * The pair on show is the WORST one a room of 16 produces: arc-walk indices 2 and 15, which
 * the engine paints 3.39deg apart in light (P1's `painted-law.txt`). The overlay maps the two
 * peers the local wire hands out (indices 0 and 1) onto exactly that pair, so the crop is the
 * minimum separation and not a comfortable sample.
 */
import { test, expect, type Page } from "@playwright/test";
import fs from "fs";
import path from "path";

const WALK = JSON.parse(fs.readFileSync(path.join(__dirname, "walk.json"), "utf8"));
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/PAL-WALK";
const SOLO = "./?size=3&difficulty=EASY&wire=local";
const PAIR = [2, 15]; // the minimum-separation pair over the first 16

function overlay(selfHue: number): string {
  return [
    `[style*="0.11 0.0deg"]{--color-user-ink:oklch(var(--peer-ink-l) ${WALK.chroma} ${WALK.hues[PAIR[0]]}deg)!important}`,
    `[style*="0.11 137.5deg"]{--color-user-ink:oklch(var(--peer-ink-l) ${WALK.chroma} ${WALK.hues[PAIR[1]]}deg)!important}`,
    `body:has(.players-leave){--color-user-ink:oklch(var(--peer-ink-l) ${WALK.chroma} ${selfHue}deg)!important}`,
  ].join("\n");
}

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 })
    .toBeGreaterThan(0);
}

test("P4 — the roster and the board at the minimum separation", async ({ browser }, info) => {
  const ctx = await browser.newContext({ deviceScaleFactor: 3 });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  await a.addStyleTag({ content: overlay(WALK.hues[PAIR[0]]) });
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await b.addStyleTag({ content: overlay(WALK.hues[PAIR[1]]) });
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2);
  await a.waitForTimeout(400);

  // two EMPTY cells, side by side, one written by each page
  const emptyPair = async (p: Page) =>
    p.evaluate(() => {
      const cells = [...document.querySelectorAll<HTMLElement>(".sudoku-cell")];
      for (let i = 0; i < cells.length - 1; i++) {
        const ok = (c: HTMLElement) => {
          const inp = c.querySelector<HTMLInputElement>("input");
          return inp && !inp.readOnly && !inp.disabled && !c.querySelector(".glyph-svg path");
        };
        if (ok(cells[i]) && ok(cells[i + 1])) return [i, i + 1];
      }
      return null;
    });
  const pair = await emptyPair(a);
  console.log(`empty adjacent pair: ${JSON.stringify(pair)}`);
  const typeAt = async (p: Page, idx: number, d: string) => {
    const c = p.locator(".sudoku-cell").nth(idx).locator("input");
    await c.click();
    await p.keyboard.press(d);
    await p.waitForTimeout(400);
  };
  if (pair) {
    await typeAt(a, pair[0], "4");
    await typeAt(b, pair[1], "6");
    await a.waitForTimeout(900);
  }
  const strokes = await a.evaluate((pr) => {
    if (!pr) return null;
    const cells = [...document.querySelectorAll<HTMLElement>(".sudoku-cell")];
    return pr.map((i) => {
      const c = cells[i];
      const p = c.querySelector<SVGPathElement>(".glyph-svg path");
      return {
        i,
        stroke: p ? getComputedStyle(p).stroke : "(no glyph)",
        resolved: getComputedStyle(c).getPropertyValue("--color-user-ink").trim(),
      };
    });
  }, pair);
  console.log(`BOARD PAIR on A: ${JSON.stringify(strokes)}`);

  // crop 1 — the roster, light
  const well = a.locator(".controls-card .players-roster");
  await well.scrollIntoViewIfNeeded();
  const box = await well.boundingBox();
  if (box)
    await a.screenshot({
      path: `${OUT}/frames/roster-minsep-light.png`,
      clip: { x: box.x - 6, y: box.y - 6, width: Math.min(300, box.width + 12), height: box.height + 12 },
      scale: "device",
    });

  // crop 2 — the two digits, dpr3
  if (pair) {
    const c0 = await a.locator(".sudoku-cell").nth(pair[0]).boundingBox();
    const c1 = await a.locator(".sudoku-cell").nth(pair[1]).boundingBox();
    if (c0 && c1)
      await a.screenshot({
        path: `${OUT}/frames/board-minsep-dpr3-light.png`,
        clip: {
          x: c0.x - 3,
          y: c0.y - 3,
          width: c1.x + c1.width - c0.x + 6,
          height: c0.height + 6,
        },
        scale: "device",
      });
  }
  console.log(
    `crops written; pair hues requested ${WALK.hues[PAIR[0]]} / ${WALK.hues[PAIR[1]]} at C ${WALK.chroma}`,
  );
  await ctx.close();
});
