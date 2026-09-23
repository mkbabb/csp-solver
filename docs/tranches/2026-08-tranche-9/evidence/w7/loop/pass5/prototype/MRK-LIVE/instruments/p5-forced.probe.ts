/** T9-W7 pass 5 · MRK-LIVE · FORCED COLOURS (ABS critic gap 10; charter leader duty 4).
 *  Under `forced-colors: active` the drawn ring is `display: none` and the UA outline is the
 *  indicator. Per stop: which element carries an outline (the focused element, or the option it
 *  claims), its STYLE and width, and whether a drawn ring is showing. Read on the lane and on the
 *  `74a2b5d9` control, same probe. MRKLIVE_TAG names the arm. */
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MRK-LIVE/logs";

const read = (page: Page, sel: string) =>
  page.evaluate(async (sel) => {
    const e = document.querySelector<HTMLElement>(sel);
    if (!e) return { sel, present: false };
    e.focus({ preventScroll: true });
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    const owned = e.getAttribute("aria-activedescendant");
    const claim = (owned && document.getElementById(owned)) || e;
    const o = (x: Element) => {
      const c = getComputedStyle(x);
      return `${c.outlineStyle} ${c.outlineWidth} ${c.outlineColor}`;
    };
    const ring = document.querySelector(".focus-ring");
    const cell = e.closest(".game-cell");
    return {
      sel,
      present: true,
      took: document.activeElement === e,
      fv: e.matches(":focus-visible"),
      self: o(e),
      claim: claim === e ? "=self" : `${claim.className.toString().split(" ")[0]} ${o(claim)}`,
      cell: cell ? o(cell) : null,
      ringShown: !!ring && getComputedStyle(ring).display !== "none",
      indicated:
        (getComputedStyle(e).outlineStyle !== "none" &&
          parseFloat(getComputedStyle(e).outlineWidth) > 0) ||
        (claim !== e &&
          getComputedStyle(claim).outlineStyle !== "none" &&
          parseFloat(getComputedStyle(claim).outlineWidth) > 0) ||
        (!!cell && getComputedStyle(cell).outlineStyle !== "none") ||
        (!!ring && getComputedStyle(ring).display !== "none"),
    };
  }, sel);

test("P5-FORCED · the indicator under forced colours, per stop", async ({ page }, info) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await page.waitForTimeout(1500);
  const matched = await page.evaluate(() => matchMedia("(forced-colors: active)").matches);
  await page.keyboard.press("Tab");
  const rows = [];
  for (const sel of ["button.logo-trigger", ".sun-moon-toggle", ".drawer-tab", ".sudoku-cell input", ".controls-card button"])
    rows.push(await read(page, sel));
  // the deck
  await page.evaluate(() => document.querySelector<HTMLElement>("button.logo-trigger")?.click());
  await expect(page.locator(".gallery-viewport")).toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(1200);
  await page.keyboard.press("Tab");
  rows.push(await read(page, ".gallery-viewport"));
  rows.push(await read(page, ".staging-btn"));
  const tag = process.env.MRKLIVE_TAG ?? "lane";
  const line = `${tag} ${info.project.name} forcedMatched=${matched} ${JSON.stringify(rows)}`;
  console.log("FORCED " + line);
  fs.appendFileSync(`${OUT}/P5-forced.log`, line + "\n");
});
