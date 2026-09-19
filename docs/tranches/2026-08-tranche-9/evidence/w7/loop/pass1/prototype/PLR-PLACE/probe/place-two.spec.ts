/**
 * PLR-PLACE · THE HEAD'S TWO DISCLOSURES AT ONE ORIGIN.
 *
 * The @mbabb card and the player sheet both hang off the same fixed corner at `left: 0`. PLR-SELF's
 * sibling prototype gave the head a disclosure registry so opening one shuts the other; this build
 * did not. This asks the surface whether both can be painted at once, and by how much they overlap.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/PLR-PLACE/logs";
const say = (k: string, v: unknown) => console.log(`PLC|${k}|${JSON.stringify(v)}`);

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

const state = (p: Page) =>
  p.evaluate(() => {
    const vis = (el: Element | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        painted: cs.visibility !== "hidden" && +cs.opacity > 0 && r.width > 0,
        box: [+r.x.toFixed(1), +r.y.toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)],
      };
    };
    const cards = [...document.querySelectorAll(".hover-card")].map(vis).filter(Boolean);
    return {
      sheet: vis(document.querySelector("[data-lobby]")),
      cards,
    };
  });

test("both head disclosures, at once", async ({ browser }, info) => {
  mkdirSync(OUT, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  await p.goto(SOLO);
  await settled(p);

  const mark = p.locator("[data-player-mark]");
  for (let i = 0; i < (await mark.count()); i++) {
    if (await mark.nth(i).isVisible()) {
      await mark.nth(i).click();
      break;
    }
  }
  await p.waitForTimeout(600);
  const afterSheet = await state(p);
  say("open.sheetOnly", afterSheet);

  // now hover the @mbabb trigger, which is this card's own opening path at a fine pointer
  await p.locator(".attribution-trigger").first().hover();
  await p.waitForTimeout(600);
  const both = await state(p);
  say("open.sheetThenHoverCard", both);

  const out = { engine: info.project.name, afterSheet, both };
  writeFileSync(join(OUT, `two-disclosures-${info.project.name}.json`), JSON.stringify(out, null, 1));
  await ctx.close();
});
