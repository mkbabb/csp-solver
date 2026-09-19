/** P10b — the two-colour frame: a digit written in --color-user-ink (your blue) with the
 *  mark above it carrying the ROOM's ink for you (index 0 = oklch(… 0deg)), in one crop. */
import { test, expect, type Page } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";
import { OVERLAY_SRC } from "./proto-overlay";

const OUT = process.env.PLR_OUT!;
test.setTimeout(180000);

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

test("P10b — two colours, one person, one page", async ({ browser }, info) => {
  if (info.project.name !== "chromium") return;
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const a = await ctx.newPage();
  await a.goto("./?size=3&difficulty=EASY&wire=local");
  await settled(a);

  // write one digit in your own hand
  const empty = a.locator(".sudoku-cell:not(.is-given)").first();
  await empty.click({ timeout: 15000 });
  await a.keyboard.press("2"); // size=3 takes 1..3
  await a.waitForTimeout(200);
  await a.keyboard.press("3");
  await a.waitForTimeout(600);

  const anchor = await a.evaluate(() => {
    const t = [...document.querySelectorAll<HTMLElement>(".attribution-trigger")].find(
      (e) => e.getBoundingClientRect().width > 0,
    )!;
    const r = t.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  await a.evaluate(`${OVERLAY_SRC}(${JSON.stringify({
    object: "plain", n: 2, heightPx: 36, threshold: 99,
    left: anchor.x + anchor.w + 8, top: anchor.y, floorPx: 44, soloGraphite: false,
  })})`);

  const inkFacts = await a.evaluate(() => {
    const cell = [...document.querySelectorAll<HTMLElement>(".sudoku-cell")].find(
      (c) => c.querySelector(".glyph-svg") && !c.classList.contains("is-given"),
    );
    const p = cell?.querySelector<SVGPathElement>(".glyph-svg path");
    const entered = [...document.querySelectorAll<SVGPathElement>(".sudoku-cell .glyph-svg path")]
      .map((e) => getComputedStyle(e).stroke);
    const mark = document.querySelector<SVGPathElement>("#plr-proto path[data-mark='0']");
    return {
      digitStroke: p ? getComputedStyle(p).stroke : null,
      markStroke: mark ? getComputedStyle(mark).stroke : null,
      userInk: getComputedStyle(document.documentElement).getPropertyValue("--color-user-ink").trim(),
      cellBox: cell ? cell.getBoundingClientRect().toJSON() : null,
      allGlyphStrokes: [...new Set(entered)],
    };
  });
  fs.mkdirSync(OUT, { recursive: true });
  fs.appendFileSync(path.join(OUT, "proto2.log"), `P10b|${JSON.stringify(inkFacts)}\n`);
  const h = Math.min(420, (inkFacts.cellBox?.bottom ?? 380) + 16);
  await a.screenshot({ path: path.join(OUT, "two-colour-390-light.png"), clip: { x: 0, y: 0, width: 390, height: h } });
  await ctx.close();
});
