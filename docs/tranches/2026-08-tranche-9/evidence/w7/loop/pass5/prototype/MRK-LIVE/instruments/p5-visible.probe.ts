/** T9-W7 pass 5 · MRK-LIVE · what the toggle PAINTS, read for the sentinel break (B1): the
 *  ornament's box, the seam values the host computes, and whether a keyboard ring lands. */
import { test } from "@playwright/test";
import fs from "node:fs";
const OUT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MRK-LIVE/logs";
test("P5-VISIBLE · the toggle's ornament, seam and ring", async ({ page }, info) => {
  await page.goto("./?game=sudoku");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.keyboard.press("Tab");
  await page.evaluate(() => document.querySelector<HTMLElement>(".sun-moon-toggle")?.focus({ preventScroll: true }));
  await page.waitForTimeout(800);
  const r = await page.evaluate(() => {
    const t = document.querySelector<HTMLElement>(".sun-moon-toggle")!;
    const icon = document.querySelector<HTMLElement>(".toggle-icon");
    const rest = document.querySelector<HTMLElement>(".toggle-rest");
    const box = (e: Element | null) => { const b = e?.getBoundingClientRect(); return b ? `${b.width.toFixed(1)}x${b.height.toFixed(1)}` : null; };
    const ring = document.querySelector(".focus-ring")?.getBoundingClientRect();
    const cs = getComputedStyle(t);
    return { button: box(t), icon: box(icon), rest: box(rest), bleed: cs.getPropertyValue("--toggle-bleed").trim(), outset: cs.getPropertyValue("--focus-ring-outset").trim(),
      rings: document.querySelectorAll(".focus-ring").length, ring: ring ? `${ring.width.toFixed(1)}x${ring.height.toFixed(1)}` : null,
      docScroll: `${document.documentElement.scrollWidth}x${document.documentElement.scrollHeight} vs ${innerWidth}x${innerHeight}` };
  });
  const tag = process.env.MRKLIVE_TAG ?? "as-is";
  console.log("VISIBLE " + tag + " " + info.project.name + " " + JSON.stringify(r));
  fs.appendFileSync(`${OUT}/P5-visible.log`, `${tag} ${info.project.name} ${JSON.stringify(r)}\n`);
});
