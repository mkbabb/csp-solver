/** T9-W7 pass 5 · MRK-LIVE · is the forced-colours card outline PAINTED? Two photographs of the
 *  card's surround (outline as shipped / outline suppressed by an injected !important rule) and
 *  the count of pixels that differ. A computed `solid` is a style, not paint. */
import { test, expect } from "@playwright/test";
import sharp from "sharp";
import fs from "node:fs";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MRK-LIVE/logs";
test("P5-FORCEDPAINT · the active card's outline, differenced", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium", "chromium applies forced-colors emulation");
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.querySelector<HTMLElement>("button.logo-trigger")?.click());
  await expect(page.locator(".gallery-viewport")).toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(1500);
  await page.keyboard.press("Tab");
  await page.evaluate(() => document.querySelector<HTMLElement>(".gallery-viewport")?.focus());
  await page.waitForTimeout(900);
  const g = await page.evaluate(() => {
    const v = document.querySelector(".gallery-viewport")!;
    const c = document.getElementById(v.getAttribute("aria-activedescendant")!)!;
    const r = c.getBoundingClientRect();
    const vr = v.getBoundingClientRect();
    const cs = getComputedStyle(c);
    // the clipping-ancestor walk: who clips the card's outline box?
    const clips: string[] = [];
    for (let e: Element | null = c.parentElement; e; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.overflow !== "visible" || s.clipPath !== "none" || s.contain.includes("paint"))
        clips.push(`${e.className.toString().split(" ")[0] || e.tagName} overflow=${s.overflow} clip=${s.clipPath} contain=${s.contain}`);
    }
    return { x: r.x, y: r.y, w: r.width, h: r.height, style: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor} off ${cs.outlineOffset}`, vp: [vr.x, vr.y, vr.width, vr.height], clips };
  });
  const clip = { x: Math.max(0, g.x - 12), y: Math.max(0, g.y - 12), width: g.w + 24, height: g.h + 24 };
  const raw = async () => (await sharp(await page.screenshot({ clip })).raw().toBuffer());
  const A = await raw();
  await page.addStyleTag({ content: ".game-card { outline: none !important; }" });
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const B = await raw();
  let diff = 0;
  for (let i = 0; i < A.length; i += 3) if (Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]) > 24) diff++;
  const line = `${process.env.MRKLIVE_TAG ?? "lane"} ${JSON.stringify({ ...g, changedPixels: diff })}`;
  console.log("FORCEDPAINT " + line);
  fs.appendFileSync(`${OUT}/P5-forcedpaint.log`, line + "\n");
});
