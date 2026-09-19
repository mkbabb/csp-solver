/**
 * PLR-PLACE pass-1 CRITIQUE probe 6 — what the lap COSTS on a phone.
 *
 * The lap is banked as a spatial delta. This asks the reader's question instead: how many board
 * cells does the open sheet take the tap off, and does a tap on the sheet over a covered cell do
 * anything at all (the sheet carries `@click.stop`, so it does not even dismiss).
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const OUT = join(__dirname, "..", "logs");
const MARK = "[data-player-mark]";
const bank: Record<string, unknown> = {};
const rec = (k: string, v: unknown) => {
  bank[k] = v;
  console.log(`CRIT6|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);
};
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

test("CRITIC 6 — the cells the sheet takes", async ({ browser }, info) => {
  const eng = info.project.name;
  mkdirSync(OUT, { recursive: true });
  for (const h of [844, 664]) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: h },
      hasTouch: true,
      isMobile: eng === "chromium",
      deviceScaleFactor: 3,
    });
    const p = await ctx.newPage();
    await p.goto(SOLO);
    await settled(p);
    const marks = p.locator(MARK);
    const n = await marks.count();
    for (let i = 0; i < n; i++)
      if (await marks.nth(i).isVisible()) {
        await marks.nth(i).click();
        break;
      }
    await p.waitForTimeout(900);
    const read = await p.evaluate(() => {
      const sheet = document.querySelector("[data-lobby]") as HTMLElement | null;
      if (!sheet) return { covered: -1 };
      const cells = [...document.querySelectorAll(".sudoku-cell")];
      let covered = 0;
      let stolen = 0;
      for (const c of cells) {
        const r = c.getBoundingClientRect();
        const cx = r.x + r.width / 2;
        const cy = r.y + r.height / 2;
        const s = sheet.getBoundingClientRect();
        if (cx > s.left && cx < s.right && cy > s.top && cy < s.bottom) {
          covered++;
          const hit = document.elementFromPoint(cx, cy);
          if (hit && sheet.contains(hit)) stolen++;
        }
      }
      return {
        covered,
        stolen,
        cells: cells.length,
        sheet: { top: +sheet.getBoundingClientRect().top.toFixed(1), bottom: +sheet.getBoundingClientRect().bottom.toFixed(1) },
      };
    });
    rec(`phone${h}.coverage`, read);

    // a tap on the sheet where a cell used to be: does anything happen?
    const before = await p.evaluate(() => document.querySelectorAll("[data-lobby]").length);
    const pt = await p.evaluate(() => {
      const s = document.querySelector("[data-lobby]")!.getBoundingClientRect();
      return { x: s.left + s.width / 2, y: s.bottom - 8 };
    });
    await p.mouse.click(pt.x, pt.y);
    await p.waitForTimeout(400);
    const after = await p.evaluate(() => document.querySelectorAll("[data-lobby]").length);
    rec(`phone${h}.tapOnSheet`, { before, after, dismissed: before === 1 && after === 0 });
    await ctx.close();
  }
  writeFileSync(join(OUT, `critic6-${eng}.json`), JSON.stringify(bank, null, 2));
});
